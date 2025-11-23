import cv2
import mediapipe as mp
import time
import numpy as np
import os 
from collections import deque

# --------- CONFIG / THRESHOLDS (tweak these) ----------
BLINK_EAR_THRESHOLD = 0.20        # EAR below this => eye considered closed (tune per camera)
BLINK_MIN_FRAMES = 2              # how many consecutive frames below threshold to start a blink (debounce)
# DROWSY_EAR_DURATION = 0.8       # REMOVED
FATIGUE_BLINK_RATE = 25           # Blinks per minute threshold for "fatigue" flag (Recommended value)
AWAY_REQUIRED_SECONDS = 5.0       # require this many seconds of "away" to mark NOT focused
BOTH_EYES_AGREE_DIFF = 0.20       # max allowed difference between left/right horizontal gaze ratios
HORIZONTAL_CENTER_LOW = 0.25      # avg ratio lower bound for center (looking straight)
HORIZONTAL_CENTER_HIGH = 0.75     # avg ratio upper bound for center (looking straight)
VERTICAL_CENTER_LOW = 0.25        # vertical center bounds (0..1)
VERTICAL_CENTER_HIGH = 0.75       # vertical center bounds (0..1)

# --------- SETUP MediaPipe FaceMesh ----------
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(max_num_faces=1, refine_landmarks=True,
                                min_detection_confidence=0.5, min_tracking_confidence=0.5)

# Landmark groups used (MediaPipe 468-landmark indices)
LEFT_EYE_CORNERS = [33, 133]       # left eye outer, inner
RIGHT_EYE_CORNERS = [362, 263]     # right eye outer, inner
FACE_OVAL = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109]

LEFT_IRIS = [468, 469, 470, 471]    # left iris points
RIGHT_IRIS = [473, 474, 475, 476]   # right iris points

# EAR points (P1..P6) for MediaPipe (corrected)
LEFT_EAR_POINTS = [33, 159, 158, 133, 153, 144]
RIGHT_EAR_POINTS = [362, 386, 385, 263, 373, 380]

# Helper functions
def landmarks_xy(landmarks, idx, w, h):
    lm = landmarks[idx]
    return int(lm.x * w), int(lm.y * h)

def mean_point(landmarks, indices, w, h):
    xs = [landmarks[i].x for i in indices]
    ys = [landmarks[i].y for i in indices]
    return int(np.mean(xs) * w), int(np.mean(ys) * h)

def euclidean(a, b):
    # a and b are tuples (x, y)
    return np.linalg.norm(np.array(a) - np.array(b))

def compute_EAR(landmarks, pts, w, h):
    # Using MediaPipe-normalized coords scaled to pixels
    p1 = landmarks[pts[0]]
    p2 = landmarks[pts[1]]
    p3 = landmarks[pts[2]]
    p4 = landmarks[pts[3]]
    p5 = landmarks[pts[4]]
    p6 = landmarks[pts[5]]
    # vertical distances (using the coordinates from MediaPipe objects)
    V1 = euclidean((p2.x * w, p2.y * h), (p6.x * w, p6.y * h))
    V2 = euclidean((p3.x * w, p3.y * h), (p5.x * w, p5.y * h))
    # horizontal distance
    H = euclidean((p1.x * w, p1.y * h), (p4.x * w, p4.y * h)) + 1e-6
    return (V1 + V2) / (2.0 * H)

def horizontal_gaze_ratio(landmarks, eye_corners, iris_center, w, h):
    left_x = landmarks[eye_corners[0]].x * w
    right_x = landmarks[eye_corners[1]].x * w
    if right_x - left_x == 0:
        return 0.5
    return (iris_center[0] - left_x) / (right_x - left_x)

def vertical_gaze_ratio(landmarks, top_idx, bottom_idx, iris_center, w, h):
    top_y = landmarks[top_idx].y * h
    bottom_y = landmarks[bottom_idx].y * h
    if bottom_y - top_y == 0:
        return 0.5
    return (iris_center[1] - top_y) / (bottom_y - top_y)

