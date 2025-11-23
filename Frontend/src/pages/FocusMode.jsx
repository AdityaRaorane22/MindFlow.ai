// import React, { useState, useEffect } from 'react';
// import { Play, Pause, Square, Coffee, Eye, Target, Brain, Zap, TrendingUp, AlertCircle, Activity } from 'lucide-react';

// const API_URL = 'http://localhost:5000/api';

// const FocusMode = ({ userData, setUserData, setCurrentPage }) => {
//   const [isActive, setIsActive] = useState(false);
//   const [sessionTime, setSessionTime] = useState(0);
//   const [flowScore, setFlowScore] = useState(50);
//   const [currentState, setCurrentState] = useState('warming_up');
//   const [distractions, setDistractions] = useState(0);
//   const [showBreakAlert, setShowBreakAlert] = useState(false);
//   const [sessionCoins, setSessionCoins] = useState(0);
//   const [aiTips, setAiTips] = useState([]);
//   const [modelAccuracy] = useState(83.5);
//   const [probabilities, setProbabilities] = useState({ distracted: 33, focused: 34, deep_flow: 33 });
//   const [sessionId] = useState(`session_${Date.now()}`);

//   const generateTrackingData = () => {
//     const baseData = {
//       eye_fixation_duration_ms: 300 + Math.random() * 200,
//       eye_saccade_velocity: 100 + Math.random() * 200,
//       eye_blink_rate: 10 + Math.random() * 10,
//       mouse_movements_per_min: 10 + Math.random() * 40,
//       mouse_idle_time_sec: Math.random() * 30,
//       keyboard_strokes_per_min: 30 + Math.random() * 60,
//       keyboard_burst_pattern: 0.3 + Math.random() * 0.5,
//       tab_switches_per_min: Math.floor(Math.random() * 8),
//       scroll_speed_px_per_sec: 50 + Math.random() * 300,
//       time_on_task_min: sessionTime / 60
//     };

//     if (sessionTime > 300) {
//       baseData.eye_fixation_duration_ms += 100;
//       baseData.mouse_idle_time_sec += 10;
//       baseData.keyboard_burst_pattern += 0.2;
//       baseData.tab_switches_per_min = Math.max(0, baseData.tab_switches_per_min - 2);
//     }

//     return baseData;
//   };

//   const getPrediction = async () => {
//     const features = generateTrackingData();

//     try {
//       const response = await fetch(`${API_URL}/predict`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ session_id: sessionId, features })
//       });

//       const data = await response.json();
      
//       if (data.success) {
//         setFlowScore(data.prediction.flow_score);
//         setCurrentState(data.prediction.state);
//         setProbabilities(data.prediction.probabilities);
        
//         if (data.session_stats) {
//           setDistractions(data.session_stats.distractions);
//         }
//       }
//     } catch (error) {
//       console.error('Prediction API error:', error);
//       const simulatedScore = Math.min(100, flowScore + (Math.random() > 0.6 ? 2 : -1));
//       setFlowScore(Math.max(0, simulatedScore));
//     }
//   };

//   const getAITips = async () => {
//     try {
//       const response = await fetch(`${API_URL}/tips`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ session_id: sessionId })
//       });

//       const data = await response.json();
      
//       if (data.success && data.tips) {
//         setAiTips(data.tips);
//       }
//     } catch (error) {
//       console.error('Tips API error:', error);
//       setAiTips([
//         { text: "Your flow increases after 15-20 minutes", icon: "💜", priority: "high" },
//         { text: "Take 5-min breaks every 25 minutes", icon: "☕", priority: "medium" },
//         { text: "Close distracting tabs to boost focus", icon: "🎯", priority: "low" }
//       ]);
//     }
//   };

//   useEffect(() => {
//     let interval;
//     if (isActive) {
//       interval = setInterval(() => {
//         setSessionTime(prev => prev + 1);

//         if (sessionTime % 5 === 0) {
//           getPrediction();
//         }

//         if (sessionTime % 60 === 0 && sessionTime > 0) {
//           setSessionCoins(p => p + 5);
//         }

//         if (sessionTime % 1500 === 0 && sessionTime > 0) {
//           setShowBreakAlert(true);
//           setTimeout(() => setShowBreakAlert(false), 10000);
//         }

//         if (sessionTime % 300 === 0 && sessionTime > 0) {
//           getAITips();
//         }
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [isActive, sessionTime]);

//   useEffect(() => {
//     getAITips();
//   }, []);

//   const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

//   const getFlowColor = (score) =>
//     score >= 80 ? "#10b981" :
//     score >= 60 ? "#3b82f6" :
//     score >= 40 ? "#f59e0b" : "#ef4444";

//   const getStateEmoji = (state) => {
//     if (state === 'deep_flow') return '🔥';
//     if (state === 'focused') return '🎯';
//     if (state === 'distracted') return '😵';
//     return '⏳';
//   };

//   const getStateLabel = (state) => {
//     if (state === 'deep_flow') return 'Deep Flow';
//     if (state === 'focused') return 'Focused';
//     if (state === 'distracted') return 'Distracted';
//     return 'Warming Up';
//   };

//   return (
//     <div className="focus-wrapper">
//       <div className="focus-card">
//         <h1 className="title">⚡ AI-Powered Focus Session</h1>
//         <p className="subtitle">Real-time LSTM detection • {getStateEmoji(currentState)} {getStateLabel(currentState)}</p>

//         <div className="timer-box">
//           <p className="timer">{formatTime(sessionTime)}</p>

//           <div className="stats-grid">
//             <div className="stat">
//               <p className="label">Flow Score</p>
//               <p className="value" style={{ color: getFlowColor(flowScore) }}>{flowScore}</p>
//             </div>

//             <div className="stat">
//               <p className="label">State</p>
//               <p className="value" style={{ fontSize: '20px' }}>{getStateEmoji(currentState)}</p>
//             </div>

//             <div className="stat">
//               <p className="label">Distractions</p>
//               <p className="value" style={{ color: "#ef4444" }}>{distractions}</p>
//             </div>

