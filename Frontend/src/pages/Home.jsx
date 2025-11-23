import React from 'react';
import { Brain, Eye, Zap, Trophy, Target, TrendingUp, Award } from 'lucide-react';

const Home = ({ setCurrentPage, isLoggedIn }) => {

  return (
    <div style={{ minHeight: "100vh" }}>
      
      {/* NAVBAR */}
      <nav style={{
        background: "rgba(255,255,255,0.8)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Brain style={{ width: 40, height: 40, color: "#7c3aed" }} />
            <span style={{ fontSize: 24, fontWeight: 700, color: "#1f2937" }}>
              MindFlow.ai
            </span>
          </div>

          <div style={{ display: "flex", gap: "16px" }}>
            <button 
              onClick={() => setCurrentPage("features")}
              style={navBtn}
            >
              Features
            </button>

            <button 
              onClick={() => setCurrentPage("contact")}
              style={navBtn}
            >
              Contact
            </button>

            {isLoggedIn ? (
              <button
                onClick={() => setCurrentPage("dashboard")}
                style={purpleBtn}
              >
                Dashboard
              </button>
            ) : (
              <>
                <button 
                  onClick={() => setCurrentPage("login")}
                  style={outlineBtn}
                >
                  Login
                </button>

                <button 
                  onClick={() => setCurrentPage("signup")}
                  style={purpleBtn}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 16px" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <h1 style={{ fontSize: 56, fontWeight: 800, color: "#1f2937", marginBottom: 20 }}>
            Master Your{" "}
            <span style={{
              background: "linear-gradient(to right, #7c3aed, #2563eb)",
              WebkitBackgroundClip: "text",
              color: "transparent"
            }}>
              Flow State
            </span>
          </h1>

          <p style={{
            fontSize: 20,
            color: "#4b5563",
            maxWidth: "700px",
            margin: "0 auto 30px"
          }}>
            AI-powered platform for real-time flow detection, intelligent focus amplification,  
            and gamified concentration building through multi-modal tracking and deep learning.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
            <button 
              onClick={() => setCurrentPage("signup")}
              style={{
                padding: "16px 32px",
                borderRadius: 12,
                fontSize: 18,
                fontWeight: 700,
                color: "white",
                background: "linear-gradient(to right, #7c3aed, #2563eb)",
                border: 0,
                cursor: "pointer"
              }}
            >
              Get Started Free 🚀
            </button>

            <button 
              onClick={() => setCurrentPage("features")}
              style={{
                padding: "16px 32px",
                borderRadius: 12,
                fontSize: 18,
                fontWeight: 700,
                color: "#7c3aed",
                background: "white",
                border: "2px solid #7c3aed",
                cursor: "pointer"
              }}
            >
              Explore Features
            </button>
          </div>
        </div>

        {/* FEATURES GRID */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: 32,
          marginBottom: 80
        }}>
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} style={card}>
                <Icon style={{ width: 48, height: 48, color: "#7c3aed", marginBottom: 12 }} />
                <h3 style={{ fontSize: 22, fontWeight: 700, color: "#1f2937", marginBottom: 10 }}>
                  {f.title}
                </h3>
                <p style={{ color: "#4b5563" }}>{f.desc}</p>
              </div>
            );
          })}
        </div>

        {/* STATS */}
        <div style={{
          background: "linear-gradient(to right, #7c3aed, #2563eb)",
          borderRadius: 32,
          padding: 48,
          color: "white",
          textAlign: "center",
          marginBottom: 80
        }}>
          <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 40 }}>
            Backed by Science
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 32
          }}>
            {stats.map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 44, fontWeight: 800 }}>{s.big}</div>
                <div style={{ color: "#e9d5ff" }}>{s.label}</div>
                <p style={{ fontSize: 12, color: "#ddd6fe", marginTop: 6 }}>{s.small}</p>
              </div>
            ))}
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div style={{ marginBottom: 80 }}>
          <h2 style={{ fontSize: 40, fontWeight: 800, color: "#1f2937", textAlign: "center", marginBottom: 40 }}>
            How It Works
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: 24
          }}>
            {steps.map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{
                  width: 64,
                  height: 64,
                  background: "#7c3aed",
                  color: "white",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  fontWeight: 700,
                  margin: "0 auto 12px"
                }}>
                  {s.step}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1f2937", marginBottom: 6 }}>
                  {s.title}
                </h3>
                <p style={{ color: "#4b5563" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{
          background: "linear-gradient(to bottom right, #ede9fe, #dbeafe)",
          borderRadius: 32,
          padding: 48,
          textAlign: "center"
        }}>
          <h2 style={{ fontSize: 40, fontWeight: 800, color: "#1f2937", marginBottom: 12 }}>
            Ready to Master Your Focus?
          </h2>
          <p style={{ fontSize: 20, color: "#4b5563", marginBottom: 32 }}>
            Join MindFlow.ai today and unlock your peak productivity
          </p>

          <button
            onClick={() => setCurrentPage("signup")}
            style={{
              padding: "18px 40px",
              borderRadius: 14,
              fontSize: 20,
              fontWeight: 800,
              color: "white",
              background: "linear-gradient(to right, #7c3aed, #2563eb)",
              border: 0,
              cursor: "pointer"
            }}
          >
            Start Your Journey 🚀
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: "#111827", color: "white", padding: "32px 0", textAlign: "center" }}>
        <p style={{ color: "#9ca3af", marginBottom: 6 }}>
          © 2025 MindFlow.ai - Team Sunrisers | NITSHACKS 2025
        </p>
        <p style={{ fontSize: 14, color: "#6b7280" }}>
          AI Flow State Facilitator • Multi-Modal Tracking • LSTM Deep Learning
        </p>
      </footer>
    </div>
  );
};

