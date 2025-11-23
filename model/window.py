import time
import win32gui

last_active = ""

def get_active_window_title():
    """Returns the title of the currently active window."""
    try:
        hwnd = win32gui.GetForegroundWindow()
        title = win32gui.GetWindowText(hwnd)
        return title.strip()
    except:
        return ""

def is_browser(title):
    """Detect if active window is a browser."""
    browsers = ["Chrome", "Edge", "Brave"]
    return any(b in title for b in browsers)

print(">>> Tracking App + Browser Tab Switching...\n")

while True:
    current_title = get_active_window_title()

    if current_title and current_title != last_active:
        
        # Browser Tab Switching
        if is_browser(current_title):
            print(f"[BROWSER TAB SWITCHED]  {current_title}")

        # Application Switching
        else:
            print(f"[APP SWITCHED]  {current_title}")

        last_active = current_title

    time.sleep(0.2)