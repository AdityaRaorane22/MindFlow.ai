"""
data_collector.py - Collect multimodal data for flow state training
Run this alongside your existing trackers to build a labeled dataset
"""

import pandas as pd
import numpy as np
from datetime import datetime
import json
import time
from pathlib import Path

class FlowDataCollector:
    def __init__(self, session_name=None):
        """Initialize data collector with session tracking"""
        self.session_name = session_name or f"session_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        self.data_buffer = []
        self.session_start = time.time()
        
        # Create data directory
        self.data_dir = Path("flow_dataset")
        self.data_dir.mkdir(exist_ok=True)
        
        print(f"📊 Data Collection Started: {self.session_name}")
        print(f"📁 Saving to: {self.data_dir}")
        
    def collect_sample(self, vision_data, wpm_data, app_data, label=None):
        """
        Collect a single timestamped sample with all modalities
        
        Args:
            vision_data: dict from vision_tracker (focus_score, gaze_h, gaze_v, blink_rate, etc.)
            wpm_data: dict from wpm_tracker (wpm, typed_chars, etc.)
            app_data: dict from app_tracker (active_app, switch_count, etc.)
            label: int (0=distracted, 1=focused, 2=flow) - manual or automatic
        """
        
        timestamp = time.time() - self.session_start
        
        sample = {
            # Timestamp
            'timestamp': timestamp,
            'datetime': datetime.now().isoformat(),
            
            # Vision features (eye tracking + face detection)
            'gaze_horizontal': vision_data.get('gaze_h', 0.5),
            'gaze_vertical': vision_data.get('gaze_v', 0.5),
            'blink_rate_bpm': vision_data.get('blink_rate', 0),
            'away_seconds': vision_data.get('away_sec', 0),
            'eyes_agree': vision_data.get('eyes_agree', False),
            'head_forward': vision_data.get('head_forward', False),
            'focus_score': vision_data.get('score', 0),
            
            # Keyboard/Mouse features
            'wpm': wpm_data.get('wpm', 0),
            'typed_chars': wpm_data.get('typed_chars', 0),
            'typing_active': wpm_data.get('typing_active', False),
            
            # Application features
            'active_app': app_data.get('app_title', 'Unknown'),
            'is_browser': app_data.get('is_browser', False),
            'app_switch_count': app_data.get('switch_count', 0),
            'time_in_current_app': app_data.get('time_in_app', 0),
            
            # Derived features
            'arousal_proxy': self._calculate_arousal(vision_data, wpm_data),
            'valence_proxy': self._calculate_valence(vision_data, wpm_data),
            
            # Label (ground truth)
            'label': label if label is not None else self._auto_label(vision_data, wpm_data, app_data)
        }
        
        self.data_buffer.append(sample)
        
        # Auto-save every 100 samples
        if len(self.data_buffer) % 100 == 0:
            self.save_buffer()
            
        return sample
    
    def _calculate_arousal(self, vision_data, wpm_data):
        """
        Arousal proxy based on paper: high arousal = high blink rate, high WPM
        Returns: float 0-1
        """
        blink_component = min(vision_data.get('blink_rate', 0) / 30, 1.0)
        wpm_component = min(wpm_data.get('wpm', 0) / 80, 1.0)
        return (blink_component + wpm_component) / 2
    
    def _calculate_valence(self, vision_data, wpm_data):
        """
        Valence proxy based on paper: high valence = centered gaze, steady performance
        Returns: float 0-1
        """
        gaze_h = vision_data.get('gaze_h', 0.5)
        gaze_centered = 1.0 - abs(gaze_h - 0.5) * 2
        
        focus_component = vision_data.get('score', 0) / 100
        
        return (gaze_centered + focus_component) / 2
    
    def _auto_label(self, vision_data, wpm_data, app_data):
        """
        Automatic labeling based on flow theory (high arousal + high valence)
        0 = Distracted/Bored
        1 = Focused (but not flow)
        2 = Flow State (high arousal + high valence + sustained)
        """
        arousal = self._calculate_arousal(vision_data, wpm_data)
        valence = self._calculate_valence(vision_data, wpm_data)
        away_time = vision_data.get('away_sec', 0)
        
        # Flow: high arousal (>0.7) + high valence (>0.7) + not away
        if arousal > 0.7 and valence > 0.7 and away_time < 1:
            return 2
        
        # Focused: decent valence + low away time
        elif valence > 0.5 and away_time < 2:
            return 1
        
        # Distracted: low valence OR away
        else:
            return 0
    
    def manual_label(self, label):
        """
        Manually label the last N samples (for user feedback)
        Call this when user presses a hotkey to mark their state
        """
        if self.data_buffer:
            self.data_buffer[-1]['label'] = label
            self.data_buffer[-1]['manual_label'] = True
            print(f"✅ Manually labeled last sample as: {['Distracted', 'Focused', 'Flow'][label]}")
    
    def save_buffer(self):
        """Save current buffer to CSV"""
        if not self.data_buffer:
            return
        
        df = pd.DataFrame(self.data_buffer)
        filepath = self.data_dir / f"{self.session_name}.csv"
        
        # Append if file exists, otherwise create new
        if filepath.exists():
            df.to_csv(filepath, mode='a', header=False, index=False)
        else:
            df.to_csv(filepath, index=False)
        
        print(f"💾 Saved {len(self.data_buffer)} samples to {filepath}")
        self.data_buffer = []
    
    def get_session_stats(self):
        """Get statistics for current session"""
        if not self.data_buffer:
            return {}
        
        df = pd.DataFrame(self.data_buffer)
        
        return {
            'total_samples': len(df),
            'duration_minutes': (time.time() - self.session_start) / 60,
            'flow_samples': (df['label'] == 2).sum(),
            'focused_samples': (df['label'] == 1).sum(),
            'distracted_samples': (df['label'] == 0).sum(),
            'avg_wpm': df['wpm'].mean(),
            'avg_focus_score': df['focus_score'].mean()
        }
    
    def finalize_session(self):
        """End session and save all data"""
        self.save_buffer()
        stats = self.get_session_stats()
        
        # Save session metadata
        metadata = {
            'session_name': self.session_name,
            'start_time': datetime.fromtimestamp(self.session_start).isoformat(),
            'end_time': datetime.now().isoformat(),
            'stats': stats
        }
        
        metadata_path = self.data_dir / f"{self.session_name}_metadata.json"
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        print(f"\n📊 Session Complete!")
        print(f"Duration: {stats.get('duration_minutes', 0):.1f} minutes")
        print(f"Total Samples: {stats.get('total_samples', 0)}")
        print(f"Flow: {stats.get('flow_samples', 0)} | Focused: {stats.get('focused_samples', 0)} | Distracted: {stats.get('distracted_samples', 0)}")


# ============================================
# INTEGRATION EXAMPLE
# ============================================

if __name__ == "__main__":
    # Example usage - integrate this into your flow_integrator.py
    
    collector = FlowDataCollector("test_session")
    
    # Simulate data collection
    for i in range(10):
        vision = {
            'gaze_h': 0.5 + np.random.randn() * 0.1,
            'gaze_v': 0.5 + np.random.randn() * 0.1,
            'blink_rate': 15 + np.random.randn() * 5,
            'away_sec': 0,
            'score': 75 + np.random.randn() * 10
        }
        
        wpm = {
            'wpm': 60 + np.random.randn() * 15,
            'typed_chars': 300,
            'typing_active': True
        }
        
        app = {
            'app_title': 'VS Code',
            'is_browser': False,
            'switch_count': 2,
            'time_in_app': 120
        }
        
        sample = collector.collect_sample(vision, wpm, app)
        print(f"Sample {i}: Label={sample['label']} | Arousal={sample['arousal_proxy']:.2f} | Valence={sample['valence_proxy']:.2f}")
        
        time.sleep(0.5)
    
    collector.finalize_session()