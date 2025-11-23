import React from 'react';
import { Clock, Target, Zap, TrendingUp, Eye, Brain, Flame, Calendar, BarChart2, Activity, Lightbulb } from 'lucide-react';

const Dashboard = ({ userData, setUserData, setCurrentPage }) => {

  const weekData = [
    { day: 'Mon', score: 68, minutes: 180 },
    { day: 'Tue', score: 75, minutes: 210 },
    { day: 'Wed', score: 82, minutes: 240 },
    { day: 'Thu', score: 71, minutes: 195 },
    { day: 'Fri', score: 78, minutes: 225 },
    { day: 'Sat', score: 85, minutes: 270 },
    { day: 'Sun', score: userData.flowScore, minutes: 156 }
  ];

  const todayStats = {
    focusTime: 156,
    distractions: 8,
    flowScore: userData.flowScore,
    coinsEarned: 45
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#3b82f6';
    return '#f59e0b';
  };

  return (
    <div className="dash-container">

      {/* HEADER */}
      <div className="header-box">
        <h1>Welcome back, {userData.name}! 👋</h1>
        <p>Your focus performance today</p>
      </div>

      {/* 4 STAT CARDS */}
      <div className="stats-grid">

        {/* Card 1 */}
        <div className="card">
          <div className="row-between">
            <Clock size={40} />
            <div>
              <p className="label">Focus Time</p>
              <h2>{todayStats.focusTime}m</h2>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="card">
          <div className="row-between">
            <TrendingUp size={40} />
            <div>
              <p className="label">Flow Score</p>
              <h2 style={{ color: getScoreColor(userData.flowScore) }}>
                {userData.flowScore}
              </h2>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="card">
          <div className="row-between">
            <Zap size={40} />
            <div>
              <p className="label">Coins Earned</p>
              <h2>+{todayStats.coinsEarned}</h2>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="card">
          <div className="row-between">
            <Target size={40} />
            <div>
              <p className="label">Distractions</p>
              <h2>{todayStats.distractions}</h2>
            </div>
          </div>
        </div>

      </div>

      {/* FLOW SCORE CIRCLE */}
      <div className="circle-card">
        <h2 className="section-title"><Eye size={18} /> Current Flow Score</h2>

        <div className="circle-wrapper">
          <div className="circle">
            <span style={{ color: getScoreColor(userData.flowScore) }}>
              {userData.flowScore}
            </span>
          </div>
        </div>
      </div>

      {/* WEEKLY PROGRESS */}
      <div className="progress-box">
        <h2 className="section-title"><BarChart2 size={18} /> Weekly Progress</h2>

        {weekData.map((day, idx) => (
          <div className="progress-row" key={idx}>
            <span className="day-label">{day.day}</span>

            <div className="bar-track">
              <div
                className="bar-fill"
                style={{ width: `${day.score}%` }}
              >
                {day.score}
              </div>
            </div>

            <span className="minutes">{day.minutes}m</span>
          </div>
        ))}

      </div>

      {/* CTA */}
      <div className="cta-box">
        <h2>Ready to Focus?</h2>
        <p>Start a new focus session and improve your flow score</p>

        <button onClick={() => setCurrentPage('focus')} className="cta-btn">
          Start Focus Mode 🚀
        </button>
      </div>

      {/* ALL CSS BELOW */}
      <style>{`
        .dash-container {
          max-width: 900px;
          margin: auto;
          padding: 20px;
          font-family: Arial;
        }

        /* Header */
        .header-box {
          background: #6d5dfc;
          padding: 25px;
          border-radius: 15px;
          color: white;
        }
        .header-box h1 {
          margin: 0 0 5px 0;
        }

        /* Stats Grid */
        .stats-grid {
          margin-top: 20px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
        }

        .card {
          background: #ffffff;
          padding: 18px;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .row-between {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .label {
          font-size: 13px;
          color: #777;
        }

        /* Circle */
        .circle-card {
          margin-top: 25px;
          background: #fff;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .circle-wrapper {
          display: flex;
          justify-content: center;
        }

        .circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 8px solid #e5e5e5;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 38px;
          font-weight: bold;
        }

        /* Weekly Progress */
        .progress-box {
          margin-top: 25px;
          background: #fff;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .section-title {
          display: flex;
          gap: 6px;
          align-items: center;
          margin-bottom: 15px;
          font-weight: bold;
          color: #333;
        }

        .progress-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .day-label {
          width: 40px;
          font-weight: bold;
        }

        .bar-track {
          flex: 1;
          background: #ddd;
          height: 20px;
          border-radius: 10px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          background: #6d5dfc;
          color: white;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 5px;
        }

        .minutes {
          width: 50px;
          text-align: right;
          color: #555;
        }

        /* CTA */
        .cta-box {
          margin-top: 30px;
          text-align: center;
          background: #6d5dfc;
          padding: 30px;
          border-radius: 15px;
          color: white;
        }

        .cta-btn {
          background: white;
          color: #6d5dfc;
          border: none;
          padding: 12px 25px;
          margin-top: 10px;
          font-weight: bold;
          border-radius: 10px;
          cursor: pointer;
        }

        .cta-btn:hover {
          opacity: 0.9;
        }

      `}</style>

    </div>
  );
};

export default Dashboard;
