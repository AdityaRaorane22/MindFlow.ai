import time
import threading
from collections import deque
from datetime import datetime

try:
    import win32gui
except ImportError:
    win32gui = None
    print("⚠  win32gui not available - window monitoring disabled")

class WindowMonitor:
    def _init_(self, socketio):
        self.socketio = socketio
        self.running = False
        self.thread = None
        
        self.last_active = ""
        self.switch_timestamps = deque()
        self.switch_history = []
        
        # Stats
        self.stats = {
            'total_switches': 0,
            'app_switches': 0,
            'browser_tab_switches': 0,
            'most_used_apps': {},
            'distraction_score': 0
        }
    
    def get_active_window_title(self):
        """Get the title of the currently active window"""
        if win32gui is None:
            return ""
        try:
            hwnd = win32gui.GetForegroundWindow()
            title = win32gui.GetWindowText(hwnd)
            return title.strip()
        except:
            return ""
    
    def is_browser(self, title):
        """Detect if the active window is a browser"""
        browsers = ["Chrome", "Edge", "Brave", "Firefox", "Safari"]
        return any(b in title for b in browsers)
    
    def extract_app_name(self, title):
        """Extract application name from window title"""
        if not title:
            return "Unknown"
        
        # Common patterns
        if " - " in title:
            return title.split(" - ")[-1]
        elif " — " in title:
            return title.split(" — ")[-1]
        else:
            # Take last word (usually app name)
            parts = title.split()
            return parts[-1] if parts else "Unknown"
    
    def monitor_loop(self):
        """Main monitoring loop"""
        print("✅ Window monitoring started")
        
        while self.running:
            current_title = self.get_active_window_title()
            
            if current_title and current_title != self.last_active:
                current_time = time.time()
                
                # Determine switch type
                is_browser_switch = self.is_browser(current_title)
                switch_type = "browser_tab" if is_browser_switch else "app"
                
                # Update stats
                self.stats['total_switches'] += 1
                if is_browser_switch:
                    self.stats['browser_tab_switches'] += 1
                else:
                    self.stats['app_switches'] += 1
                
                # Track app usage
                app_name = self.extract_app_name(current_title)
                if app_name in self.stats['most_used_apps']:
                    self.stats['most_used_apps'][app_name] += 1
                else:
                    self.stats['most_used_apps'][app_name] = 1
                
                # Record switch
                self.switch_timestamps.append(current_time)
                self.switch_history.append({
                    'title': current_title,
                    'type': switch_type,
                    'timestamp': datetime.now().isoformat(),
                    'app_name': app_name
                })
                
                # Keep only last 1000 switches in history
                if len(self.switch_history) > 1000:
                    self.switch_history.pop(0)
                
                # Calculate distraction score (switches per minute in last 5 min)
                recent_switches = self.get_recent_switches(300)  # 5 minutes
                self.stats['distraction_score'] = round((recent_switches / 5) * 10, 1)
                
                # Emit to frontend
                self.socketio.emit('window_data', {
                    'current_window': current_title,
                    'app_name': app_name,
                    'switch_type': switch_type,
                    'recent_switches_1min': self.get_recent_switches(60),
                    'recent_switches_5min': recent_switches,
                    'stats': self.stats
                })
                
                self.last_active = current_title
            
            time.sleep(0.2)
        
        print("🛑 Window monitoring stopped")
    
    def start(self):
        """Start window monitoring"""
        if not self.running:
            self.running = True
            self.thread = threading.Thread(target=self.monitor_loop, daemon=True)
            self.thread.start()
    
    def stop(self):
        """Stop window monitoring"""
        self.running = False
        if self.thread:
            self.thread.join(timeout=2)
    
    def get_recent_switches(self, seconds):
        """Get number of switches in the last N seconds"""
        cutoff = time.time() - seconds
        
        # Remove old timestamps
        while self.switch_timestamps and self.switch_timestamps[0] < cutoff:
            self.switch_timestamps.popleft()
        
        return len(self.switch_timestamps)
    
    def get_stats(self):
        """Get window switching statistics"""
        return self.stats
    
    def get_switch_history(self, limit=50):
        """Get recent switch history"""
        return self.switch_history[-limit:]