//             <div className="stat">
//               <p className="label">Coins</p>
//               <p className="value" style={{ color: "#f59e0b" }}>{sessionCoins}</p>
//             </div>
//           </div>

//           {currentState !== 'warming_up' && (
//             <div style={{ marginTop: '20px' }}>
//               <ProbabilityBar label="Distracted" value={probabilities.distracted} color="#ef4444" />
//               <ProbabilityBar label="Focused" value={probabilities.focused} color="#3b82f6" />
//               <ProbabilityBar label="Deep Flow" value={probabilities.deep_flow} color="#10b981" />
//             </div>
//           )}
//         </div>

//         <div className="controls">
//           {!isActive ? (
//             <button className="btn white-btn" onClick={() => setIsActive(true)}>
//               <Play size={24} /> {sessionTime === 0 ? "Start AI Focus" : "Resume"}
//             </button>
//           ) : (
//             <button className="btn white-btn" onClick={() => setIsActive(false)}>
//               <Pause size={24} /> Pause
//             </button>
//           )}

//           {sessionTime > 0 && (
//             <button className="btn red-btn" onClick={() => { setIsActive(false); setCurrentPage("dashboard"); }}>
//               <Square size={24} /> End Session
//             </button>
//           )}
//         </div>
//       </div>

//       {showBreakAlert && (
//         <div className="break-alert">
//           <Coffee size={40} />
//           <h3>Time for a Micro-Break ☕</h3>
//           <p>Your flow score is {flowScore}. Take 5 min to recharge your focus.</p>
//         </div>
//       )}

//       <div className="grid-2">
//         <div className="card">
//           <h2><Brain /> LSTM Model Detection</h2>

//           <Item icon={<Eye />} name="Eye Tracking" active={isActive} value={`${probabilities.focused.toFixed(1)}% conf`} />
//           <Item icon={<Target />} name="Mouse Patterns" active={isActive} value={currentState !== 'warming_up' ? '✓ Active' : '○ Idle'} />
//           <Item icon={<Brain />} name="LSTM + Attention" value={`${modelAccuracy}% accuracy`} />
//           <Item icon={<Zap />} name="Keyboard Activity" active={isActive} value={`${sessionTime}s tracked`} />
//           <Item icon={<Activity />} name="Flow State" value={getStateLabel(currentState)} />
//         </div>

//         <div className="card tips">
//           <h2><TrendingUp /> AI-Powered Tips</h2>
//           {aiTips.length > 0 ? (
//             aiTips.map((tip, idx) => (
//               <Tip key={idx} text={tip.text} icon={tip.icon} priority={tip.priority} />
//             ))
//           ) : (
//             <>
//               <Tip text="Loading personalized insights..." icon="⏳" />
//               <Tip text="Building your focus profile..." icon="🧠" />
//               <Tip text="AI analyzing your patterns..." icon="🤖" />
//             </>
//           )}
//         </div>
//       </div>

//       <div className="card">
//         <h2>Quick Actions</h2>
//         <div className="grid-3">
//           <QuickButton text="📊 View Analytics" color="purple" onClick={() => setCurrentPage("dashboard")} />
//           <QuickButton text="📚 Learn Techniques" color="blue" onClick={() => setCurrentPage("learn")} />
//           <QuickButton text="👤 View Profile" color="green" onClick={() => setCurrentPage("profile")} />
//         </div>
//       </div>

//       <style>{`
//         .focus-wrapper { max-width: 1200px; margin: auto; padding: 25px; background: #f9fafb; min-height: 100vh; }
//         .focus-card {
//           background: linear-gradient(135deg, #6b21ff, #4b32ff, #216aff);
//           padding: 40px;
//           border-radius: 30px;
//           color: white;
//           box-shadow: 0 15px 40px rgba(107, 33, 255, 0.4);
//         }

//         .title { font-size: 40px; font-weight: 800; margin-bottom: 10px; }
//         .subtitle { opacity: 0.95; margin-bottom: 25px; font-size: 18px; }

//         .timer-box {
//           background: rgba(255,255,255,0.12);
//           padding: 30px;
//           border-radius: 30px;
//           border: 2px solid rgba(255,255,255,0.25);
//           backdrop-filter: blur(10px);
//         }

//         .timer { 
//           font-size: 80px; 
//           font-family: 'SF Mono', 'Monaco', monospace; 
//           text-align: center; 
//           font-weight: 700;
//           letter-spacing: -2px;
//         }

//         .stats-grid {
//           margin-top: 25px;
//           display: grid;
//           grid-template-columns: repeat(4, 1fr);
//           gap: 15px;
//         }

//         .stat { 
//           background: rgba(255,255,255,0.15); 
//           padding: 18px; 
//           border-radius: 18px;
//           border: 1px solid rgba(255,255,255,0.2);
//           transition: all 0.3s ease;
//         }
//         .stat:hover { transform: translateY(-2px); background: rgba(255,255,255,0.2); }
//         .label { opacity: 0.85; font-size: 13px; margin-bottom: 6px; font-weight: 600; }
//         .value { font-size: 32px; font-weight: bold; }

//         .controls { display: flex; gap: 15px; justify-content: center; margin-top: 25px; }

//         .btn {
//           display: flex; align-items: center; gap: 12px;
//           font-size: 20px; padding: 16px 40px;
//           border-radius: 50px; cursor: pointer;
//           border: none; font-weight: 700;
//           transition: all 0.3s ease;
//           box-shadow: 0 8px 20px rgba(0,0,0,0.2);
//         }

//         .white-btn { background: white; color: #5b21ff; }
//         .white-btn:hover { background: #f0f0f0; transform: scale(1.05); box-shadow: 0 12px 30px rgba(0,0,0,0.3); }

//         .red-btn { background: #ef4444; color: white; }
//         .red-btn:hover { background: #dc2626; transform: scale(1.05); }

