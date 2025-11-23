"""
Backend API for Focus Detection with LSTM Model and Gemini AI Integration
Run with: python backend_api.py
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import json
import tensorflow as tf
from tensorflow import keras
from sklearn.preprocessing import StandardScaler
from google import genai
import os
from collections import deque

app = Flask(__name__)
CORS(app)

# Load model and scaler
print("Loading LSTM model...")
# Try loading .keras format first (recommended), fall back to .h5
try:
    model = keras.models.load_model('focus_detection_lstm_model.keras')
    print("✓ Loaded model from .keras format")
except:
    try:
        # Define custom objects for Lambda layer
        custom_objects = {
            'Lambda': layers.Lambda,
            'attention_sum': layers.Lambda(
                lambda x: tf.reduce_sum(x, axis=1),
                output_shape=(64,)
            )
        }
        model = keras.models.load_model('focus_detection_lstm_model.h5', 
                                       custom_objects=custom_objects,
                                       compile=False)
        model.compile(
            optimizer='adam',
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy']
        )
        print("✓ Loaded model from .h5 format")
    except Exception as e:
        print(f"Error loading model: {e}")
        raise

print("Loading scaler parameters...")
with open('scaler_params.json', 'r') as f:
    scaler_params = json.load(f)

scaler = StandardScaler()
scaler.mean_ = np.array(scaler_params['mean'])
scaler.scale_ = np.array(scaler_params['scale'])

# Initialize Gemini client
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'your-api-key-here')
client = genai.Client(api_key=GEMINI_API_KEY)

# Store session history (in production, use Redis or database)
session_histories = {}

class FocusSessionManager:
    def __init__(self, session_id):
        self.session_id = session_id
        self.history_buffer = deque(maxlen=10)
        self.session_data = {
            'total_time': 0,
            'flow_scores': [],
            'states': [],
            'distractions': 0,
            'focus_minutes': 0,
            'deep_flow_minutes': 0
        }
    
    def add_data_point(self, features, prediction):
        self.session_data['flow_scores'].append(prediction['flow_score'])
        self.session_data['states'].append(prediction['state'])
        
        if prediction['state'] == 'distracted':
            self.session_data['distractions'] += 1
        elif prediction['state'] == 'focused':
            self.session_data['focus_minutes'] += 1
        elif prediction['state'] == 'deep_flow':
            self.session_data['deep_flow_minutes'] += 1
        
        self.session_data['total_time'] += 1

def predict_focus_state(features, history_buffer):
    """Predict focus state from features"""
    feature_vector = np.array([
        features.get('eye_fixation_duration_ms', 300),
        features.get('eye_saccade_velocity', 200),
        features.get('eye_blink_rate', 15),
        features.get('mouse_movements_per_min', 25),
        features.get('mouse_idle_time_sec', 10),
        features.get('keyboard_strokes_per_min', 50),
        features.get('keyboard_burst_pattern', 0.6),
        features.get('tab_switches_per_min', 3),
        features.get('scroll_speed_px_per_sec', 200),
        features.get('time_on_task_min', 10)
    ])
    
    # Normalize
    feature_scaled = scaler.transform([feature_vector])[0]
    
    # Add to history
    history_buffer.append(feature_scaled)
    
    # Need 10 timesteps
    if len(history_buffer) < 10:
        return {
            'state': 'warming_up',
            'confidence': 0,
            'flow_score': 50,
            'probabilities': {'distracted': 33, 'focused': 34, 'deep_flow': 33}
        }
    
    # Prepare sequence
    sequence = np.array([list(history_buffer)])
    
    # Predict
    prediction = model.predict(sequence, verbose=0)[0]
    predicted_class = np.argmax(prediction)
    confidence = float(prediction[predicted_class])
    
    state_names = {0: 'distracted', 1: 'focused', 2: 'deep_flow'}
    state = state_names[predicted_class]
    
    # Calculate flow score (0-100)
    flow_score = int((prediction[1] * 50) + (prediction[2] * 100))
    
    return {
        'state': state,
        'confidence': round(confidence * 100, 2),
        'flow_score': flow_score,
        'probabilities': {
            'distracted': round(float(prediction[0]) * 100, 2),
            'focused': round(float(prediction[1]) * 100, 2),
            'deep_flow': round(float(prediction[2]) * 100, 2)
        }
    }

def generate_ai_tips(session_data, current_state):
    """Generate personalized tips using Gemini AI"""
    
    avg_flow = np.mean(session_data['flow_scores']) if session_data['flow_scores'] else 50
    
    prompt = f"""You are an AI focus coach. Based on the user's focus session data, provide 3 concise, actionable tips to improve their concentration.

Session Data:
- Current State: {current_state['state']}
- Average Flow Score: {avg_flow:.1f}/100
- Total Distractions: {session_data['distractions']}
- Focus Minutes: {session_data['focus_minutes']}
- Deep Flow Minutes: {session_data['deep_flow_minutes']}
- Current Probabilities: {current_state['probabilities']}

