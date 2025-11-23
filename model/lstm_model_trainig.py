"""
IMPROVED LSTM + Attention Model for Real-Time Focus State Detection
Fixes: Lambda layer shape issue + improved training
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

print("TensorFlow version:", tf.__version__)

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

print(f"Training samples: {len(X_train)}")
print(f"Test samples: {len(X_test)}")

# Build IMPROVED LSTM Model with proper Lambda layer
def build_improved_lstm_model(input_shape, num_classes=3):
    """
    Improved LSTM model with fixed Lambda layer and better architecture
    """
    inputs = keras.Input(shape=input_shape)
    
    # First LSTM layer
    lstm1 = layers.LSTM(128, return_sequences=True, dropout=0.3, 
                       recurrent_dropout=0.2)(inputs)
    lstm1 = layers.BatchNormalization()(lstm1)
    
    # Second LSTM layer
    lstm2 = layers.LSTM(64, return_sequences=True, dropout=0.3,
                       recurrent_dropout=0.2)(lstm1)
    lstm2 = layers.BatchNormalization()(lstm2)
    
    # Attention mechanism with FIXED Lambda layer
    attention = layers.Dense(1, activation='tanh')(lstm2)
    attention = layers.Flatten()(attention)
    attention = layers.Activation('softmax')(attention)
    attention = layers.RepeatVector(64)(attention)
    attention = layers.Permute([2, 1])(attention)
    
    # Apply attention
    attended = layers.Multiply()([lstm2, attention])
    
    # FIX: Use explicit output_shape in Lambda layer
    attended = layers.Lambda(
        lambda x: tf.reduce_sum(x, axis=1),
        output_shape=(64,),
        name='attention_sum'
    )(attended)
    
    # Dense layers
    dense1 = layers.Dense(128, activation='relu')(attended)
    dense1 = layers.Dropout(0.4)(dense1)
    dense1 = layers.BatchNormalization()(dense1)
    
    dense2 = layers.Dense(64, activation='relu')(dense1)
    dense2 = layers.Dropout(0.3)(dense2)
    
    # Output layer
    outputs = layers.Dense(num_classes, activation='softmax')(dense2)
    
    model = keras.Model(inputs=inputs, outputs=outputs, name='FocusDetectionLSTM')
    return model

# Create model
print("\nBuilding LSTM + Attention model...")
model = build_improved_lstm_model((time_steps, X_train.shape[2]))

# Use class weights to handle imbalance
from sklearn.utils.class_weight import compute_class_weight
class_weights_array = compute_class_weight('balanced', classes=np.unique(y_train), y=y_train)
class_weights = {i: weight for i, weight in enumerate(class_weights_array)}
print(f"Class weights: {class_weights}")

model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=0.001),
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

print(model.summary())

# Callbacks
early_stop = keras.callbacks.EarlyStopping(
    monitor='val_loss', 
    patience=15, 
    restore_best_weights=True,
    verbose=1
)

reduce_lr = keras.callbacks.ReduceLROnPlateau(
    monitor='val_loss', 
    factor=0.5, 
    patience=7, 
    min_lr=0.00001,
    verbose=1
)

checkpoint = keras.callbacks.ModelCheckpoint(
    'best_model.keras',
    monitor='val_accuracy',
    save_best_only=True,
    verbose=1
)

# Train model
print("\nTraining model...")
history = model.fit(
    X_train, y_train,
    validation_split=0.2,
    epochs=100,
    batch_size=32,
    class_weight=class_weights,
    callbacks=[early_stop, reduce_lr, checkpoint],
    verbose=1
)

# Evaluate model
print("\nEvaluating model...")
test_loss, test_acc = model.evaluate(X_test, y_test, verbose=0)
print(f"Test Accuracy: {test_acc*100:.2f}%")
print(f"Test Loss: {test_loss:.4f}")

# Predictions
y_pred = model.predict(X_test)
y_pred_classes = np.argmax(y_pred, axis=1)

# Classification report
print("\nClassification Report:")
print(classification_report(y_test, y_pred_classes, 
                          target_names=['Distracted', 'Focused', 'Deep Flow'],
                          zero_division=0))

# Confusion matrix
cm = confusion_matrix(y_test, y_pred_classes)
plt.figure(figsize=(10, 8))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=['Distracted', 'Focused', 'Deep Flow'],
            yticklabels=['Distracted', 'Focused', 'Deep Flow'])
plt.title('Confusion Matrix - Focus State Detection', fontsize=16, fontweight='bold')
plt.ylabel('True Label', fontsize=12)
plt.xlabel('Predicted Label', fontsize=12)
plt.tight_layout()
plt.savefig('confusion_matrix.png', dpi=300)
print("✓ Saved confusion matrix to confusion_matrix.png")

# Plot training history
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 6))

ax1.plot(history.history['loss'], label='Train Loss', linewidth=2)
ax1.plot(history.history['val_loss'], label='Val Loss', linewidth=2)
ax1.set_title('Model Loss', fontsize=14, fontweight='bold')
ax1.set_xlabel('Epoch', fontsize=12)
ax1.set_ylabel('Loss', fontsize=12)
ax1.legend(fontsize=10)
ax1.grid(True, alpha=0.3)

ax2.plot(history.history['accuracy'], label='Train Accuracy', linewidth=2)
ax2.plot(history.history['val_accuracy'], label='Val Accuracy', linewidth=2)
ax2.set_title('Model Accuracy', fontsize=14, fontweight='bold')
ax2.set_xlabel('Epoch', fontsize=12)
ax2.set_ylabel('Accuracy', fontsize=12)
ax2.legend(fontsize=10)
ax2.grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig('training_history.png', dpi=300)
print("✓ Saved training history to training_history.png")

# Save model in Keras format (recommended)
model.save('focus_detection_lstm_model.keras')
print("✓ Saved model to focus_detection_lstm_model.keras")

# Also save in H5 format for compatibility
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
    """
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

