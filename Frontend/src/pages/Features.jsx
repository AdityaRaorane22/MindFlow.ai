import React from "react";
import {
  Brain,
  Eye,
  Zap,
  Trophy,
  Target,
  TrendingUp,
  Shield,
  Gamepad2,
  BarChart2,
  Sparkles,
  Lock,
  Clock,
  Award,
  Activity,
} from "lucide-react";

const Features = ({ setCurrentPage, isLoggedIn }) => {
  const mainFeatures = [
    {
      icon: Eye,
      title: "Real-Time Flow Detection",
      description:
        "Our LSTM + Attention deep learning model achieves 83.5% accuracy in detecting cognitive states through multi-modal tracking.",
      details: [
        "Eye-movement tracking via WebCam API",
        "Mouse and keyboard pattern analysis",
        "Tab switching and behavior monitoring",
        "Instant flow state prediction",
      ],
      color: "#8B5CF6",
    },
    {
      icon: Zap,
      title: "Flow Optimization System",
      description:
        "Intelligent system that protects and amplifies your focus automatically.",
      details: [
        "Auto-reduce distractions when in deep flow",
        "Smart micro-breaks at perfect timing",
        "Science-backed Pomodoro integration",
        "Proactive focus amplification",
      ],
      color: "#3B82F6",
    },
    {
      icon: Trophy,
      title: "Gamified Focus Training",
      description:
        "Turn concentration improvement into an engaging journey with rewards and progression.",
      details: [
        "Earn coins for focused minutes",
        "Level up cognitive skills",
        "Unlock power-ups and multipliers",
        "Achievement system and leaderboards",
      ],
      color: "#FACC15",
    },
    {
      icon: BarChart2,
      title: "AI-Driven Analytics",
      description:
        "Comprehensive dashboard with Gemini-powered personalized insights.",
      details: [
        "Focus pattern visualization",
        "Peak hours identification",
        "Distraction trigger analysis",
        "Personalized improvement tips",
      ],
      color: "#10B981",
    },
  ];

  const technicalFeatures = [
    {
      icon: Brain,
      title: "LSTM Deep Learning",
      desc: "Advanced neural network with attention mechanism for accurate state detection",
      badge: "83.5% Accuracy",
    },
    {
      icon: Shield,
      title: "On-Device Privacy",
      desc: "All processing happens locally. Your data never leaves your device",
      badge: "100% Private",
    },
    {
      icon: Sparkles,
      title: "Gemini AI Coaching",
      desc: "Personalized recommendations powered by Google's Gemini AI",
      badge: "AI-Powered",
    },
    {
      icon: Activity,
      title: "Multi-Modal Tracking",
      desc: "Eye, mouse, keyboard, and tab tracking combined for best results",
      badge: "Advanced",
    },
  ];

  const skillSystem = [
    {
      name: "Concentration",
      icon: Target,
      description: "Improve your ability to maintain focus on a single task",
      benefits: [
        "Faster task completion",
        "Reduced mental fatigue",
        "Better quality output",
      ],
    },
    {
      name: "Endurance",
      icon: Clock,
      description: "Build stamina to work for longer periods without breaks",
      benefits: [
        "Extended focus sessions",
        "More productive hours",
        "Consistent performance",
      ],
    },
    {
      name: "Consistency",
      icon: Award,
      description: "Develop daily habits and maintain steady improvement",
      benefits: ["Daily streak rewards", "Habit formation", "Long-term growth"],
    },
  ];

  return (
    <div style={{ minHeight: "100vh", fontFamily: "sans-serif" }}>
      {/* NAVBAR */}
      <nav
        style={{
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(10px)",
          padding: "20px 0",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{ display: "flex", gap: 12, cursor: "pointer" }}
            onClick={() => setCurrentPage("home")}
          >
            <Brain size={40} color="#7C3AED" />
            <h1 style={{ fontSize: 28, fontWeight: "bold", color: "#333" }}>
              MindFlow.ai
            </h1>
          </div>

          <div style={{ display: "flex", gap: 20 }}>
            <button
              onClick={() => setCurrentPage("home")}
              style={{
                border: "none",
                background: "none",
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              Home
            </button>

            <button
              onClick={() => setCurrentPage("contact")}
              style={{
                border: "none",
                background: "none",
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              Contact
            </button>

            <button
              onClick={() =>
                setCurrentPage(isLoggedIn ? "dashboard" : "signup")
              }
              style={{
                background: "#7C3AED",
                color: "white",
                border: "none",
                padding: "10px 24px",
                borderRadius: 10,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {isLoggedIn ? "Dashboard" : "Get Started"}
            </button>
          </div>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 24px" }}>
        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: 70 }}>
          <h1 style={{ fontSize: 48, fontWeight: "bold", color: "#222" }}>
            Powerful Features for{" "}
            <span style={{ color: "#7C3AED" }}>Peak Focus</span>
          </h1>
          <p style={{ fontSize: 20, color: "#666", maxWidth: 800, margin: "20px auto" }}>
            MindFlow.ai combines cutting-edge AI technology with gamification to help
            you achieve and maintain deep flow states
          </p>
        </div>

        {/* MAIN FEATURES */}
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {mainFeatures.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                style={{
                  background: idx % 2 === 0 ? "white" : "#f5f7ff",
                  borderRadius: 24,
                  padding: 40,
                  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                }}
              >
                <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
                  {/* ICON BG */}
                  <div
                    style={{
                      padding: 20,
                      borderRadius: 20,
                      background: feature.color,
                      display: "flex",
                    }}
                  >
                    <Icon size={36} color="white" />
                  </div>

                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: 32, fontWeight: "bold", marginBottom: 10 }}>
                      {feature.title}
                    </h2>

                    <p style={{ fontSize: 18, color: "#666", marginBottom: 20 }}>
                      {feature.description}
                    </p>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: 16,
                      }}
                    >
                      {feature.details.map((d, i) => (
                        <div
                          key={i}
                          style={{
                            background: "white",
                            padding: 14,
                            display: "flex",
                            gap: 12,
                            alignItems: "center",
                            borderRadius: 10,
                            boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                          }}
                        >
                          <div
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: feature.color,
                            }}
                          ></div>
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: 80,
            background: "linear-gradient(to right, #7C3AED, #2563EB)",
            padding: 50,
            borderRadius: 24,
            textAlign: "center",
            color: "white",
          }}
        >
          <h2 style={{ fontSize: 42, fontWeight: "bold", marginBottom: 12 }}>
            Ready to Experience MindFlow?
          </h2>
          <p style={{ fontSize: 20, opacity: 0.8, marginBottom: 30 }}>
            Join thousands achieving peak productivity with AI-powered focus
          </p>

          <button
            onClick={() =>
              setCurrentPage(isLoggedIn ? "dashboard" : "signup")
            }
            style={{
              background: "white",
              color: "#7C3AED",
              padding: "16px 40px",
              borderRadius: 14,
              fontSize: 20,
              fontWeight: 700,
              cursor: "pointer",
              border: "none",
            }}
          >
            {isLoggedIn ? "Go to Dashboard" : "Start Free Trial"} 🚀
          </button>
        </div>
      </div>
    </div>
  );
};

export default Features;