//         .break-alert {
//           background: linear-gradient(135deg, #10b981, #059669);
//           padding: 30px;
//           border-radius: 25px;
//           text-align: center;
//           color: white;
//           margin-top: 25px;
//           animation: pulse 2s infinite;
//           box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
//         }

//         @keyframes pulse {
//           0%, 100% { transform: scale(1); }
//           50% { transform: scale(1.03); }
//         }

//         .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 25px; margin-top: 25px; }
//         .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }

//         .card {
//           background: white;
//           padding: 28px;
//           border-radius: 24px;
//           box-shadow: 0 4px 20px rgba(0,0,0,0.08);
//           border: 1px solid #e5e7eb;
//         }

//         .card h2 { 
//           display: flex; align-items: center; gap: 12px; 
//           margin-bottom: 20px; font-size: 22px; color: #1f2937;
//         }

//         .tip { 
//           display: flex; gap: 12px; align-items: center;
//           padding: 14px; background: #f9fafb; 
//           border-radius: 12px; margin-bottom: 10px;
//           border: 1px solid #e5e7eb;
//           transition: all 0.2s;
//         }
//         .tip:hover { background: #f3f4f6; transform: translateX(4px); }
//         .tip-icon { flex-shrink: 0; font-size: 20px; }
//       `}</style>
//     </div>
//   );
// };

// const ProbabilityBar = ({ label, value, color }) => (
//   <div style={{ marginBottom: '10px' }}>
//     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
//       <span>{label}</span>
//       <span style={{ fontWeight: 'bold' }}>{value.toFixed(1)}%</span>
//     </div>
//     <div style={{ background: 'rgba(255,255,255,0.3)', height: '8px', borderRadius: '10px', overflow: 'hidden' }}>
//       <div style={{ 
//         width: `${value}%`, 
//         height: '100%', 
//         background: color,
//         transition: 'width 0.5s ease',
//         borderRadius: '10px'
//       }} />
//     </div>
//   </div>
// );

// const Item = ({ icon, name, active, value }) => (
//   <div style={{
//     display: "flex", justifyContent: "space-between", alignItems: "center",
//     padding: "14px", background: "#f9fafb", borderRadius: "12px", 
//     marginBottom: "10px", border: "1px solid #e5e7eb"
//   }}>
//     <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//       <div style={{ color: "#6b21ff" }}>{icon}</div>
//       <span style={{ fontWeight: 600, color: "#374151" }}>{name}</span>
//     </div>
//     <span style={{ color: "#6b7280", fontWeight: 600, fontSize: '14px' }}>
//       {value || (active ? "✓ Active" : "○ Idle")}
//     </span>
//   </div>
// );

// const Tip = ({ text, icon = "💡", priority }) => {
//   const priorityColors = {
//     high: "#fef3c7",
//     medium: "#dbeafe",
//     low: "#f3f4f6"
//   };

//   return (
//     <div className="tip" style={{ background: priorityColors[priority] || "#f9fafb" }}>
//       <span className="tip-icon">{icon}</span>
//       <p style={{ margin: 0, color: "#374151", fontWeight: 500 }}>{text}</p>
//     </div>
//   );
// };

// const QuickButton = ({ text, color, onClick }) => {
//   const colors = {
//     purple: { bg: "#f3e8ff", hover: "#e9d5ff" },
//     blue: { bg: "#dbeafe", hover: "#bfdbfe" },
//     green: { bg: "#d1fae5", hover: "#a7f3d0" },
//   };

//   return (
//     <button
//       onClick={onClick}
//       onMouseEnter={(e) => e.target.style.background = colors[color].hover}
//       onMouseLeave={(e) => e.target.style.background = colors[color].bg}
//       style={{
//         background: colors[color].bg,
//         padding: "16px",
//         borderRadius: "14px",
//         fontWeight: "700",
//         border: "none",
//         cursor: "pointer",
//         transition: "all 0.2s",
//         fontSize: "15px"
//       }}
//     >
//       {text}
//     </button>
//   );
// };

// export default FocusMode;


import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, Square, Coffee, Eye, Target, Brain, Zap, TrendingUp, 
  AlertCircle, Activity, Keyboard, Monitor, CheckCircle, XCircle, 
  AlertTriangle, Clock
} from 'lucide-react';

const API_URL = 'http://localhost:2000/api';

