import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Calendar,
  Trophy,
  Zap,
  Target,
  Clock,
  Award,
  Star,
  Settings,
  LogOut,
  Edit2,
  Save,
} from "lucide-react";

const Profile = ({ userData, setUserData, userId, setIsLoggedIn, setCurrentPage }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(userData?.name || "");
  const [editedEmail, setEditedEmail] = useState(userData?.email || "");

  // FETCH USER DETAILS
  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:5000/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUserData(data);
        setEditedName(data.name);
        setEditedEmail(data.email);
      })
      .catch((err) => console.log(err));
  }, [userId]);

  const handleSave = () => {
    setUserData({
      ...userData,
      name: editedName,
      email: editedEmail,
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage("home");
    setUserData(null);
  };

  const achievements = [
    { icon: Trophy, title: "First Flow", desc: "Complete your first focus session", unlocked: true, date: "2 weeks ago" },
    { icon: Star, title: "Week Warrior", desc: "7 day streak", unlocked: true, date: "1 week ago" },
    { icon: Target, title: "Sharp Focus", desc: "Reach 80+ flow score", unlocked: true, date: "3 days ago" },
    { icon: Zap, title: "Coin Master", desc: "Earn 1000 coins", unlocked: true, date: "Yesterday" },
    { icon: Award, title: "Flow Master", desc: "Reach 90+ flow score", unlocked: false, date: "Locked" },
    { icon: Clock, title: "Marathon", desc: "10 hours total focus time", unlocked: false, date: "Locked" },
  ];

  const stats = [
    { label: "Total Sessions", value: 42, icon: Target, color: "#8b5cf6" },
    {
      label: "Total Focus Time",
      value: `${Math.floor((userData?.totalTime || 0) / 60)}h ${(userData?.totalTime || 0) % 60}m`,
      icon: Clock, color: "#3b82f6",
    },
    { label: "Average Flow Score", value: userData?.flowScore || 0, icon: Trophy, color: "#facc15" },
    { label: "Current Streak", value: `${userData?.streak || 0} days`, icon: Star, color: "#fb923c" },
  ];

  return (
    <div className="profile-container">
      <style>{`
        .profile-container {
          max-width: 1100px;
          margin: auto;
          padding: 20px;
          font-family: sans-serif;
        }
        .header-card {
          background: linear-gradient(90deg, #7e5bef, #3b82f6);
          border-radius: 20px;
          padding: 30px;
          color: white;
          box-shadow: 0px 5px 20px rgba(0,0,0,0.15);
        }
        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .profile-pic {
          width: 90px;
          height: 90px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .edit-btn, .save-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: bold;
          padding: 10px 15px;
          border-radius: 10px;
          cursor: pointer;
          border: none;
        }
        .edit-btn {
          background: rgba(255,255,255,0.25);
          color: white;
        }
        .edit-btn:hover {
          background: rgba(255,255,255,0.35);
        }
        .save-btn {
          background: white;
          color: purple;
        }

        .level-bar {
          margin-top: 25px;
          background: rgba(255,255,255,0.25);
          padding: 15px;
          border-radius: 15px;
        }
        .level-progress {
          width: 100%;
          height: 15px;
          background: rgba(255,255,255,0.25);
          border-radius: 10px;
          overflow: hidden;
        }
        .level-fill {
          height: 100%;
          width: 65%;
          background: white;
        }

        .stats-grid {
          margin-top: 20px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
        }
        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0px 5px 15px rgba(0,0,0,0.1);
        }

        .achievements-card {
          margin-top: 20px;
          background: white;
          padding: 25px;
          border-radius: 18px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.12);
        }
        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .achievement {
          padding: 15px;
          border-radius: 12px;
          border: 2px solid #ddd;
          display: flex;
          gap: 12px;
        }
        .achievement.unlocked {
          background: #fff7d6;
          border-color: #facc15;
        }

        .logout-btn {
          display: flex;
          justify-content: center;
          gap: 10px;
          background: #ef4444;
          color: white;
          padding: 12px 25px;
          border-radius: 10px;
          cursor: pointer;
          margin: 30px auto;
          border: none;
          font-size: 16px;
          font-weight: bold;
        }
        .logout-btn:hover { background: #dc2626; }
      `}</style>

      {/* HEADER */}
      <div className="header-card">
        <div className="header-top">
          <div style={{ display: "flex", gap: "20px" }}>
            <div className="profile-pic">
              <User size={40} color="#7e5bef" />
            </div>

            {/* NAME/EMAIL */}
            <div>
              {isEditing ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    style={{ padding: "10px", borderRadius: "8px", border: "2px solid white" }}
                  />
                  <input
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    style={{ padding: "10px", borderRadius: "8px", border: "2px solid white" }}
                  />
                </div>
              ) : (
                <>
                  <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>
                    {userData?.name}
                  </h1>

                  <p style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Mail size={16} /> {userData?.email}
                  </p>

                  <p style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Calendar size={16} /> Member since January 2025
                  </p>
                </>
              )}
            </div>
          </div>

          {isEditing ? (
            <button className="save-btn" onClick={handleSave}>
              <Save size={18} /> Save
            </button>
          ) : (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              <Edit2 size={18} /> Edit
            </button>
          )}
        </div>

        {/* LEVEL BAR */}
        <div className="level-bar">
          <p>Level {userData?.level}</p>
          <div className="level-progress">
            <div className="level-fill"></div>
          </div>
          <p>650 / 1000 XP</p>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="stat-card">
              <Icon size={30} color={s.color} />
              <p style={{ marginTop: "10px", color: "#666" }}>{s.label}</p>
              <p style={{ fontSize: "22px", fontWeight: "bold" }}>{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* ACHIEVEMENTS */}
      <div className="achievements-card">
        <h2 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "15px" }}>
          <Award size={24} color="#7e5bef" /> Achievements
        </h2>

        <div className="achievements-grid">
          {achievements.map((a, i) => {
            const Icon = a.icon;
            return (
              <div key={i} className={`achievement ${a.unlocked ? "unlocked" : ""}`}>
                <div
                  style={{
                    padding: "10px",
                    borderRadius: "10px",
                    background: a.unlocked ? "#facc15" : "#ccc",
                  }}
                >
                  <Icon color={a.unlocked ? "white" : "gray"} />
                </div>

                <div>
                  <h3 style={{ fontWeight: "bold" }}>{a.title}</h3>
                  <p style={{ fontSize: "14px", color: "#555" }}>{a.desc}</p>
                  <p style={{ fontSize: "12px", color: "#999" }}>{a.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* LOGOUT */}
      <button className="logout-btn" onClick={handleLogout}>
        <LogOut size={20} /> Logout
      </button>
    </div>
  );
};

export default Profile;