def draw_metrics(frame, w, h, focused, gaze_h, gaze_v, blink_rate_bpm, away_seconds, focus_score):
    # Define text settings
    font = cv2.FONT_HERSHEY_SIMPLEX
    font_scale = 0.7
    color_green = (0, 255, 0)
    color_red = (0, 0, 255)
    color_yellow = (0, 255, 255)
    thickness = 2
    
    # Status
    focus_status = "Focused" if focused else "DISTRACTED"
    status_color = color_green if focused else color_red
    cv2.putText(frame, f"STATUS: {focus_status}", (20, 30), font, 1.0, status_color, 3, cv2.LINE_AA)

    # Metrics - Drowsy is removed
    metrics = [
        (f"Gaze H: {gaze_h:.2f}", 60, color_green),
        (f"Gaze V: {gaze_v:.2f}", 90, color_green),
        (f"Blink Rate: {blink_rate_bpm:.1f} BPM", 120, color_red if blink_rate_bpm >= FATIGUE_BLINK_RATE else color_green),
        (f"Away Time: {away_seconds:.1f}s", 150, color_yellow if away_seconds > 0 else color_green),
        (f"Focus Score: {focus_score}", h - 30, color_green)
    ]

    # Change the unpacking to expect 3 values: text, y_pos, and current_color
    for text, y_pos, current_color in metrics:
        cv2.putText(frame, text, (20, y_pos), font, font_scale, current_color, thickness, cv2.LINE_AA)
    
    # Draw a colored rectangle based on the focus score in the corner
    score_color = (0, int(255 * (focus_score / 100)), int(255 * (1 - focus_score / 100))) 
    cv2.rectangle(frame, (w - 150, 10), (w - 10, 60), score_color, -1)
    cv2.putText(frame, f"Score: {focus_score}", (w - 140, 45), font, font_scale, (255, 255, 255), thickness, cv2.LINE_AA)

# Sliding window for blink timestamps to compute blinks/minute
blink_timestamps = deque()

# State variables (CLEANED)
blink_in_progress = False
blink_frame_count = 0
away_start = None

start_time = time.time()

# Webcam capture
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    raise RuntimeError("Cannot open webcam. Make sure camera is available.")

