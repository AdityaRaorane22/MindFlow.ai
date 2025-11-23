import React from 'react';
import { Brain, Zap, Trophy, User, BarChart2, Target, BookOpen, Lightbulb } from 'lucide-react';

const Navbar = ({ currentPage, setCurrentPage, userData }) => {
  return (
    <>
      <style>{`
        .navbar {
          background: linear-gradient(to right, #7c3aed, #2563eb);
          color: white;
          padding: 16px 0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .navbar-container {
          max-width: 1200px;
          margin: auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: 0.2s;
        }

        .navbar-logo:hover {
          opacity: 0.85;
        }

        .logo-icon { width: 32px; height: 32px; }
        .logo-title { font-size: 22px; font-weight: bold; }
        .logo-sub { font-size: 11px; opacity: 0.8; }

        .navbar-userstats {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stat-box {
          background: rgba(255, 255, 255, 0.2);
          padding: 8px 16px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: bold;
        }

        .stat-icon {
          width: 20px;
          height: 20px;
          color: gold;
        }

        .profile-btn {
          background: rgba(255, 255, 255, 0.2);
          padding: 8px 16px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          color: white;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: 0.2s;
        }

        .profile-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .profile-icon {
          width: 20px;
          height: 20px;
        }

        .nav-menu {
          margin-top: 12px;
          display: flex;
          gap: 12px;
          padding: 0 24px;
        }

        .nav-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 20px;
          background: rgba(255,255,255,0.1);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          color: white;
          font-weight: 500;
          transition: 0.2s;
        }

        .nav-btn:hover {
          background: rgba(255,255,255,0.2);
        }

        .nav-btn.active {
          background: white;
          color: #7c3aed;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }

        .nav-btn-icon {
          width: 16px;
          height: 16px;
        }
      `}</style>

      <nav className="navbar">
        <div className="navbar-container">

          {/* LOGO */}
          <div 
            className="navbar-logo"
            onClick={() => setCurrentPage('dashboard')}
          >
            <Brain className="logo-icon" />
            <div>
              <h1 className="logo-title">MindFlow.ai</h1>
              <p className="logo-sub">AI Flow State Facilitator</p>
            </div>
          </div>

          {/* USER STATS */}
          <div className="navbar-userstats">
            <div className="stat-box">
              <Zap className="stat-icon" />
              <span>{userData.coins}</span>
            </div>

            <div className="stat-box">
              <Trophy className="stat-icon" />
              <span>Lvl {userData.level}</span>
            </div>

            <button 
              className="profile-btn"
              onClick={() => setCurrentPage('profile')}
            >
              <User className="profile-icon" />
              <span>{userData.name || 'User'}</span>
            </button>
          </div>
        </div>

        {/* NAV MENU */}
        <div className="nav-menu">
          {[
            { id: 'dashboard', icon: BarChart2, label: 'Dashboard' },
            { id: 'focus', icon: Target, label: 'Focus Mode' },
            { id: 'learn', icon: BookOpen, label: 'Learn' },
            { id: 'features', icon: Lightbulb, label: 'Features' }
          ].map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`nav-btn ${currentPage === item.id ? 'active' : ''}`}
              >
                <Icon className="nav-btn-icon" />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
