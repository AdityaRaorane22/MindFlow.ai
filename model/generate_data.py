import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Set random seed for reproducibility
np.random.seed(42)

def generate_focus_session_data(num_samples=5000):
    """
    Generate synthetic time-series data for focus state detection
    Features: eye movement, mouse activity, keyboard activity, tab switches
    Labels: focus_state (0=distracted, 1=focused, 2=deep_flow)
    """
    
    data = []
    
    for i in range(num_samples):
        # Determine focus state
        focus_state = np.random.choice([0, 1, 2], p=[0.25, 0.50, 0.25])
        
        if focus_state == 0:  # Distracted
            eye_fixation_duration = np.random.uniform(50, 200)  # ms, short fixations
            eye_saccade_velocity = np.random.uniform(300, 600)  # deg/s, rapid movements
            eye_blink_rate = np.random.uniform(25, 40)  # blinks/min, high
            mouse_movements = np.random.randint(40, 100)  # count per minute, erratic
            mouse_idle_time = np.random.uniform(0, 3)  # seconds, low
            keyboard_strokes = np.random.randint(0, 30)  # per minute, low/inconsistent
            keyboard_burst_pattern = np.random.uniform(0, 0.3)  # low consistency
            tab_switches = np.random.randint(5, 20)  # frequent switching
            scroll_speed = np.random.uniform(400, 800)  # px/s, fast/nervous
            time_on_task = np.random.uniform(0, 5)  # minutes, short bursts
            
        elif focus_state == 1:  # Focused
            eye_fixation_duration = np.random.uniform(200, 400)  # ms, moderate
            eye_saccade_velocity = np.random.uniform(100, 300)  # deg/s, controlled
            eye_blink_rate = np.random.uniform(12, 20)  # blinks/min, normal
            mouse_movements = np.random.randint(10, 40)  # count per minute, purposeful
            mouse_idle_time = np.random.uniform(3, 15)  # seconds, moderate
            keyboard_strokes = np.random.randint(30, 80)  # per minute, steady
            keyboard_burst_pattern = np.random.uniform(0.5, 0.7)  # moderate consistency
            tab_switches = np.random.randint(1, 5)  # minimal switching
            scroll_speed = np.random.uniform(100, 300)  # px/s, steady
            time_on_task = np.random.uniform(5, 20)  # minutes, sustained
            
        else:  # Deep Flow (state 2)
            eye_fixation_duration = np.random.uniform(400, 800)  # ms, long fixations
            eye_saccade_velocity = np.random.uniform(50, 150)  # deg/s, minimal movement
            eye_blink_rate = np.random.uniform(5, 12)  # blinks/min, reduced
            mouse_movements = np.random.randint(2, 15)  # count per minute, minimal
            mouse_idle_time = np.random.uniform(15, 60)  # seconds, very stable
            keyboard_strokes = np.random.randint(60, 150)  # per minute, high & consistent
            keyboard_burst_pattern = np.random.uniform(0.75, 0.95)  # high consistency
            tab_switches = np.random.randint(0, 2)  # almost no switching
            scroll_speed = np.random.uniform(20, 100)  # px/s, very controlled
            time_on_task = np.random.uniform(20, 60)  # minutes, deep immersion
        
        # Add some noise to make it realistic
        noise_factor = 0.1
        
        data.append({
            'timestamp': datetime.now() + timedelta(seconds=i*10),
            'eye_fixation_duration_ms': eye_fixation_duration * (1 + np.random.uniform(-noise_factor, noise_factor)),
            'eye_saccade_velocity': eye_saccade_velocity * (1 + np.random.uniform(-noise_factor, noise_factor)),
            'eye_blink_rate': max(0, eye_blink_rate * (1 + np.random.uniform(-noise_factor, noise_factor))),
            'mouse_movements_per_min': int(mouse_movements * (1 + np.random.uniform(-noise_factor, noise_factor))),
            'mouse_idle_time_sec': mouse_idle_time * (1 + np.random.uniform(-noise_factor, noise_factor)),
            'keyboard_strokes_per_min': int(keyboard_strokes * (1 + np.random.uniform(-noise_factor, noise_factor))),
            'keyboard_burst_pattern': np.clip(keyboard_burst_pattern * (1 + np.random.uniform(-noise_factor, noise_factor)), 0, 1),
            'tab_switches_per_min': int(tab_switches * (1 + np.random.uniform(-noise_factor, noise_factor))),
            'scroll_speed_px_per_sec': scroll_speed * (1 + np.random.uniform(-noise_factor, noise_factor)),
            'time_on_task_min': time_on_task * (1 + np.random.uniform(-noise_factor, noise_factor)),
            'focus_state': focus_state  # 0=distracted, 1=focused, 2=deep_flow
        })
    
    df = pd.DataFrame(data)
    return df

# Generate data
print("Generating synthetic focus detection data...")
df = generate_focus_session_data(5000)

# Save to CSV
df.to_csv('focus_detection_data.csv', index=False)
print(f"\n✓ Generated {len(df)} samples")
print(f"✓ Saved to: focus_detection_data.csv")
print(f"\nData Distribution:")
print(df['focus_state'].value_counts())
print(f"\nSample Data:")
print(df.head())
print(f"\nData Info:")
print(df.describe())