# Main loop
try:
    while True:
        ret, frame = cap.read()
        if not ret:
            break 
            
        h, w = frame.shape[:2]
        frame = cv2.flip(frame, 1) # Flip for mirror effect
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = face_mesh.process(rgb)

        # Initialize metrics
        focused = False
        gaze_h = 0.5
        gaze_v = 0.5
        blink_rate_bpm = 0.0
        away_seconds = 0.0
        focus_score = 0
        
        current_time = time.time()
        
        # Calculate blink rate (blinks in the last 60 seconds)
        cutoff = current_time - 60.0
        while blink_timestamps and blink_timestamps[0] < cutoff:
            blink_timestamps.popleft()
        blink_count = len(blink_timestamps)
        blink_rate_bpm = blink_count # Blinks in the last 60 seconds = BPM
        
        face_detected = False
        
        if results.multi_face_landmarks:
            lm = results.multi_face_landmarks[0].landmark
            face_detected = True

            # --- VISUALS: Draw face outline and irises ---
            points = [landmarks_xy(lm, i, w, h) for i in FACE_OVAL]
            points_np = np.array(points, np.int32).reshape((-1, 1, 2))
            cv2.polylines(frame, [points_np], isClosed=True, color=(255, 255, 255), thickness=1)

            L_iris = mean_point(lm, LEFT_IRIS, w, h)
            R_iris = mean_point(lm, RIGHT_IRIS, w, h)
            cv2.circle(frame, L_iris, 2, (0, 255, 255), -1)
            cv2.circle(frame, R_iris, 2, (0, 255, 255), -1)

            # horizontal gaze ratios
            L_ratio = horizontal_gaze_ratio(lm, LEFT_EYE_CORNERS, L_iris, w, h)
            R_ratio = horizontal_gaze_ratio(lm, RIGHT_EYE_CORNERS, R_iris, w, h)
            gaze_h = (L_ratio + R_ratio) / 2.0

            # vertical gaze
            L_vert = vertical_gaze_ratio(lm, 159, 145, L_iris, w, h) 
            R_vert = vertical_gaze_ratio(lm, 386, 374, R_iris, w, h)
            gaze_v = (L_vert + R_vert) / 2.0

            eyes_agree = abs(L_ratio - R_ratio) < BOTH_EYES_AGREE_DIFF

            # head yaw proxy (using nose tip to face center)
            left_eye_center = mean_point(lm, LEFT_EYE_CORNERS, w, h)
            # FIX applied here: using the defined constant RIGHT_EYE_CORNERS
            right_eye_center = mean_point(lm, RIGHT_EYE_CORNERS, w, h) 
            
            face_mid_x = (left_eye_center[0] + right_eye_center[0]) / 2.0
            nose = landmarks_xy(lm, 1, w, h)
            yaw_proxy = (nose[0] - face_mid_x) / (right_eye_center[0] - left_eye_center[0] + 1e-6)

            # away detection
            is_gaze_away = (gaze_h < 0.20) or (gaze_h > 0.80)
            is_head_turned = (abs(yaw_proxy) > 0.55)
            is_away = is_gaze_away or is_head_turned 
            
            if is_away:
                if away_start is None:
                    away_start = current_time
                away_seconds = current_time - away_start
            else:
                away_seconds = 0.0
                away_start = None

            center_h = HORIZONTAL_CENTER_LOW < gaze_h < HORIZONTAL_CENTER_HIGH
            center_v = VERTICAL_CENTER_LOW < gaze_v < VERTICAL_CENTER_HIGH
            head_forward = abs(yaw_proxy) < 0.45

            # Focused logic
            is_required_away = away_start and (current_time - away_start) >= AWAY_REQUIRED_SECONDS

            if not is_required_away and center_h and center_v and eyes_agree and head_forward:
                focused = True
            else:
                focused = False

            # ---------- BLINK DETECTION (Simplified) ----------
            left_EAR = compute_EAR(lm, LEFT_EAR_POINTS, w, h)
            right_EAR = compute_EAR(lm, RIGHT_EAR_POINTS, w, h)
            EAR_avg = (left_EAR + right_EAR) / 2.0

            if EAR_avg < BLINK_EAR_THRESHOLD:  # Eyes are closed
                blink_frame_count += 1
                
                if not blink_in_progress and blink_frame_count >= BLINK_MIN_FRAMES:
                    blink_in_progress = True
                    blink_timestamps.append(current_time)
                
            else:
                # Eyes are open
                if blink_in_progress:
                    blink_in_progress = False
                
                blink_frame_count = 0
                
            # Focus score calculation (Drowsiness penalty REMOVED)
            score = 0
            score += 30 * center_h
            score += 20 * center_v
            score += 15 * eyes_agree
            score += 15 * head_forward
            
            # Away penalty contribution
            away_penalty_factor = (1 if away_start is None else max(0, 1 - (away_seconds / AWAY_REQUIRED_SECONDS)))
            score += 20 * away_penalty_factor
            
            # --- DROWSINESS PENALTY REMOVED HERE ---
            
            # Fatigue penalty
            if blink_rate_bpm > FATIGUE_BLINK_RATE:
                score -= 10 * (blink_rate_bpm / FATIGUE_BLINK_RATE)
            
            focus_score = max(0, min(100, int(score)))


        else:
            # NO FACE detected: Maximize away time and score is 0
            if away_start is None:
                away_start = current_time
            away_seconds = current_time - away_start
            
            # Reset states when face is gone
            blink_in_progress = False
            blink_frame_count = 0
            focus_score = 0
            
        # Draw metrics and display frame
        # Note: The draw_metrics function signature must be updated to remove 'drowsy_flag'
        draw_metrics(frame, w, h, focused, gaze_h, gaze_v, blink_rate_bpm, away_seconds, focus_score)

        cv2.imshow('Focus Monitor', frame)

        # exit key (ESC)
        if cv2.waitKey(1) & 0xFF == 27: 
            break

finally:
    cap.release()
    cv2.destroyAllWindows()
    face_mesh.close()