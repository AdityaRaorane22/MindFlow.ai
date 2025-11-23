import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, Brain, ArrowLeft } from 'lucide-react';

const Contact = ({ setCurrentPage, isLoggedIn }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setMessage('');
    }, 3000);
  };

  return (
    <>

      {/* INLINE CSS HERE */}
      <style>{`
        .page-container {
          min-height: 100vh;
          background: #f9fafb;
        }

        /* TOP NAV */
        .topnav {
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 50;
          padding: 16px 0;
        }

        .topnav-inner {
          max-width: 1200px;
          margin: auto;
          display: flex;
          padding: 0 24px;
          align-items: center;
          justify-content: space-between;
        }

        .top-logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .top-title {
          font-size: 26px;
          font-weight: bold;
          color: #2d2d2d;
        }

        .back-home {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          padding: 8px 14px;
          border: none;
          font-size: 16px;
          color: #444;
          background: transparent;
          transition: 0.2s;
        }

        .back-home:hover {
          color: #7c3aed;
        }

        /* MAIN CONTENT */
        .content-wrapper {
          max-width: 1200px;
          margin: auto;
          padding: 100px 24px;
        }

        .contact-title {
          font-size: 48px;
          font-weight: bold;
          text-align: center;
          color: #2d2d2d;
          margin-bottom: 12px;
        }

        .contact-sub {
          text-align: center;
          font-size: 20px;
          color: #666;
          margin-bottom: 60px;
        }

        .grid {
          display: grid;
          gap: 32px;
        }

        @media (min-width: 768px) {
          .grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        /* FORM CARD */
        .form-card {
          background: white;
          padding: 32px;
          border-radius: 20px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.1);
        }

        .form-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 24px;
          color: #2d2d2d;
        }

        .input-label {
          font-weight: 600;
          color: #444;
          margin-bottom: 4px;
          display: block;
        }

        .input-box {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #d2d2d2;
          border-radius: 10px;
          font-size: 16px;
          transition: 0.2s;
        }

        .input-box:focus {
          outline: none;
          border-color: #7c3aed;
        }

        .submit-btn {
          width: 100%;
          padding: 14px;
          margin-top: 12px;
          background: linear-gradient(to right, #7c3aed, #2563eb);
          color: white;
          font-size: 18px;
          border: none;
          border-radius: 10px;
          font-weight: bold;
          cursor: pointer;
          transition: 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .submit-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 18px rgba(0,0,0,0.2);
        }

        .success-box {
          background: #ecfdf5;
          border: 2px solid #34d399;
          color: #047857;
          padding: 14px;
          border-radius: 10px;
          margin-bottom: 20px;
        }

        /* CONTACT INFO PANEL */
        .info-panel {
          background: linear-gradient(to bottom right, #7c3aed, #2563eb);
          color: white;
          padding: 32px;
          border-radius: 20px;
        }

        .info-title {
          font-size: 26px;
          font-weight: bold;
          margin-bottom: 20px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          font-size: 16px;
        }

        /* SOCIAL CARDS */
        .card-white {
          background: white;
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.1);
        }

        .social-btn {
          flex: 1;
          padding: 12px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: none;
          color: white;
          cursor: pointer;
          font-weight: 600;
          transition: 0.2s;
        }

        .github-btn { background: #111; }
        .github-btn:hover { background: #222; }

        .linkedin-btn { background: #0a66c2; }
        .linkedin-btn:hover { background: #0c7fe0; }

        .twitter-btn { background: #1da1f2; }
        .twitter-btn:hover { background: #0d8bdc; }

        /* QUICK LINKS */
        .quick-link {
          width: 100%;
          padding: 14px;
          border-radius: 10px;
          text-align: left;
          border: none;
          font-size: 16px;
          cursor: pointer;
          font-weight: 600;
          transition: 0.2s;
        }

        .quick-link:hover {
          opacity: 0.8;
        }

        .purple-link { background: #f3e8ff; color: #6b21a8; }
        .blue-link { background: #eff6ff; color: #1d4ed8; }
        .green-link { background: #ecfdf5; color: #15803d; }

        /* GITHUB OPEN SOURCE BOX */
        .open-source {
          background: linear-gradient(to bottom right, #111, #222);
          color: white;
          padding: 28px;
          border-radius: 18px;
        }

        .github-open-btn {
          background: white;
          color: #222;
          padding: 10px 18px;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          text-decoration: none;
          transition: 0.2s;
        }

        .github-open-btn:hover {
          background: #f3f3f3;
        }

      `}</style>

      <div className="page-container">

        {/* TOP NAV */}
        {!isLoggedIn && (
          <nav className="topnav">
            <div className="topnav-inner">
              <div className="top-logo">
                <Brain className="w-10 h-10" style={{ color: "#7c3aed" }} />
                <span className="top-title">MindFlow.ai</span>
              </div>

              <button 
                onClick={() => setCurrentPage('home')}
                className="back-home"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </button>
            </div>
          </nav>
        )}

        <div className="content-wrapper">

          <h1 className="contact-title">Get In Touch</h1>
          <p className="contact-sub">Have questions? We'd love to hear from you!</p>

          <div className="grid">

            {/* FORM */}
            <div className="form-card">

              <h2 className="form-title">Send us a message</h2>

              {submitted && (
                <div className="success-box">
                  <p>✅ Message sent successfully!</p>
                  <p style={{ fontSize: "14px" }}>We'll get back to you soon.</p>
                </div>
              )}

              <div>
                <label className="input-label">Name</label>
                <input 
                  className="input-box"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>

              <div style={{ marginTop: 20 }}>
                <label className="input-label">Email</label>
                <input 
                  className="input-box"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>

              <div style={{ marginTop: 20 }}>
                <label className="input-label">Message</label>
                <textarea 
                  className="input-box"
                  style={{ resize: "none", height: 140 }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your message..."
                />
              </div>

              <button onClick={handleSubmit} className="submit-btn">
                <Send className="w-5 h-5" />
                Send Message
              </button>

            </div>

            {/* RIGHT SIDE INFO */}
            <div className="space-y-6">

              {/* TEAM INFO */}
              <div className="info-panel">
                <h2 className="info-title">Team Sunrisers</h2>
                <p style={{ opacity: 0.8, marginBottom: 16 }}>
                  We're a passionate team from NITSHACKS 2025, building the future of focus and productivity.
                </p>

                <div>
                  <div className="info-item">
                    <Mail className="w-5 h-5" /> team.sunrisers@mindflow.ai
                  </div>
                  <div className="info-item">
                    <Phone className="w-5 h-5" /> +91 98765 43210
                  </div>
                  <div className="info-item">
                    <MapPin className="w-5 h-5" /> NIT Silchar, Assam, India
                  </div>
                </div>
              </div>

              {/* SOCIAL BUTTONS */}
              <div className="card-white">
                <h3 style={{ fontSize: 22, fontWeight: "bold", marginBottom: 16 }}>Connect With Us</h3>

                <div style={{ display: "flex", gap: 12 }}>
                  <button className="social-btn github-btn">
                    <Github className="w-5 h-5" /> GitHub
                  </button>

                  <button className="social-btn linkedin-btn">
                    <Linkedin className="w-5 h-5" /> LinkedIn
                  </button>

                  <button className="social-btn twitter-btn">
                    <Twitter className="w-5 h-5" /> Twitter
                  </button>
                </div>
              </div>

              {/* QUICK LINKS */}
              <div className="card-white">
                <h3 style={{ fontSize: 22, fontWeight: "bold", marginBottom: 16 }}>Quick Links</h3>

                <button 
                  onClick={() => setCurrentPage('features')}
                  className="quick-link purple-link"
                >
                  → Explore Features
                </button>

                <button 
                  onClick={() => setCurrentPage('learn')}
                  className="quick-link blue-link"
                  style={{ marginTop: 10 }}
                >
                  → Learn About Focus
                </button>

                <button 
                  onClick={() => setCurrentPage('signup')}
                  className="quick-link green-link"
                  style={{ marginTop: 10 }}
                >
                  → Get Started Free
                </button>
              </div>

              {/* OPEN SOURCE */}
              <div className="open-source">
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Open Source 💚</h3>
                <p style={{ opacity: 0.8, marginBottom: 12 }}>Check out our code on GitHub</p>

                <a 
                  href="https://github.com/AdityaRaorane22/MindFlow.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github-open-btn"
                >
                  <Github className="w-5 h-5" /> View on GitHub
                </a>
              </div>

            </div>

          </div>

        </div>
      </div>
    </>
  );
};

export default Contact;