Provide exactly 3 tips in this JSON format:
{{"tips": [
  {{"text": "tip 1", "icon": "🎯", "priority": "high"}},
  {{"text": "tip 2", "icon": "⚡", "priority": "medium"}},
  {{"text": "tip 3", "icon": "💡", "priority": "low"}}
]}}

Keep tips under 15 words each. Use relevant emojis. Focus on immediate actions."""

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash-exp",
            contents=prompt
        )
        
        # Parse JSON from response
        response_text = response.text.strip()
        if response_text.startswith('```json'):
            response_text = response_text[7:-3].strip()
        elif response_text.startswith('```'):
            response_text = response_text[3:-3].strip()
        
        tips_data = json.loads(response_text)
        return tips_data.get('tips', [])
    
    except Exception as e:
        print(f"Gemini API error: {e}")
        # Fallback tips
        return [
            {"text": "Take a 5-minute break to reset focus", "icon": "☕", "priority": "high"},
            {"text": "Close unnecessary tabs to reduce distractions", "icon": "🎯", "priority": "medium"},
            {"text": "Try 25-minute focus blocks with breaks", "icon": "⏱️", "priority": "low"}
        ]

@app.route('/api/predict', methods=['POST'])
def predict():
    """Real-time focus state prediction endpoint"""
    data = request.json
    session_id = data.get('session_id', 'default')
    features = data.get('features', {})
    
    # Get or create session
    if session_id not in session_histories:
        session_histories[session_id] = FocusSessionManager(session_id)
    
    session = session_histories[session_id]
    
    # Predict
    prediction = predict_focus_state(features, session.history_buffer)
    
    # Update session data
    session.add_data_point(features, prediction)
    
    return jsonify({
        'success': True,
        'prediction': prediction,
        'session_stats': {
            'total_time': session.session_data['total_time'],
            'avg_flow_score': round(np.mean(session.session_data['flow_scores']), 1) if session.session_data['flow_scores'] else 50,
            'distractions': session.session_data['distractions']
        }
    })

@app.route('/api/tips', methods=['POST'])
def get_tips():
    """Get AI-powered personalized tips"""
    data = request.json
    session_id = data.get('session_id', 'default')
    
    if session_id not in session_histories:
        return jsonify({'success': False, 'error': 'Session not found'})
    
    session = session_histories[session_id]
    
    # Get current prediction
    if len(session.history_buffer) >= 10:
        sequence = np.array([list(session.history_buffer)])
        prediction = model.predict(sequence, verbose=0)[0]
        predicted_class = np.argmax(prediction)
        state_names = {0: 'distracted', 1: 'focused', 2: 'deep_flow'}
        
        current_state = {
            'state': state_names[predicted_class],
            'flow_score': int((prediction[1] * 50) + (prediction[2] * 100)),
            'probabilities': {
                'distracted': round(float(prediction[0]) * 100, 2),
                'focused': round(float(prediction[1]) * 100, 2),
                'deep_flow': round(float(prediction[2]) * 100, 2)
            }
        }
    else:
        current_state = {'state': 'warming_up', 'flow_score': 50, 'probabilities': {}}
    
    # Generate tips
    tips = generate_ai_tips(session.session_data, current_state)
    
    return jsonify({
        'success': True,
        'tips': tips,
        'current_state': current_state
    })

@app.route('/api/session/summary', methods=['POST'])
def session_summary():
    """Get session summary with Gemini analysis"""
    data = request.json
    session_id = data.get('session_id', 'default')
    
    if session_id not in session_histories:
        return jsonify({'success': False, 'error': 'Session not found'})
    
    session = session_histories[session_id]
    stats = session.session_data
    
    avg_flow = np.mean(stats['flow_scores']) if stats['flow_scores'] else 50
    
    prompt = f"""Analyze this focus session and provide a brief, encouraging summary (max 50 words):

Total Time: {stats['total_time']} seconds
Average Flow Score: {avg_flow:.1f}/100
Distractions: {stats['distractions']}
Focus Minutes: {stats['focus_minutes']}
Deep Flow Minutes: {stats['deep_flow_minutes']}

Highlight strengths and give one improvement suggestion."""

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash-exp",
            contents=prompt
        )
        summary = response.text.strip()
    except Exception as e:
        summary = f"Good session! Average flow: {avg_flow:.1f}. Keep building your focus muscle!"
    
    return jsonify({
        'success': True,
        'summary': summary,
        'stats': {
            'total_time': stats['total_time'],
            'avg_flow_score': round(avg_flow, 1),
            'distractions': stats['distractions'],
            'focus_minutes': stats['focus_minutes'],
            'deep_flow_minutes': stats['deep_flow_minutes'],
            'peak_flow': max(stats['flow_scores']) if stats['flow_scores'] else 0
        }
    })

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'active_sessions': len(session_histories)
    })

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 Focus Detection API Server")
    print("="*60)
    print("✓ LSTM Model loaded")
    print("✓ Gemini AI connected")
    print("\nEndpoints:")
    print("  POST /api/predict - Real-time focus prediction")
    print("  POST /api/tips - Get AI-powered tips")
    print("  POST /api/session/summary - Get session summary")
    print("  GET  /api/health - Health check")
    print("\nRunning on http://localhost:5000")
    print("="*60 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)