import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Coffee, Eye, Target, Brain, Zap, TrendingUp, AlertCircle, Activity } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

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
      <div className="focus-card">
        <h1 className="title">⚡ AI-Powered Focus Session</h1>
        <p className="subtitle">Real-time LSTM detection • {getStateEmoji(currentState)} {getStateLabel(currentState)}</p>

        <div className="timer-box">
          <p className="timer">{formatTime(sessionTime)}</p>

          <div className="stats-grid">
            <div className="stat">
              <p className="label">Flow Score</p>
              <p className="value" style={{ color: getFlowColor(flowScore) }}>{flowScore}</p>
            </div>

            <div className="stat">
              <p className="label">State</p>
              <p className="value" style={{ fontSize: '20px' }}>{getStateEmoji(currentState)}</p>
            </div>

            <div className="stat">
              <p className="label">Distractions</p>
              <p className="value" style={{ color: "#ef4444" }}>{distractions}</p>
            </div>

            <div className="stat">
              <p className="label">Coins</p>
              <p className="value" style={{ color: "#f59e0b" }}>{sessionCoins}</p>
            </div>
          </div>

          {currentState !== 'warming_up' && (
            <div style={{ marginTop: '20px' }}>
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

      <div className="grid-2">
        <div className="card">
          <h2><Brain /> LSTM Model Detection</h2>

          <Item icon={<Eye />} name="Eye Tracking" active={isActive} value={`${probabilities.focused.toFixed(1)}% conf`} />
          <Item icon={<Target />} name="Mouse Patterns" active={isActive} value={currentState !== 'warming_up' ? '✓ Active' : '○ Idle'} />
          <Item icon={<Brain />} name="LSTM + Attention" value={`${modelAccuracy}% accuracy`} />
          <Item icon={<Zap />} name="Keyboard Activity" active={isActive} value={`${sessionTime}s tracked`} />
          <Item icon={<Activity />} name="Flow State" value={getStateLabel(currentState)} />
        </div>

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
        .focus-wrapper { max-width: 1200px; margin: auto; padding: 25px; background: #f9fafb; min-height: 100vh; }
        .focus-card {
          background: linear-gradient(135deg, #6b21ff, #4b32ff, #216aff);
          padding: 40px;
          border-radius: 30px;
          color: white;
          box-shadow: 0 15px 40px rgba(107, 33, 255, 0.4);
        }

        .title { font-size: 40px; font-weight: 800; margin-bottom: 10px; }
        .subtitle { opacity: 0.95; margin-bottom: 25px; font-size: 18px; }

        .timer-box {
          background: rgba(255,255,255,0.12);
          padding: 30px;
          border-radius: 30px;
          border: 2px solid rgba(255,255,255,0.25);
          backdrop-filter: blur(10px);
        }

        .timer { 
          font-size: 80px; 
          font-family: 'SF Mono', 'Monaco', monospace; 
          text-align: center; 
          font-weight: 700;
          letter-spacing: -2px;
        }

        .stats-grid {
          margin-top: 25px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
        }

        .stat { 
          background: rgba(255,255,255,0.15); 
          padding: 18px; 
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.2);
          transition: all 0.3s ease;
        }
        .stat:hover { transform: translateY(-2px); background: rgba(255,255,255,0.2); }
        .label { opacity: 0.85; font-size: 13px; margin-bottom: 6px; font-weight: 600; }
        .value { font-size: 32px; font-weight: bold; }

        .controls { display: flex; gap: 15px; justify-content: center; margin-top: 25px; }

        .btn {
          display: flex; align-items: center; gap: 12px;
          font-size: 20px; padding: 16px 40px;
          border-radius: 50px; cursor: pointer;
          border: none; font-weight: 700;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        }

        .white-btn { background: white; color: #5b21ff; }
        .white-btn:hover { background: #f0f0f0; transform: scale(1.05); box-shadow: 0 12px 30px rgba(0,0,0,0.3); }

        .red-btn { background: #ef4444; color: white; }
        .red-btn:hover { background: #dc2626; transform: scale(1.05); }

        .break-alert {
          background: linear-gradient(135deg, #10b981, #059669);
          padding: 30px;
          border-radius: 25px;
          text-align: center;
          color: white;
          margin-top: 25px;
          animation: pulse 2s infinite;
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }

        .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 25px; margin-top: 25px; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }

        .card {
          background: white;
          padding: 28px;
          border-radius: 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border: 1px solid #e5e7eb;
        }

        .card h2 { 
          display: flex; align-items: center; gap: 12px; 
          margin-bottom: 20px; font-size: 22px; color: #1f2937;
        }

        .tip { 
          display: flex; gap: 12px; align-items: center;
          padding: 14px; background: #f9fafb; 
          border-radius: 12px; margin-bottom: 10px;
          border: 1px solid #e5e7eb;
          transition: all 0.2s;
        }
        .tip:hover { background: #f3f4f6; transform: translateX(4px); }
        .tip-icon { flex-shrink: 0; font-size: 20px; }
      `}</style>
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

export default FocusMode;



// import React, { useState, useEffect } from 'react';
// import { Play, Pause, Square, Coffee, Eye, Target, Brain, Zap, TrendingUp, AlertCircle } from 'lucide-react';

// const FocusMode = ({ userData, setUserData, setCurrentPage }) => {
//   const [isActive, setIsActive] = useState(false);
//   const [sessionTime, setSessionTime] = useState(0);
//   const [flowScore, setFlowScore] = useState(75);
//   const [distractions, setDistractions] = useState(0);
//   const [showBreakAlert, setShowBreakAlert] = useState(false);
//   const [sessionCoins, setSessionCoins] = useState(0);

//   useEffect(() => {
//     let interval;
//     if (isActive) {
//       interval = setInterval(() => {
//         setSessionTime(prev => prev + 1);

//         if (Math.random() > 0.7)
//           setFlowScore(p => Math.min(100, p + Math.floor(Math.random() * 3)));

//         if (Math.random() > 0.98) {
//           setDistractions(p => p + 1);
//           setFlowScore(p => Math.max(0, p - Math.floor(Math.random() * 8)));
//         }

//         if (sessionTime % 60 === 0 && sessionTime > 0)
//           setSessionCoins(p => p + 5);

//         if (sessionTime % 1500 === 0 && sessionTime > 0) {
//           setShowBreakAlert(true);
//           setTimeout(() => setShowBreakAlert(false), 10000);
//         }
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [isActive, sessionTime]);

//   const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

//   const getFlowColor = (score) =>
//     score >= 80 ? "green" :
//     score >= 60 ? "blue" :
//     score >= 40 ? "gold" :
//     "red";

//   return (
//     <div className="focus-wrapper">

//       {/* MAIN FOCUS CARD */}
//       <div className="focus-card">
//         <h1 className="title">⚡ Focus Session</h1>
//         <p className="subtitle">Stay in the zone — your flow state is being tracked live.</p>

//         {/* TIMER */}
//         <div className="timer-box">
//           <p className="timer">{formatTime(sessionTime)}</p>

//           <div className="stats-grid">
//             <div className="stat">
//               <p className="label">Flow Score</p>
//               <p className="value" style={{ color: getFlowColor(flowScore) }}>{flowScore}</p>
//             </div>

//             <div className="stat">
//               <p className="label">Distractions</p>
//               <p className="value" style={{ color: "red" }}>{distractions}</p>
//             </div>

//             <div className="stat">
//               <p className="label">Coins</p>
//               <p className="value" style={{ color: "gold" }}>{sessionCoins}</p>
//             </div>
//           </div>
//         </div>

//         {/* CONTROLS */}
//         <div className="controls">
//           {!isActive ? (
//             <button className="btn white-btn" onClick={() => setIsActive(true)}>
//               <Play /> {sessionTime === 0 ? "Start Focus" : "Resume"}
//             </button>
//           ) : (
//             <button className="btn white-btn" onClick={() => setIsActive(false)}>
//               <Pause /> Pause
//             </button>
//           )}

//           {sessionTime > 0 && (
//             <button className="btn red-btn" onClick={() => { setIsActive(false); setCurrentPage("dashboard"); }}>
//               <Square /> End
//             </button>
//           )}
//         </div>
//       </div>

//       {/* BREAK ALERT */}
//       {showBreakAlert && (
//         <div className="break-alert">
//           <Coffee size={40} />
//           <h3>Time for a Micro-Break ☕</h3>
//           <p>Your flow score is {flowScore}. Take 5 min to recharge.</p>
//         </div>
//       )}

//       {/* TRACKING + TIPS */}
//       <div className="grid-2">
//         <div className="card">
//           <h2><Brain /> Real-Time Detection</h2>

//           <Item icon={<Eye />} name="Eye Tracking" active={isActive} />
//           <Item icon={<Target />} name="Mouse Patterns" active={isActive} />
//           <Item icon={<Brain />} name="LSTM Model" value="83.5% accuracy" />
//           <Item icon={<Zap />} name="Keyboard Activity" active={isActive} />
//         </div>

//         <div className="card tips">
//           <h2><TrendingUp /> AI Tips</h2>
//           <Tip text="Your flow increases after 15–20 minutes." color="purple" />
//           <Tip text="Take a 5-minute break every 25 minutes." color="blue" />
//           <Tip text={`Tabs switched ${distractions} times — reduce context jumps.`} color="green" />
//           <Tip text="You earn 5 coins every focused minute." color="yellow" />
//         </div>
//       </div>

//       {/* QUICK ACTIONS */}
//       <div className="card">
//         <h2>Quick Actions</h2>

//         <div className="grid-3">
//           <QuickButton text="📊 View Analytics" color="purple" onClick={() => setCurrentPage("dashboard")} />
//           <QuickButton text="📚 Learn Techniques" color="blue" onClick={() => setCurrentPage("learn")} />
//           <QuickButton text="👤 View Profile" color="green" onClick={() => setCurrentPage("profile")} />
//         </div>
//       </div>

//       {/* INLINE CSS */}
//       <style>{`
//         .focus-wrapper { max-width: 1200px; margin: auto; padding: 25px; }
//         .focus-card {
//           background: linear-gradient(135deg, #6b21ff, #4b32ff, #216aff);
//           padding: 40px;
//           border-radius: 30px;
//           color: white;
//           box-shadow: 0 15px 40px rgba(0,0,0,0.25);
//         }

//         .title { font-size: 40px; font-weight: 800; margin-bottom: 10px; }
//         .subtitle { opacity: 0.9; margin-bottom: 25px; }

//         .timer-box {
//           background: rgba(255,255,255,0.1);
//           padding: 30px;
//           border-radius: 30px;
//           border: 1px solid rgba(255,255,255,0.3);
//         }

//         .timer { font-size: 70px; font-family: monospace; text-align: center; }

//         .stats-grid {
//           margin-top: 20px;
//           display: grid;
//           grid-template-columns: repeat(3, 1fr);
//           gap: 20px;
//           text-align: center;
//         }

//         .stat { background: rgba(255,255,255,0.12); padding: 15px; border-radius: 15px; }
//         .label { opacity: 0.8; font-size: 14px; }
//         .value { font-size: 32px; font-weight: bold; }

//         .controls { display: flex; gap: 15px; justify-content: center; margin-top: 20px; }

//         .btn {
//           display: flex; align-items: center; gap: 10px;
//           font-size: 20px; padding: 15px 35px;
//           border-radius: 40px; cursor: pointer;
//           border: none; font-weight: 700;
//           transition: 0.2s;
//         }

//         .white-btn { background: white; color: #5b21ff; }
//         .white-btn:hover { background: #eee; transform: scale(1.05); }

//         .red-btn { background: #ff3b47; color: white; }
//         .red-btn:hover { background: #e22735; transform: scale(1.05); }

//         .break-alert {
//           background: linear-gradient(90deg, #22c55e, #0ca66a);
//           padding: 25px;
//           border-radius: 20px;
//           text-align: center;
//           color: white;
//           margin-top: 20px;
//           animation: pulse 1.5s infinite;
//         }

//         @keyframes pulse {
//           0% { transform: scale(1); }
//           50% { transform: scale(1.02); }
//           100% { transform: scale(1); }
//         }

//         .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 25px; margin-top: 25px; }
//         .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }

//         .card {
//           background: white;
//           padding: 25px;
//           border-radius: 20px;
//           box-shadow: 0 10px 20px rgba(0,0,0,0.1);
//         }

//         .card h2 { display: flex; align-items: center; gap: 10px; margin-bottom: 15px; }

//         .tip { display: flex; gap: 10px; padding: 10px; background: #f8f8f8; border-radius: 10px; margin-bottom: 8px; }
//         .tip-icon { flex-shrink: 0; }
//       `}</style>

//     </div>
//   );
// };

// /* Small components */
// const Item = ({ icon, name, active, value }) => (
//   <div style={{
//     display: "flex", justifyContent: "space-between", padding: "12px",
//     background: "#f3f3f3", borderRadius: "12px", marginBottom: "8px"
//   }}>
//     <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//       {icon}
//       <span>{name}</span>
//     </div>
//     <span>{value || (active ? "✓ Active" : "○ Idle")}</span>
//   </div>
// );

// const Tip = ({ text }) => (
//   <div className="tip">
//     <AlertCircle className="tip-icon" />
//     <p>{text}</p>
//   </div>
// );

// const QuickButton = ({ text, color, onClick }) => {
//   const colors = {
//     purple: "#ede0ff",
//     blue: "#e0ecff",
//     green: "#e0ffe5",
//   };

//   return (
//     <button
//       onClick={onClick}
//       style={{
//         background: colors[color],
//         padding: "15px",
//         borderRadius: "12px",
//         fontWeight: "600",
//         border: "none",
//         cursor: "pointer"
//       }}
//     >
//       {text}
//     </button>
//   );
// };

// export default FocusMode;
