from pynput import keyboard
import time
import win32gui   # to get active window title

# Track WPM
typed_chars = 0
start_time = None

# Only track for apps in this list
TARGET_APPS = ["Word", "Excel", "Google Docs"]

def get_active_window():
    try:
        return win32gui.GetWindowText(win32gui.GetForegroundWindow())
    except:
        return ""

def is_target_app_open():
    window = get_active_window()
    return any(app in window for app in TARGET_APPS)

def on_press(key):
    global typed_chars, start_time

    if not is_target_app_open():
        return  # ignore typing outside Word/Excel/Docs

    # Count only correct characters
    if hasattr(key, "char") and key.char is not None:
        typed_chars += 1

    if start_time is None:
        start_time = time.time()

def calculate_wpm():
    global typed_chars, start_time

    if not start_time:
        return 0

    minutes = (time.time() - start_time) / 60
    if minutes == 0:
        return 0
    
    wpm = (typed_chars / 5) / minutes  # 5 chars per word
    return round(wpm, 2)

def show_wpm():
    while True:
        wpm = calculate_wpm()
        print(f"Current WPM (Word/Excel/Docs only): {wpm}")
        time.sleep(5)

listener = keyboard.Listener(on_press=on_press)
listener.start()

print("Tracking typing speed ONLY in Word / Excel / Google Docs...")
print("Minimize this window and start typing.")

try:
    show_wpm()
except KeyboardInterrupt:
    print("Stopped.")