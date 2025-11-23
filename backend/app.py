from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import threading
import time
from datetime import datetime
import json

# Import monitoring modules
from module.face_monitor import FaceMonitor
from module.typing_monitor import TypingMonitor
from module.window_monitor import WindowMonitor

app = Flask(__name__)
CORS(app, resources={r"/": {"origins": ""}})
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

# Global monitoring instances
face_monitor = None
typing_monitor = None
window_monitor = None

# Monitoring state
monitoring_state = {
    'face_tracking': False,
    'typing_tracking': False,
    'window_tracking': False,
    'flow_state_detected': False,
    'flow_start_time': None,
    'total_flow_time': 0
}

# Analytics data storage
analytics_data = {
    'focus_sessions': [],
    'typing_stats': [],
    'window_switches': [],
    'flow_states': []
}

def calculate_flow_state():
    """Determine if user is in flow state based on all metrics"""
    focus_score = face_monitor.get_latest_score() if face_monitor else 0
    typing_wpm = typing_monitor.get_current_wpm() if typing_monitor else 0
    recent_switches = window_monitor.get_recent_switches(60) if window_monitor else 0
    
    # Flow state criteria
    is_focused = focus_score > 70
    is_typing_actively = typing_wpm > 30
    minimal_distractions = recent_switches < 5
    
    in_flow = is_focused and is_typing_actively and minimal_distractions
    
    return {
        'in_flow': in_flow,
        'focus_score': focus_score,
        'typing_wpm': typing_wpm,
        'app_switches': recent_switches,
        'confidence': (focus_score + min(typing_wpm, 100) + (100 - recent_switches * 10)) / 3
    }

def monitoring_loop():
    """Main loop that aggregates all monitoring data"""
    while True:
        if any([monitoring_state['face_tracking'], 
                monitoring_state['typing_tracking'], 
                monitoring_state['window_tracking']]):
            
            flow_data = calculate_flow_state()
            
            # Update flow state
            if flow_data['in_flow'] and not monitoring_state['flow_state_detected']:
                monitoring_state['flow_state_detected'] = True
                monitoring_state['flow_start_time'] = time.time()
            elif not flow_data['in_flow'] and monitoring_state['flow_state_detected']:
                if monitoring_state['flow_start_time']:
                    session_duration = time.time() - monitoring_state['flow_start_time']
                    monitoring_state['total_flow_time'] += session_duration
                    analytics_data['flow_states'].append({
                        'duration': session_duration,
                        'timestamp': datetime.now().isoformat()
                    })
                monitoring_state['flow_state_detected'] = False
                monitoring_state['flow_start_time'] = None
            
            # Emit real-time data to frontend
            socketio.emit('monitoring_update', {
                'flow_state': flow_data,
                'monitoring_state': monitoring_state,
                'timestamp': datetime.now().isoformat()
            })
        
        time.sleep(1)

# Start monitoring loop in background
monitoring_thread = threading.Thread(target=monitoring_loop, daemon=True)
monitoring_thread.start()

# ==================== API Routes ====================

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'timestamp': datetime.now().isoformat()})

@app.route('/api/monitoring/start/<module>', methods=['POST'])
def start_monitoring(module):
    global face_monitor, typing_monitor, window_monitor
    
    try:
        if module == 'face' and not monitoring_state['face_tracking']:
            face_monitor = FaceMonitor(socketio)
            face_monitor.start()
            monitoring_state['face_tracking'] = True
            
        elif module == 'typing' and not monitoring_state['typing_tracking']:
            typing_monitor = TypingMonitor(socketio)
            typing_monitor.start()
            monitoring_state['typing_tracking'] = True
            
        elif module == 'window' and not monitoring_state['window_tracking']:
            window_monitor = WindowMonitor(socketio)
            window_monitor.start()
            monitoring_state['window_tracking'] = True
            
        return jsonify({'success': True, 'message': f'{module} monitoring started'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/monitoring/stop/<module>', methods=['POST'])
def stop_monitoring(module):
    global face_monitor, typing_monitor, window_monitor
    
    try:
        if module == 'face' and face_monitor:
            face_monitor.stop()
            face_monitor = None
            monitoring_state['face_tracking'] = False
            
        elif module == 'typing' and typing_monitor:
            typing_monitor.stop()
            typing_monitor = None
            monitoring_state['typing_tracking'] = False
            
        elif module == 'window' and window_monitor:
            window_monitor.stop()
            window_monitor = None
            monitoring_state['window_tracking'] = False
            
        return jsonify({'success': True, 'message': f'{module} monitoring stopped'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/monitoring/status', methods=['GET'])
def get_monitoring_status():
    return jsonify(monitoring_state)

@app.route('/api/analytics/summary', methods=['GET'])
def get_analytics_summary():
    """Get summary of all analytics data"""
    total_sessions = len(analytics_data['flow_states'])
    total_flow_time = sum(s['duration'] for s in analytics_data['flow_states'])
    avg_session_duration = total_flow_time / total_sessions if total_sessions > 0 else 0
    
    return jsonify({
        'total_flow_sessions': total_sessions,
        'total_flow_time': total_flow_time,
        'average_session_duration': avg_session_duration,
        'current_flow_time': time.time() - monitoring_state['flow_start_time'] if monitoring_state['flow_start_time'] else 0,
        'typing_stats': typing_monitor.get_stats() if typing_monitor else {},
        'window_stats': window_monitor.get_stats() if window_monitor else {}
    })

@app.route('/api/analytics/history', methods=['GET'])
def get_analytics_history():
    """Get historical analytics data"""
    period = request.args.get('period', 'day')  # day, week, month
    return jsonify({
        'flow_states': analytics_data['flow_states'][-100:],
        'typing_stats': analytics_data['typing_stats'][-100:],
        'window_switches': analytics_data['window_switches'][-100:]
    })

@socketio.on('connect')
def handle_connect():
    print('Client connected')
    emit('connection_response', {'status': 'connected'})

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    print("🚀 AI Flow State Facilitator Backend Starting...")
    print("📊 Dashboard: http://localhost:2000")
    print("🔌 WebSocket: ws://localhost:2000")
    socketio.run(app, debug=True, host='0.0.0.0', port=2000, allow_unsafe_werkzeug=True)