/* STYLES */
const navBtn = {
  padding: "8px 16px",
  fontSize: 16,
  fontWeight: 600,
  color: "#374151",
  background: "transparent",
  border: 0,
  cursor: "pointer"
};

const purpleBtn = {
  padding: "8px 20px",
  background: "#7c3aed",
  color: "white",
  borderRadius: 8,
  fontWeight: 700,
  border: "none",
  cursor: "pointer"
};

const outlineBtn = {
  padding: "8px 20px",
  border: "2px solid #7c3aed",
  borderRadius: 8,
  color: "#7c3aed",
  fontWeight: 700,
  background: "transparent",
  cursor: "pointer"
};

const card = {
  background: "white",
  padding: 32,
  borderRadius: 24,
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
};

/* DATA */
const features = [
  { icon: Eye, title: "Real-Time Flow Detection", desc: "LSTM + Attention model with 83.5% accuracy..." },
  { icon: Zap, title: "Smart Focus Protection", desc: "Auto-reduces distractions and triggers micro-breaks..." },
  { icon: Trophy, title: "Gamified Training", desc: "Earn coins and unlock power-ups..." },
  { icon: Target, title: "AI Analytics", desc: "Visualize focus patterns with deep learning insights..." },
  { icon: TrendingUp, title: "Flow Optimization", desc: "Amplify focus scientifically..." },
  { icon: Award, title: "Skill Tree System", desc: "Train concentration, endurance and consistency..." }
];

const stats = [
  { big: "83.5%", label: "Model Accuracy", small: "LSTM + Attention" },
  { big: "Multi-Modal", label: "Tracking", small: "Eye, Mouse, Keyboard" },
  { big: "24/7", label: "AI Monitoring", small: "Gemini AI Powered" },
  { big: "100%", label: "Privacy First", small: "On-Device Processing" }
];

const steps = [
  { step: "1", title: "Sign Up", desc: "Create your free account" },
  { step: "2", title: "Start Session", desc: "Begin tracking focus" },
  { step: "3", title: "Stay in Flow", desc: "AI monitors your state" },
  { step: "4", title: "Level Up", desc: "Earn rewards & improve" }
];

export default Home;
