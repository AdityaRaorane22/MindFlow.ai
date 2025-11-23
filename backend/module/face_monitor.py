import cv2
import mediapipe as mp
import time
import numpy as np
import threading
from collections import deque

class FaceMonitor:
    def _init_(self, socketio):
        self.socketio = socketio
        self.running = False
        self.thread = None
        
        # Configuration
        self.BLINK_EAR_THRESHOLD = 0.20
        self.BLINK_MIN_FRAMES = 2
        self.FATIGUE_BLINK_RATE = 25
        self.AWAY_REQUIRED_SECONDS = 5.0
        
        # MediaPipe setup
        self.mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        
        # Landmark indices
        self.LEFT_EYE_CORNERS = [33, 133]
        self.RIGHT_EYE_CORNERS = [362, 263]
        self.LEFT_IRIS = [468, 469, 470, 471]
        self.RIGHT_IRIS = [473, 474, 475, 476]
        self.LEFT_EAR_POINTS = [33, 159, 158, 133, 153, 144]
        self.RIGHT_EAR_POINTS = [362, 386, 385, 263, 373, 380]
        
        # State
        self.blink_timestamps = deque()
        self.blink_in_progress = False
        self.blink_frame_count = 0
        self.away_start = None
        self.latest_score = 0
        self.cap = None
        
    def compute_EAR(self, landmarks, pts, w, h):
        """Calculate Eye Aspect Ratio"""
        p1 = landmarks[pts[0]]
        p2 = landmarks[pts[1]]
        p3 = landmarks[pts[2]]
        p4 = landmarks[pts[3]]
        p5 = landmarks[pts[4]]
        p6 = landmarks[pts[5]]
        
        V1 = np.linalg.norm(np.array([p2.x * w, p2.y * h]) - np.array([p6.x * w, p6.y * h]))
        V2 = np.linalg.norm(np.array([p3.x * w, p3.y * h]) - np.array([p5.x * w, p5.y * h]))
        H = np.linalg.norm(np.array([p1.x * w, p1.y * h]) - np.array([p4.x * w, p4.y * h])) + 1e-6
        
        return (V1 + V2) / (2.0 * H)
    
    def horizontal_gaze_ratio(self, landmarks, eye_corners, iris_center, w, h):
        """Calculate horizontal gaze ratio"""
        left_x = landmarks[eye_corners[0]].x * w
        right_x = landmarks[eye_corners[1]].x * w
        if right_x - left_x == 0:
            return 0.5
        return (iris_center[0] - left_x) / (right_x - left_x)
    
    def mean_point(self, landmarks, indices, w, h):
        """Calculate mean point of multiple landmarks"""
        xs = [landmarks[i].x for i in indices]
        ys = [landmarks[i].y for i in indices]
        return int(np.mean(xs) * w), int(np.mean(ys) * h)
    
    def monitor_loop(self):
        """Main monitoring loop"""
        self.cap = cv2.VideoCapture(0)
        
        if not self.cap.isOpened():
            print("❌ Cannot open webcam")
            return
        
        print("✅ Face monitoring started")
        
        while self.running:
            ret, frame = self.cap.read()
            if not ret:
                continue
            
            h, w = frame.shape[:2]
            frame = cv2.flip(frame, 1)
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = self.face_mesh.process(rgb)
            
            current_time = time.time()
            
            # Calculate blink rate
            cutoff = current_time - 60.0
            while self.blink_timestamps and self.blink_timestamps[0] < cutoff:
                self.blink_timestamps.popleft()
            blink_rate_bpm = len(self.blink_timestamps)
            
            focused = False
            gaze_h = 0.5
            gaze_v = 0.5
            away_seconds = 0.0
            focus_score = 0
            
            if results.multi_face_landmarks:
                lm = results.multi_face_landmarks[0].landmark
                
                # Calculate iris positions
                L_iris = self.mean_point(lm, self.LEFT_IRIS, w, h)
                R_iris = self.mean_point(lm, self.RIGHT_IRIS, w, h)
                
                # Gaze ratios
                L_ratio = self.horizontal_gaze_ratio(lm, self.LEFT_EYE_CORNERS, L_iris, w, h)
                R_ratio = self.horizontal_gaze_ratio(lm, self.RIGHT_EYE_CORNERS, R_iris, w, h)
                gaze_h = (L_ratio + R_ratio) / 2.0
                
                # Check if eyes agree
                eyes_agree = abs(L_ratio - R_ratio) < 0.20
                
                # Head position
                left_eye_center = self.mean_point(lm, self.LEFT_EYE_CORNERS, w, h)
                right_eye_center = self.mean_point(lm, self.RIGHT_EYE_CORNERS, w, h)
                face_mid_x = (left_eye_center[0] + right_eye_center[0]) / 2.0
                nose = (int(lm[1].x * w), int(lm[1].y * h))
                yaw_proxy = (nose[0] - face_mid_x) / (right_eye_center[0] - left_eye_center[0] + 1e-6)
                
                # Away detection
                is_gaze_away = (gaze_h < 0.20) or (gaze_h > 0.80)
                is_head_turned = (abs(yaw_proxy) > 0.55)
                is_away = is_gaze_away or is_head_turned
                
                if is_away:
                    if self.away_start is None:
                        self.away_start = current_time
                    away_seconds = current_time - self.away_start
                else:
                    away_seconds = 0.0
                    self.away_start = None
                
                # Focus determination
                center_h = 0.25 < gaze_h < 0.75
                center_v = True  # Simplified for now
                head_forward = abs(yaw_proxy) < 0.45
                is_required_away = self.away_start and (current_time - self.away_start) >= self.AWAY_REQUIRED_SECONDS
                
                if not is_required_away and center_h and center_v and eyes_agree and head_forward:
                    focused = True
                
                # Blink detection
                left_EAR = self.compute_EAR(lm, self.LEFT_EAR_POINTS, w, h)
                right_EAR = self.compute_EAR(lm, self.RIGHT_EAR_POINTS, w, h)
                EAR_avg = (left_EAR + right_EAR) / 2.0
                
                if EAR_avg < self.BLINK_EAR_THRESHOLD:
                    self.blink_frame_count += 1
                    if not self.blink_in_progress and self.blink_frame_count >= self.BLINK_MIN_FRAMES:
                        self.blink_in_progress = True
                        self.blink_timestamps.append(current_time)
                else:
                    if self.blink_in_progress:
                        self.blink_in_progress = False
                    self.blink_frame_count = 0
                
                # Calculate focus score
                score = 0
                score += 30 if center_h else 0
                score += 20 if center_v else 0
                score += 15 if eyes_agree else 0
                score += 15 if head_forward else 0
                
                away_penalty_factor = 1 if self.away_start is None else max(0, 1 - (away_seconds / self.AWAY_REQUIRED_SECONDS))
                score += 20 * away_penalty_factor
                
                if blink_rate_bpm > self.FATIGUE_BLINK_RATE:
                    score -= 10 * (blink_rate_bpm / self.FATIGUE_BLINK_RATE)
                
                focus_score = max(0, min(100, int(score)))
                self.latest_score = focus_score
            else:
                # No face detected
                if self.away_start is None:
                    self.away_start = current_time
                away_seconds = current_time - self.away_start
                focus_score = 0
                self.latest_score = 0
            
            # Emit data to frontend
            self.socketio.emit('face_data', {
                'focused': focused,
                'focus_score': focus_score,
                'gaze_h': round(gaze_h, 2),
                'gaze_v': round(gaze_v, 2),
                'blink_rate': round(blink_rate_bpm, 1),
                'away_seconds': round(away_seconds, 1),
                'face_detected': results.multi_face_landmarks is not None
            })
            
            time.sleep(0.1)  # 10 FPS
        
        self.cap.release()
        print("🛑 Face monitoring stopped")
    
    def start(self):
        """Start monitoring in separate thread"""
        if not self.running:
            self.running = True
            self.thread = threading.Thread(target=self.monitor_loop, daemon=True)
            self.thread.start()
    
    def stop(self):
        """Stop monitoring"""
        self.running = False
        if self.thread:
            self.thread.join(timeout=2)
        if self.cap:
            self.cap.release()
        self.face_mesh.close()
    
    def get_latest_score(self):
        """Get the latest focus score"""
        return self.latest_score