"""
LSTM + Attention Model for Real-Time Focus State Detection
Based on research: 83.5% F1 score for cognitive state detection
"""

import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import classification_report, confusion_matrix
import json

# Load data
print("Loading data...")
df = pd.read_csv('focus_detection_data.csv')

# Features and labels
feature_cols = [
    'eye_fixation_duration_ms', 'eye_saccade_velocity', 'eye_blink_rate',
    'mouse_movements_per_min', 'mouse_idle_time_sec', 
    'keyboard_strokes_per_min', 'keyboard_burst_pattern',
    'tab_switches_per_min', 'scroll_speed_px_per_sec', 'time_on_task_min'
]

X = df[feature_cols].values
y = df['focus_state'].values

# Normalize features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Create sequences for LSTM (time window = 10 timesteps)
def create_sequences(X, y, time_steps=10):
    Xs, ys = [], []
    for i in range(len(X) - time_steps):
        Xs.append(X[i:(i + time_steps)])
        ys.append(y[i + time_steps])
    return np.array(Xs), np.array(ys)

time_steps = 10
X_seq, y_seq = create_sequences(X_scaled, y, time_steps)

print(f"Sequence shape: {X_seq.shape}")
print(f"Labels shape: {y_seq.shape}")

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X_seq, y_seq, test_size=0.2, random_state=42, stratify=y_seq
)

# Build LSTM + Attention Model
def attention_layer(inputs):
    """Attention mechanism for LSTM"""
    attention = layers.Dense(1, activation='tanh')(inputs)
    attention = layers.Flatten()(attention)
    attention = layers.Activation('softmax')(attention)
    attention = layers.RepeatVector(inputs.shape[-1])(attention)
    attention = layers.Permute([2, 1])(attention)
    
    output = layers.Multiply()([inputs, attention])
    output = layers.Lambda(lambda x: tf.reduce_sum(x, axis=1))(output)
    return output

def build_lstm_attention_model(input_shape, num_classes=3):
    """
    LSTM + Attention model for focus state detection
    Architecture based on research achieving 83.5% accuracy
    """
    inputs = keras.Input(shape=input_shape)
    
    # LSTM layers with dropout
    lstm1 = layers.LSTM(128, return_sequences=True, dropout=0.3)(inputs)
    lstm2 = layers.LSTM(64, return_sequences=True, dropout=0.3)(lstm1)
    
    # Attention mechanism
    attention_output = attention_layer(lstm2)
    
    # Dense layers
    dense1 = layers.Dense(64, activation='relu')(attention_output)
    dense1 = layers.Dropout(0.3)(dense1)
    dense2 = layers.Dense(32, activation='relu')(dense1)
    
    # Output layer
    outputs = layers.Dense(num_classes, activation='softmax')(dense2)
    
    model = keras.Model(inputs=inputs, outputs=outputs)
    return model

# Create model
print("\nBuilding LSTM + Attention model...")
model = build_lstm_attention_model((time_steps, X_train.shape[2]))

model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=0.001),
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

print(model.summary())

# Callbacks
early_stop = keras.callbacks.EarlyStopping(
    monitor='val_loss', patience=10, restore_best_weights=True
)

reduce_lr = keras.callbacks.ReduceLROnPlateau(
    monitor='val_loss', factor=0.5, patience=5, min_lr=0.00001
)

# Train model
print("\nTraining model...")
history = model.fit(
    X_train, y_train,
    validation_split=0.2,
    epochs=50,
    batch_size=32,
    callbacks=[early_stop, reduce_lr],
    verbose=1
)

# Evaluate model
print("\nEvaluating model...")
test_loss, test_acc = model.evaluate(X_test, y_test, verbose=0)
print(f"Test Accuracy: {test_acc*100:.2f}%")

# Predictions
y_pred = model.predict(X_test)
y_pred_classes = np.argmax(y_pred, axis=1)

# Classification report
print("\nClassification Report:")
print(classification_report(y_test, y_pred_classes, 
                          target_names=['Distracted', 'Focused', 'Deep Flow']))

