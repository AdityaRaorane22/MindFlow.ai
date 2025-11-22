# flow_integrator.py - The Centralized Backend Server

from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from gevent import pywsgi
from geventwebsocket.handler import WebSocketHandler
import time
import threading

# Import the tracking modules
# NOTE: You must rename your three files to these names for the imports to work.
import app_tracker
import wpm_tracker
import vision_tracker 

# =================================================================
# FLASK/SOCKETIO SETUP
# =================================================================
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_project_secret_key' 
# Using gevent for concurrent I/O (required for SocketIO/Websockets)
socketio = SocketIO(app, async_mode='gevent', cors_allowed_origins="*") 

# =================================================================
# DATA BROADCAST THREAD
# =================================================================
def data_broadcast_thread():
    """Periodically gathers data from all modules and broadcasts it."""
    print("Data Broadcast Thread started.")
    while True:
        # --- 1. Gather Data from Modules ---
        # Access the global variables exposed by each module
        
        # Calculate Focus Score (Temporary, this logic should be in a module eventually)
        current_focus_score = vision_tracker.focus_score
        current_wpm = wpm_tracker.wpm_value
        current_app = app_tracker.active_app_title
        current_focused_status = vision_tracker.focused
        current_blink_rate = vision_tracker.blink_rate_bpm
        current_away_sec = vision_tracker.away_seconds
        
        # --- 2. Broadcast Data ---
        socketio.emit('data_update', {
            'score': current_focus_score,
            'wpm': current_wpm,
            'app': current_app,
            'focused': current_focused_status,
            'blink_rate': current_blink_rate,
            'away_sec': current_away_sec
        })
        
        # Broadcast interval (e.g., 10 times per second)
        time.sleep(0.1) 

# =================================================================
# FLASK ROUTES AND STARTUP
# =================================================================

@app.route('/')
def index():
    return "<h1>AI Flow Facilitator Backend Running!</h1><p>Data broadcasting...</p>"

@socketio.on('connect')
def handle_connect():
    print('Client connected:', threading.get_ident())


if __name__ == '__main__':
    print("--- AI Flow Facilitator Server Initializing ---")
    
    # 1. Start the Logic Modules (WPM listener is internal to wpm_tracker)
    # The vision_tracker and app_tracker will run their blocking loops here
    
    # 2. Start the Data Broadcaster
    socketio.start_background_task(data_broadcast_thread)

    # Note: The tracking scripts MUST be started in the background 
    # as their main loops are blocking (cv2.VideoCapture, time.sleep).
    
    # Start the module threads BEFORE the server starts
    socketio.start_background_task(app_tracker.start_tracking)
    socketio.start_background_task(vision_tracker.start_tracking) 
    # WPM thread is managed internally by the wpm_tracker script

    print("Open web browser at: http://127.0.0.1:5000")
    server = pywsgi.WSGIServer(('', 5000), app, handler_class=WebSocketHandler)
    server.serve_forever()