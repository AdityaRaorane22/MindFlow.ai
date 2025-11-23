from pynput import keyboard
import time
import threading
try:
    import win32gui
except ImportError:
    win32gui = None
    print("⚠  win32gui not available - window detection disabled")

class TypingMonitor:
    def _init_(self, socketio):
        self.socketio = socketio
        self.running = False
        self.listener = None
        self.emit_thread = None
        
        # Tracking variables
        self.typed_chars = 0
        self.start_time = None
        self.current_wpm = 0
        
        # Target applications
        self.TARGET_APPS = ["Word", "Excel", "Google Docs", "Notepad", "Visual Studio Code", 
                            "Chrome", "Edge", "Brave", "Firefox", "Code", "Sublime", "Atom"]
        
        # Stats
        self.stats = {
            'total_chars': 0,
            'total_words': 0,
            'peak_wpm': 0,
            'average_wpm': 0,
            'active_time': 0
        }
    
    def get_active_window(self):
        """Get the title of the active window"""
        if win32gui is None:
            return "Unknown"
        try:
            return win32gui.GetWindowText(win32gui.GetForegroundWindow())
        except:
            return ""
    
    def is_target_app_open(self):
        """Check if a target app is currently active"""
        if win32gui is None:
            return True  # Always track if we can't detect window
        window = self.get_active_window()
        return any(app.lower() in window.lower() for app in self.TARGET_APPS)
    
    def on_press(self, key):
        """Handle key press events"""
        if not self.running:
            return False
        
        if not self.is_target_app_open():
            return
        
        # Count only character keys
        if hasattr(key, "char") and key.char is not None:
            self.typed_chars += 1
            self.stats['total_chars'] += 1
        
        if self.start_time is None:
            self.start_time = time.time()
    
    def calculate_wpm(self):
        """Calculate current words per minute"""
        if not self.start_time:
            return 0
        
        elapsed_minutes = (time.time() - self.start_time) / 60
        if elapsed_minutes == 0:
            return 0
        
        # Standard: 5 characters = 1 word
        words = self.typed_chars / 5
        wpm = words / elapsed_minutes
        
        self.current_wpm = round(wpm, 2)
        
        # Update stats
        if self.current_wpm > self.stats['peak_wpm']:
            self.stats['peak_wpm'] = self.current_wpm
        
        self.stats['total_words'] = round(self.typed_chars / 5, 2)
        self.stats['active_time'] = round(elapsed_minutes * 60, 1)
        
        # Calculate average
        if self.stats['active_time'] > 0:
            self.stats['average_wpm'] = round(
                (self.stats['total_words'] / self.stats['active_time']) * 60, 2
            )
        
        return self.current_wpm
    
    def emit_loop(self):
        """Emit typing data periodically"""
        while self.running:
            wpm = self.calculate_wpm()
            
            self.socketio.emit('typing_data', {
                'wpm': wpm,
                'typed_chars': self.typed_chars,
                'active': self.is_target_app_open(),
                'stats': self.stats
            })
            
            time.sleep(1)
    
    def start(self):
        """Start the typing monitor"""
        if not self.running:
            self.running = True
            
            # Start keyboard listener
            self.listener = keyboard.Listener(on_press=self.on_press)
            self.listener.start()
            
            # Start emit thread
            self.emit_thread = threading.Thread(target=self.emit_loop, daemon=True)
            self.emit_thread.start()
            
            print("✅ Typing monitoring started")
    
    def stop(self):
        """Stop the typing monitor"""
        self.running = False
        
        if self.listener:
            self.listener.stop()
        
        if self.emit_thread:
            self.emit_thread.join(timeout=2)
        
        print("🛑 Typing monitoring stopped")
    
    def get_current_wpm(self):
        """Get the current WPM"""
        return self.current_wpm
    
    def get_stats(self):
        """Get typing statistics"""
        return self.stats