# Confusion matrix
cm = confusion_matrix(y_test, y_pred_classes)
plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=['Distracted', 'Focused', 'Deep Flow'],
            yticklabels=['Distracted', 'Focused', 'Deep Flow'])
plt.title('Confusion Matrix - Focus State Detection')
plt.ylabel('True Label')
plt.xlabel('Predicted Label')
plt.tight_layout()
plt.savefig('confusion_matrix.png')
print("✓ Saved confusion matrix to confusion_matrix.png")

# Plot training history
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

ax1.plot(history.history['loss'], label='Train Loss')
ax1.plot(history.history['val_loss'], label='Val Loss')
ax1.set_title('Model Loss')
ax1.set_xlabel('Epoch')
ax1.set_ylabel('Loss')
ax1.legend()
ax1.grid(True)

ax2.plot(history.history['accuracy'], label='Train Accuracy')
ax2.plot(history.history['val_accuracy'], label='Val Accuracy')
ax2.set_title('Model Accuracy')
ax2.set_xlabel('Epoch')
ax2.set_ylabel('Accuracy')
ax2.legend()
ax2.grid(True)

plt.tight_layout()
plt.savefig('training_history.png')
print("✓ Saved training history to training_history.png")

# Save model
model.save('focus_detection_lstm_model.h5')
print("✓ Saved model to focus_detection_lstm_model.h5")

# Save scaler parameters
scaler_params = {
    'mean': scaler.mean_.tolist(),
    'scale': scaler.scale_.tolist(),
    'feature_names': feature_cols
}

with open('scaler_params.json', 'w') as f:
    json.dump(scaler_params, f, indent=2)
print("✓ Saved scaler parameters to scaler_params.json")

# Test real-time prediction function
def predict_focus_state(model, scaler, features, history_buffer):
    """
    Real-time focus state prediction
    
    Args:
        model: Trained LSTM model
        scaler: Fitted StandardScaler
        features: Current feature values (dict)
        history_buffer: List of past 10 feature vectors
    
    Returns:
        prediction: {state: str, confidence: float, flow_score: int}
    """
    # Convert features to array
    feature_vector = np.array([
        features['eye_fixation_duration_ms'],
        features['eye_saccade_velocity'],
        features['eye_blink_rate'],
        features['mouse_movements_per_min'],
        features['mouse_idle_time_sec'],
        features['keyboard_strokes_per_min'],
        features['keyboard_burst_pattern'],
        features['tab_switches_per_min'],
        features['scroll_speed_px_per_sec'],
        features['time_on_task_min']
    ])
    
    # Normalize
    feature_scaled = scaler.transform([feature_vector])[0]
    
    # Add to history buffer
    history_buffer.append(feature_scaled)
    if len(history_buffer) > 10:
        history_buffer.pop(0)
    
    # Need 10 timesteps for prediction
    if len(history_buffer) < 10:
        return {'state': 'warming_up', 'confidence': 0, 'flow_score': 50}
    
    # Prepare sequence
    sequence = np.array([history_buffer])
    
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

# Test prediction
print("\n" + "="*60)
print("Testing Real-Time Prediction:")
print("="*60)

history_buffer = []
test_features = {
    'eye_fixation_duration_ms': 450,
    'eye_saccade_velocity': 120,
    'eye_blink_rate': 8,
    'mouse_movements_per_min': 5,
    'mouse_idle_time_sec': 25,
    'keyboard_strokes_per_min': 95,
    'keyboard_burst_pattern': 0.85,
    'tab_switches_per_min': 1,
    'scroll_speed_px_per_sec': 50,
    'time_on_task_min': 35
}

# Simulate 10 timesteps
for i in range(12):
    result = predict_focus_state(model, scaler, test_features, history_buffer)
    if i >= 9:  # After warmup
        print(f"\nTimestep {i+1}:")
        print(f"  State: {result['state']}")
        print(f"  Confidence: {result['confidence']}%")
        print(f"  Flow Score: {result['flow_score']}/100")
        print(f"  Probabilities: {result['probabilities']}")

print("\n✓ Model training complete!")
print(f"✓ Final Test Accuracy: {test_acc*100:.2f}%")