# Test prediction with different scenarios
print("\n" + "="*60)
print("Testing Real-Time Prediction:")
print("="*60)

# Test 1: Deep Flow scenario
print("\n[Test 1] Deep Flow Scenario:")
history_buffer = []
test_features = {
    'eye_fixation_duration_ms': 600,
    'eye_saccade_velocity': 80,
    'eye_blink_rate': 7,
    'mouse_movements_per_min': 3,
    'mouse_idle_time_sec': 35,
    'keyboard_strokes_per_min': 110,
    'keyboard_burst_pattern': 0.88,
    'tab_switches_per_min': 0,
    'scroll_speed_px_per_sec': 40,
    'time_on_task_min': 45
}

for i in range(12):
    result = predict_focus_state(model, scaler, test_features, history_buffer)
    if i >= 9:
        print(f"  Timestep {i+1}: {result['state']} | Score: {result['flow_score']}/100 | Conf: {result['confidence']}%")

# Test 2: Distracted scenario
print("\n[Test 2] Distracted Scenario:")
history_buffer = []
test_features = {
    'eye_fixation_duration_ms': 120,
    'eye_saccade_velocity': 450,
    'eye_blink_rate': 32,
    'mouse_movements_per_min': 75,
    'mouse_idle_time_sec': 1.5,
    'keyboard_strokes_per_min': 15,
    'keyboard_burst_pattern': 0.2,
    'tab_switches_per_min': 12,
    'scroll_speed_px_per_sec': 600,
    'time_on_task_min': 2
}

for i in range(12):
    result = predict_focus_state(model, scaler, test_features, history_buffer)
    if i >= 9:
        print(f"  Timestep {i+1}: {result['state']} | Score: {result['flow_score']}/100 | Conf: {result['confidence']}%")

print("\n" + "="*60)
print("✓ Model training complete!")
print(f"✓ Final Test Accuracy: {test_acc*100:.2f}%")
print(f"✓ Model saved in both .keras and .h5 formats")
print("="*60)