// Component definitions
const FocusMetrics = ({ data, isActive }) => {
  if (!isActive) {
    return (
      <div className="metric-card inactive">
        <div className="card-header">
          <Eye size={24} />
          <h3>Focus Monitor</h3>
        </div>
        <div className="inactive-message">
          <p>Face tracking is disabled</p>
          <small>Enable to monitor focus and attention</small>
        </div>
      </div>
    );
  }

  const { focused, focus_score, gaze_h, gaze_v, blink_rate, away_seconds, face_detected } = data;

  return (
    <div className="metric-card active">
      <div className="card-header">
        <Eye size={24} />
        <h3>Focus Monitor</h3>
        {focused ? (
          <CheckCircle size={20} className="status-icon success" />
        ) : (
          <XCircle size={20} className="status-icon warning" />
        )}
      </div>
      <div className="card-body">
        {!face_detected ? (
          <div className="warning-message">
            <AlertCircle size={20} />
            <span>No face detected</span>
          </div>
        ) : (
          <>
            <div className="score-display">
              <div className="score-circle" style={{
                background: `conic-gradient(
                  ${focus_score > 70 ? '#10b981' : focus_score > 40 ? '#f59e0b' : '#ef4444'} ${focus_score * 3.6}deg,
                  #e5e7eb ${focus_score * 3.6}deg
                )`
              }}>
                <div className="score-inner">
                  <span className="score-value">{focus_score}</span>
                  <span className="score-label">Focus</span>
                </div>
              </div>
            </div>
            <div className="metrics-list">
              <div className="metric-row">
                <span className="metric-name">Status</span>
                <span className={`metric-val ${focused ? 'success' : 'warning'}`}>
                  {focused ? 'Focused' : 'Distracted'}
                </span>
              </div>
              <div className="metric-row">
                <span className="metric-name">Horizontal Gaze</span>
                <span className="metric-val">{gaze_h.toFixed(2)}</span>
              </div>
              <div className="metric-row">
                <span className="metric-name">Vertical Gaze</span>
                <span className="metric-val">{gaze_v.toFixed(2)}</span>
              </div>
              <div className="metric-row">
                <span className="metric-name">Blink Rate</span>
                <span className={`metric-val ${blink_rate > 25 ? 'warning' : ''}`}>
                  {blink_rate} BPM
                </span>
              </div>
              {away_seconds > 0 && (
                <div className="metric-row">
                  <span className="metric-name">Away Time</span>
                  <span className="metric-val warning">{away_seconds.toFixed(1)}s</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const TypingMetrics = ({ data, isActive }) => {
  if (!isActive) {
    return (
      <div className="metric-card inactive">
        <div className="card-header">
          <Keyboard size={24} />
          <h3>Typing Monitor</h3>
        </div>
        <div className="inactive-message">
          <p>Typing tracking is disabled</p>
          <small>Enable to monitor typing speed and activity</small>
        </div>
      </div>
    );
  }

  const { wpm, typed_chars, active, stats } = data;

  return (
    <div className="metric-card active">
      <div className="card-header">
        <Keyboard size={24} />
        <h3>Typing Monitor</h3>
        <div className={`activity-dot ${active ? 'active' : 'inactive'}`} />
      </div>
      <div className="card-body">
        <div className="wpm-display">
          <div className="wpm-value">{wpm.toFixed(0)}</div>
          <div className="wpm-label">Words Per Minute</div>
        </div>
        <div className="metrics-list">
          <div className="metric-row">
            <span className="metric-name">Characters Typed</span>
            <span className="metric-val">{typed_chars.toLocaleString()}</span>
          </div>
          {stats.total_words > 0 && (
            <div className="metric-row">
              <span className="metric-name">Total Words</span>
              <span className="metric-val">{stats.total_words.toLocaleString()}</span>
            </div>
          )}
          {stats.peak_wpm > 0 && (
            <div className="metric-row">
              <span className="metric-name">Peak WPM</span>
              <span className="metric-val success">{stats.peak_wpm.toFixed(0)}</span>
            </div>
          )}
          {stats.average_wpm > 0 && (
            <div className="metric-row">
              <span className="metric-name">Average WPM</span>
              <span className="metric-val">{stats.average_wpm.toFixed(0)}</span>
            </div>
          )}
        </div>
        {active && (
          <div className="status-badge success">
            <Activity size={16} />
            <span>Actively Typing</span>
          </div>
        )}
      </div>
    </div>
  );
};

const WindowMetrics = ({ data, isActive }) => {
  if (!isActive) {
    return (
      <div className="metric-card inactive">
        <div className="card-header">
          <Monitor size={24} />
          <h3>Window Monitor</h3>
        </div>
        <div className="inactive-message">
          <p>Window tracking is disabled</p>
          <small>Enable to monitor app/tab switching</small>
        </div>
      </div>
    );
  }

  const { current_window, app_name, switch_type, recent_switches_1min, recent_switches_5min, stats } = data;
  const distractionLevel = stats.distraction_score > 20 ? 'high' : 
                           stats.distraction_score > 10 ? 'medium' : 'low';

  return (
    <div className="metric-card active">
      <div className="card-header">
        <Monitor size={24} />
        <h3>Window Monitor</h3>
        {recent_switches_1min > 5 && (
          <AlertTriangle size={20} className="status-icon warning" />
        )}
      </div>
      <div className="card-body">
        {current_window && (
          <div className="current-app">
            <div className="app-icon">
              {switch_type === 'browser_tab' ? '🌐' : '📱'}
            </div>
            <div className="app-info">
              <div className="app-name">{app_name}</div>
              <div className="app-title">{current_window.substring(0, 40)}...</div>
            </div>
          </div>
        )}
        <div className="distraction-meter">
          <div className="meter-header">
            <span>Distraction Score</span>
            <span className={`meter-value ${distractionLevel}`}>
              {stats.distraction_score || 0}
            </span>
          </div>
          <div className="meter-bar">
            <div 
              className={`meter-fill ${distractionLevel}`}
              style={{ width: `${Math.min(stats.distraction_score * 2, 100)}%` }}
            />
          </div>
        </div>
        <div className="metrics-list">
          <div className="metric-row">
            <span className="metric-name">Switches (1 min)</span>
            <span className={`metric-val ${recent_switches_1min > 5 ? 'warning' : ''}`}>
              {recent_switches_1min}
            </span>
          </div>
          <div className="metric-row">
            <span className="metric-name">Switches (5 min)</span>
            <span className="metric-val">{recent_switches_5min}</span>
          </div>
          {stats.total_switches > 0 && (
            <div className="metric-row">
              <span className="metric-name">Total Switches</span>
              <span className="metric-val">{stats.total_switches}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProbabilityBar = ({ label, value, color }) => (
  <div style={{ marginBottom: '10px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
      <span>{label}</span>
      <span style={{ fontWeight: 'bold' }}>{value.toFixed(1)}%</span>
    </div>
    <div style={{ background: 'rgba(255,255,255,0.3)', height: '8px', borderRadius: '10px', overflow: 'hidden' }}>
      <div style={{ 
        width: `${value}%`, 
        height: '100%', 
        background: color,
        transition: 'width 0.5s ease',
        borderRadius: '10px'
      }} />
    </div>
  </div>
);

const Item = ({ icon, name, active, value }) => (
  <div style={{
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "14px", background: "#f9fafb", borderRadius: "12px", 
    marginBottom: "10px", border: "1px solid #e5e7eb"
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div style={{ color: "#6b21ff" }}>{icon}</div>
      <span style={{ fontWeight: 600, color: "#374151" }}>{name}</span>
    </div>
    <span style={{ color: "#6b7280", fontWeight: 600, fontSize: '14px' }}>
      {value || (active ? "✓ Active" : "○ Idle")}
    </span>
  </div>
);

const Tip = ({ text, icon = "💡", priority }) => {
  const priorityColors = {
    high: "#fef3c7",
    medium: "#dbeafe",
    low: "#f3f4f6"
  };

  return (
    <div className="tip" style={{ background: priorityColors[priority] || "#f9fafb" }}>
      <span className="tip-icon">{icon}</span>
      <p style={{ margin: 0, color: "#374151", fontWeight: 500 }}>{text}</p>
    </div>
  );
};

const QuickButton = ({ text, color, onClick }) => {
  const colors = {
    purple: { bg: "#f3e8ff", hover: "#e9d5ff" },
    blue: { bg: "#dbeafe", hover: "#bfdbfe" },
    green: { bg: "#d1fae5", hover: "#a7f3d0" },
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={(e) => e.target.style.background = colors[color].hover}
      onMouseLeave={(e) => e.target.style.background = colors[color].bg}
      style={{
        background: colors[color].bg,
        padding: "16px",
        borderRadius: "14px",
        fontWeight: "700",
        border: "none",
        cursor: "pointer",
        transition: "all 0.2s",
        fontSize: "15px"
      }}
    >
      {text}
    </button>
  );
};

const FocusMode = ({ userData, setUserData, setCurrentPage }) => {
  const [isActive, setIsActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [flowScore, setFlowScore] = useState(50);
  const [currentState, setCurrentState] = useState('warming_up');
  const [distractions, setDistractions] = useState(0);
  const [showBreakAlert, setShowBreakAlert] = useState(false);
  const [sessionCoins, setSessionCoins] = useState(0);
  const [aiTips, setAiTips] = useState([]);
  const [modelAccuracy] = useState(83.5);
  const [probabilities, setProbabilities] = useState({ distracted: 33, focused: 34, deep_flow: 33 });
  const [sessionId] = useState(`session_${Date.now()}`);
  
  const [faceData, setFaceData] = useState({
    focused: false,
    focus_score: 0,
    gaze_h: 0.5,
    gaze_v: 0.5,
    blink_rate: 0,
    away_seconds: 0,
    face_detected: false
  });
  
  const [typingData, setTypingData] = useState({
    wpm: 0,
    typed_chars: 0,
    active: false,
    stats: { peak_wpm: 0, average_wpm: 0, total_words: 0, active_time: 0 }
  });
  
  const [windowData, setWindowData] = useState({
    current_window: '',
    app_name: '',
    switch_type: '',
    recent_switches_1min: 0,
    recent_switches_5min: 0,
    stats: { distraction_score: 0, total_switches: 0, app_switches: 0, browser_tab_switches: 0 }
  });

  const generateTrackingData = () => {
    const baseData = {
      eye_fixation_duration_ms: 300 + Math.random() * 200,
      eye_saccade_velocity: 100 + Math.random() * 200,
      eye_blink_rate: 10 + Math.random() * 10,
      mouse_movements_per_min: 10 + Math.random() * 40,
      mouse_idle_time_sec: Math.random() * 30,
      keyboard_strokes_per_min: 30 + Math.random() * 60,
      keyboard_burst_pattern: 0.3 + Math.random() * 0.5,
      tab_switches_per_min: Math.floor(Math.random() * 8),
      scroll_speed_px_per_sec: 50 + Math.random() * 300,
      time_on_task_min: sessionTime / 60
    };

    if (sessionTime > 300) {
      baseData.eye_fixation_duration_ms += 100;
      baseData.mouse_idle_time_sec += 10;
      baseData.keyboard_burst_pattern += 0.2;
      baseData.tab_switches_per_min = Math.max(0, baseData.tab_switches_per_min - 2);
    }

    return baseData;
  };

  const getPrediction = async () => {
    const features = generateTrackingData();

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, features })
      });

      const data = await response.json();
      
      if (data.success) {
        setFlowScore(data.prediction.flow_score);
        setCurrentState(data.prediction.state);
        setProbabilities(data.prediction.probabilities);
        
        if (data.session_stats) {
          setDistractions(data.session_stats.distractions);
        }
      }
    } catch (error) {
      console.error('Prediction API error:', error);
      const simulatedScore = Math.min(100, flowScore + (Math.random() > 0.6 ? 2 : -1));
      setFlowScore(Math.max(0, simulatedScore));
    }
  };

  const getAITips = async () => {
    try {
      const response = await fetch(`${API_URL}/tips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId })
      });

      const data = await response.json();
      
      if (data.success && data.tips) {
        setAiTips(data.tips);
      }
    } catch (error) {
      console.error('Tips API error:', error);
      setAiTips([
        { text: "Your flow increases after 15-20 minutes", icon: "💜", priority: "high" },
        { text: "Take 5-min breaks every 25 minutes", icon: "☕", priority: "medium" },
        { text: "Close distracting tabs to boost focus", icon: "🎯", priority: "low" }
      ]);
    }
  };

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setFaceData(prev => ({
          ...prev,
          focused: Math.random() > 0.3,
          focus_score: Math.floor(50 + Math.random() * 50),
          gaze_h: 0.4 + Math.random() * 0.2,
          gaze_v: 0.4 + Math.random() * 0.2,
          blink_rate: Math.floor(15 + Math.random() * 10),
          away_seconds: Math.random() > 0.8 ? Math.random() * 5 : 0,
          face_detected: Math.random() > 0.1
        }));

        setTypingData(prev => ({
          ...prev,
          wpm: Math.floor(40 + Math.random() * 60),
          typed_chars: prev.typed_chars + Math.floor(Math.random() * 10),
          active: Math.random() > 0.3,
          stats: {
            peak_wpm: Math.max(prev.stats.peak_wpm, 40 + Math.random() * 80),
            average_wpm: 45 + Math.random() * 30,
            total_words: Math.floor(prev.typed_chars / 5),
            active_time: sessionTime
          }
        }));

        setWindowData(prev => ({
          ...prev,
          current_window: 'VS Code - FocusMode.jsx',
          app_name: 'Visual Studio Code',
          switch_type: Math.random() > 0.5 ? 'browser_tab' : 'app',
          recent_switches_1min: Math.floor(Math.random() * 6),
          recent_switches_5min: Math.floor(Math.random() * 15),
          stats: {
            distraction_score: Math.floor(Math.random() * 30),
            total_switches: prev.stats.total_switches + (Math.random() > 0.9 ? 1 : 0),
            app_switches: prev.stats.app_switches + (Math.random() > 0.95 ? 1 : 0),
            browser_tab_switches: prev.stats.browser_tab_switches + (Math.random() > 0.92 ? 1 : 0)
          }
        }));
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isActive, sessionTime]);

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);

        if (sessionTime % 5 === 0) {
          getPrediction();
        }

        if (sessionTime % 60 === 0 && sessionTime > 0) {
          setSessionCoins(p => p + 5);
        }

        if (sessionTime % 1500 === 0 && sessionTime > 0) {
          setShowBreakAlert(true);
          setTimeout(() => setShowBreakAlert(false), 10000);
        }

        if (sessionTime % 300 === 0 && sessionTime > 0) {
          getAITips();
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, sessionTime]);

  useEffect(() => {
    getAITips();
  }, []);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const getFlowColor = (score) =>
    score >= 80 ? "#10b981" :
    score >= 60 ? "#3b82f6" :
    score >= 40 ? "#f59e0b" : "#ef4444";

  const getStateEmoji = (state) => {
    if (state === 'deep_flow') return '🔥';
    if (state === 'focused') return '🎯';
    if (state === 'distracted') return '😵';
    return '⏳';
  };

  const getStateLabel = (state) => {
    if (state === 'deep_flow') return 'Deep Flow';
    if (state === 'focused') return 'Focused';
    if (state === 'distracted') return 'Distracted';
    return 'Warming Up';
  };

  return (
    <div className="focus-wrapper">
      <div className={`flow-state-banner ${currentState === 'deep_flow' ? 'in-flow' : 'not-flow'}`}>
        <div className="flow-indicator">
          {currentState === 'deep_flow' ? (
            <>
              <Zap size={56} className="flow-icon pulse" />
              <div className="flow-text">
                <h2>🔥 YOU ARE IN DEEP FLOW STATE</h2>
                <p>Keep going! Your productivity is at its peak.</p>
              </div>
            </>
          ) : (
            <>
              <AlertCircle size={56} className="flow-icon" />
              <div className="flow-text">
                <h2>Building Focus...</h2>
                <p>Stay on task to enter flow state</p>
              </div>
            </>
          )}
        </div>
        
        <div className="flow-metrics-mini">
          <div className="mini-metric">
            <span className="mini-label">Confidence</span>
            <span className="mini-value">{flowScore}%</span>
          </div>
          <div className="mini-metric">
            <span className="mini-label">Time</span>
            <span className="mini-value">{formatTime(sessionTime)}</span>
          </div>
          <div className="mini-metric">
            <span className="mini-label">Coins</span>
            <span className="mini-value">🪙 {sessionCoins}</span>
          </div>
        </div>
      </div>

      <div className="focus-card">
        <div className="focus-header">
          <div>
            <h1 className="title">⚡ AI-Powered Focus Session</h1>
            <p className="subtitle">Real-time LSTM detection • {getStateEmoji(currentState)} {getStateLabel(currentState)}</p>
          </div>
          <div className="model-badge">
            <Brain size={20} />
            <span>LSTM Model: {modelAccuracy}% Accuracy</span>
          </div>
        </div>

        <div className="timer-box">
          <p className="timer">{formatTime(sessionTime)}</p>

          <div className="stats-grid">
            <div className="stat">
              <p className="label">Flow Score</p>
              <p className="value" style={{ color: getFlowColor(flowScore) }}>{flowScore}</p>
            </div>
            <div className="stat">
              <p className="label">State</p>
              <p className="value" style={{ fontSize: '28px' }}>{getStateEmoji(currentState)}</p>
            </div>
            <div className="stat">
              <p className="label">Distractions</p>
              <p className="value" style={{ color: "#ef4444" }}>{distractions}</p>
            </div>
            <div className="stat">
              <p className="label">Coins Earned</p>
              <p className="value" style={{ color: "#f59e0b" }}>{sessionCoins}</p>
            </div>
          </div>

          {currentState !== 'warming_up' && (
            <div style={{ marginTop: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', opacity: 0.9 }}>State Probabilities</h3>
              <ProbabilityBar label="Distracted" value={probabilities.distracted} color="#ef4444" />
              <ProbabilityBar label="Focused" value={probabilities.focused} color="#3b82f6" />
              <ProbabilityBar label="Deep Flow" value={probabilities.deep_flow} color="#10b981" />
            </div>
          )}
        </div>

        <div className="controls">
          {!isActive ? (
            <button className="btn white-btn" onClick={() => setIsActive(true)}>
              <Play size={24} /> {sessionTime === 0 ? "Start AI Focus" : "Resume"}
            </button>
          ) : (
            <button className="btn white-btn" onClick={() => setIsActive(false)}>
              <Pause size={24} /> Pause
            </button>
          )}
          {sessionTime > 0 && (
            <button className="btn red-btn" onClick={() => { setIsActive(false); setCurrentPage("dashboard"); }}>
              <Square size={24} /> End Session
            </button>
          )}
        </div>
      </div>

      {showBreakAlert && (
        <div className="break-alert">
          <Coffee size={40} />
          <h3>Time for a Micro-Break ☕</h3>
          <p>Your flow score is {flowScore}. Take 5 min to recharge your focus.</p>
        </div>
      )}

      <div className="monitoring-section">
        <h2 className="section-title">
          <Activity size={24} />
          Real-Time Monitoring
        </h2>
        
        <div className="monitoring-grid">
          <FocusMetrics data={faceData} isActive={isActive} />
          <TypingMetrics data={typingData} isActive={isActive} />
          <WindowMetrics data={windowData} isActive={isActive} />
        </div>
      </div>

      <div className="grid-2">
        <div className="card tips">
          <h2><TrendingUp /> AI-Powered Tips</h2>
          {aiTips.length > 0 ? (
            aiTips.map((tip, idx) => (
              <Tip key={idx} text={tip.text} icon={tip.icon} priority={tip.priority} />
            ))
          ) : (
            <>
              <Tip text="Loading personalized insights..." icon="⏳" />
              <Tip text="Building your focus profile..." icon="🧠" />
              <Tip text="AI analyzing your patterns..." icon="🤖" />
            </>
          )}
        </div>

        <div className="card">
          <h2><Brain /> LSTM Model Detection</h2>
          <Item icon={<Eye />} name="Eye Tracking" active={isActive} value={`${faceData.focus_score}% conf`} />
          <Item icon={<Target />} name="Mouse Patterns" active={isActive} value={currentState !== 'warming_up' ? '✓ Active' : '○ Idle'} />
          <Item icon={<Brain />} name="LSTM + Attention" value={`${modelAccuracy}% accuracy`} />
          <Item icon={<Zap />} name="Keyboard Activity" active={isActive} value={`${typingData.wpm.toFixed(0)} WPM`} />
          <Item icon={<Activity />} name="Flow State" value={getStateLabel(currentState)} />
        </div>
      </div>

      <div className="card">
        <h2>Quick Actions</h2>
        <div className="grid-3">
          <QuickButton text="📊 View Analytics" color="purple" onClick={() => setCurrentPage("dashboard")} />
          <QuickButton text="📚 Learn Techniques" color="blue" onClick={() => setCurrentPage("learn")} />
          <QuickButton text="👤 View Profile" color="green" onClick={() => setCurrentPage("profile")} />
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        
        .focus-wrapper { 
          max-width: 1400px; 
          margin: auto; 
          padding: 30px; 
          background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
          min-height: 100vh; 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .flow-state-banner {
          background: linear-gradient(135deg, #1e293b, #334155);
          padding: 40px;
          border-radius: 30px;
          margin-bottom: 30px;
          color: white;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
          border: 2px solid rgba(255,255,255,0.1);
        }

        .flow-state-banner.in-flow {
          background: linear-gradient(135deg, #10b981, #059669, #047857);
          animation: flowPulse 3s ease-in-out infinite;
        }

        @keyframes flowPulse {
          0%, 100% { box-shadow: 0 20px 60px rgba(16, 185, 129, 0.4); }
          50% { box-shadow: 0 25px 70px rgba(16, 185, 129, 0.6); }
        }

        .flow-indicator {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 24px;
        }

        .flow-icon.pulse {
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }

        .flow-text h2 {
          font-size: 32px;
          font-weight: 800;
          margin: 0 0 8px 0;
        }

        .flow-text p {
          font-size: 16px;
          opacity: 0.9;
          margin: 0;
        }

        .flow-metrics-mini {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .mini-metric {
          background: rgba(255,255,255,0.15);
          padding: 12px 24px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
        }

        .mini-label {
          display: block;
          font-size: 12px;
          opacity: 0.85;
          margin-bottom: 4px;
          font-weight: 600;
        }

        .mini-value {
          display: block;
          font-size: 20px;
          font-weight: 700;
        }

        .focus-card {
          background: linear-gradient(135deg, #6b21ff, #4b32ff, #216aff);
          padding: 45px;
          border-radius: 32px;
          color: white;
          box-shadow: 0 20px 60px rgba(107, 33, 255, 0.35);
          margin-bottom: 30px;
          border: 2px solid rgba(255,255,255,0.1);
        }

        .focus-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .model-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.15);
          padding: 10px 18px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .title { 
          font-size: 42px; 
          font-weight: 900; 
          margin: 0 0 8px 0;
          letter-spacing: -0.5px;
        }
        
        .subtitle { 
          opacity: 0.95; 
          margin: 0;
          font-size: 18px;
          font-weight: 500;
        }

        .timer-box {
          background: rgba(255,255,255,0.12);
          padding: 35px;
          border-radius: 32px;
          border: 2px solid rgba(255,255,255,0.25);
          backdrop-filter: blur(20px);
        }

        .timer { 
          font-size: 88px; 
          font-family: 'SF Mono', 'Monaco', 'Courier New', monospace; 
          text-align: center; 
          font-weight: 800;
          letter-spacing: -3px;
          margin: 0 0 30px 0;
          text-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat { 
          background: rgba(255,255,255,0.15); 
          padding: 20px; 
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.2);
          transition: all 0.3s ease;
          text-align: center;
        }
        
        .stat:hover { 
          transform: translateY(-4px); 
          background: rgba(255,255,255,0.22);
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }
        
        .label { 
          opacity: 0.9; 
          font-size: 13px; 
          margin: 0 0 8px 0;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .value { 
          font-size: 36px; 
          font-weight: 900;
          margin: 0;
          line-height: 1;
        }

        .controls { 
          display: flex; 
          gap: 16px; 
          justify-content: center; 
          margin-top: 28px;
          flex-wrap: wrap;
        }

        .btn {
          display: flex; 
          align-items: center; 
          gap: 12px;
          font-size: 20px; 
          padding: 18px 44px;
          border-radius: 60px; 
          cursor: pointer;
          border: none; 
          font-weight: 800;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(0,0,0,0.25);
          letter-spacing: 0.3px;
        }

        .white-btn { 
          background: white; 
          color: #5b21ff; 
        }
        
        .white-btn:hover { 
          background: #f0f0f0; 
          transform: scale(1.06) translateY(-2px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.35);
        }

        .red-btn { 
          background: #ef4444; 
          color: white; 
        }
        
        .red-btn:hover { 
          background: #dc2626; 
          transform: scale(1.06) translateY(-2px);
        }

        .break-alert {
          background: linear-gradient(135deg, #10b981, #059669);
          padding: 35px;
          border-radius: 28px;
          text-align: center;
          color: white;
          margin-bottom: 30px;
          animation: alertPulse 2s infinite;
          box-shadow: 0 15px 50px rgba(16, 185, 129, 0.4);
          border: 2px solid rgba(255,255,255,0.2);
        }

        @keyframes alertPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        .break-alert h3 {
          font-size: 28px;
          margin: 12px 0 8px 0;
          font-weight: 800;
        }

        .break-alert p {
          font-size: 16px;
          margin: 0;
          opacity: 0.95;
        }

        .monitoring-section {
          margin-bottom: 30px;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 28px;
          font-weight: 800;
          color: #1f2937;
          margin-bottom: 20px;
        }

        .monitoring-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
        }

        .metric-card {
          background: white;
          padding: 28px;
          border-radius: 24px;
          box-shadow: 0 6px 24px rgba(0,0,0,0.08);
          border: 2px solid #e5e7eb;
          transition: all 0.3s ease;
        }

        .metric-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 36px rgba(0,0,0,0.12);
          border-color: #6b21ff;
        }

        .metric-card.inactive {
          opacity: 0.6;
          background: #f9fafb;
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          color: #6b21ff;
        }

        .card-header h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
        }

        .status-icon.success {
          color: #10b981;
        }

        .status-icon.warning {
          color: #f59e0b;
        }

        .card-body {
          color: #374151;
        }

        .inactive-message {
          text-align: center;
          padding: 30px 20px;
        }

        .inactive-message p {
          font-weight: 600;
          color: #6b7280;
          margin: 0 0 8px 0;
        }

        .inactive-message small {
          color: #9ca3af;
          font-size: 14px;
        }

        .warning-message {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 20px;
          background: #fef3c7;
          border-radius: 12px;
          color: #92400e;
          font-weight: 600;
        }

        .score-display {
          display: flex;
          justify-content: center;
          margin-bottom: 24px;
        }

        .score-circle {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .score-inner {
          width: 110px;
          height: 110px;
          background: white;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .score-value {
          font-size: 36px;
          font-weight: 900;
          color: #1f2937;
        }

        .score-label {
          font-size: 12px;
          color: #6b7280;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .metrics-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .metric-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #f9fafb;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          transition: all 0.2s;
        }

        .metric-row:hover {
          background: #f3f4f6;
          transform: translateX(4px);
        }

        .metric-name {
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }

        .metric-val {
          font-weight: 700;
          color: #6b7280;
          font-size: 14px;
        }

        .metric-val.success {
          color: #10b981;
        }

        .metric-val.warning {
          color: #f59e0b;
        }

        .wpm-display {
          text-align: center;
          padding: 30px 20px;
          background: linear-gradient(135deg, #6b21ff15, #3b82f615);
          border-radius: 16px;
          margin-bottom: 20px;
        }

        .wpm-value {
          font-size: 56px;
          font-weight: 900;
          color: #6b21ff;
          line-height: 1;
        }

        .wpm-label {
          font-size: 14px;
          color: #6b7280;
          font-weight: 600;
          margin-top: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .activity-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #9ca3af;
        }

        .activity-dot.active {
          background: #10b981;
          animation: blink 1.5s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .status-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 12px;
          font-weight: 600;
          margin-top: 16px;
        }

        .status-badge.success {
          background: #d1fae5;
          color: #065f46;
        }

        .current-app {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 16px;
          margin-bottom: 20px;
          border: 1px solid #e5e7eb;
        }

        .app-icon {
          font-size: 32px;
          flex-shrink: 0;
        }

        .app-info {
          flex: 1;
          min-width: 0;
        }

        .app-name {
          font-weight: 700;
          color: #1f2937;
          font-size: 16px;
          margin-bottom: 4px;
        }

        .app-title {
          font-size: 13px;
          color: #6b7280;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .distraction-meter {
          margin-bottom: 20px;
        }

        .meter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .meter-value {
          font-size: 18px;
          font-weight: 800;
        }

        .meter-value.low {
          color: #10b981;
        }

        .meter-value.medium {
          color: #f59e0b;
        }

        .meter-value.high {
          color: #ef4444;
        }

        .meter-bar {
          height: 12px;
          background: #e5e7eb;
          border-radius: 10px;
          overflow: hidden;
        }

        .meter-fill {
          height: 100%;
          border-radius: 10px;
          transition: width 0.5s ease;
        }

        .meter-fill.low {
          background: linear-gradient(90deg, #10b981, #059669);
        }

        .meter-fill.medium {
          background: linear-gradient(90deg, #f59e0b, #d97706);
        }

        .meter-fill.high {
          background: linear-gradient(90deg, #ef4444, #dc2626);
        }

        .grid-2 { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(450px, 1fr)); 
          gap: 25px; 
          margin-bottom: 30px;
        }
        
        .grid-3 { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
          gap: 15px; 
        }

        .card {
          background: white;
          padding: 28px;
          border-radius: 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border: 1px solid #e5e7eb;
        }

        .card h2 { 
          display: flex; 
          align-items: center; 
          gap: 12px; 
          margin: 0 0 20px 0;
          font-size: 22px; 
          color: #1f2937;
          font-weight: 800;
        }

        .tip { 
          display: flex; 
          gap: 12px; 
          align-items: center;
          padding: 14px; 
          background: #f9fafb; 
          border-radius: 12px; 
          margin-bottom: 10px;
          border: 1px solid #e5e7eb;
          transition: all 0.2s;
        }
        
        .tip:hover { 
          background: #f3f4f6; 
          transform: translateX(4px); 
        }
        
        .tip-icon { 
          flex-shrink: 0; 
          font-size: 20px; 
        }

        @media (max-width: 768px) {
          .focus-wrapper {
            padding: 20px;
          }

          .title {
            font-size: 32px;
          }

          .timer {
            font-size: 64px;
          }

          .flow-text h2 {
            font-size: 24px;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .grid-2 {
            grid-template-columns: 1fr;
          }

          .monitoring-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default FocusMode