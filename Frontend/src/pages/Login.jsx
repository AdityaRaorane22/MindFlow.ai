import React, { useState } from 'react';
import { Brain, Mail, Lock, ArrowLeft } from 'lucide-react';

const Login = ({ setIsLoggedIn, setCurrentPage, setUserData }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.msg);
      return;
    }

    setUserData({
      name: data.user.name,
      email: data.user.email,
      flowScore: 72,
      coins: 1250,
      level: 8,
      streak: 12,
      totalTime: 4320
    });

    setIsLoggedIn(true);
    setCurrentPage("dashboard");

  } catch (err) {
    console.log(err);
    alert("Server error");
  }
};


  return (
    <div className="login-container">
      <div className="login-box">
        {/* Header */}
        <div className="login-header">
          <div className="login-logo">
            <Brain className="logo-icon" />
          </div>
          <h1>Welcome Back!</h1>
          <p>Login to continue your flow journey</p>
        </div>

        {/* Login Form */}
        <div className="login-form">
          <div className="form-group">
            <label>
              <Mail className="icon" /> Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label>
              <Lock className="icon" /> Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div className="form-row">
            <label className="checkbox-label">
              <input type="checkbox" />
              Remember me
            </label>
            <button className="forgot-btn">Forgot Password?</button>
          </div>

          <button className="login-btn" onClick={handleLogin}>
            Login
          </button>

          <div className="signup-link">
            <p>
              Don't have an account?{' '}
              <button onClick={() => setCurrentPage('signup')}>Sign Up</button>
            </p>
          </div>

          <button className="back-home" onClick={() => setCurrentPage('home')}>
            <ArrowLeft className="icon" /> Back to Home
          </button>
        </div>

        {/* Quick Demo */}
        <div className="demo-box">
          <p><strong>Demo Mode:</strong> Use any email & password to login</p>
          <p>Try: demo@mindflow.ai</p>
        </div>
      </div>

      <style>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          font-family: sans-serif;
          background: #f3f4f6;
        }
        .login-box {
          max-width: 400px;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .login-logo {
          display: inline-block;
          padding: 1rem;
          background: linear-gradient(to bottom right, #7e5bef, #3b82f6);
          border-radius: 1rem;
          margin-bottom: 1rem;
        }
        .logo-icon {
          width: 4rem;
          height: 4rem;
          color: white;
        }
        .login-header h1 {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 0.25rem;
          color: #111827;
        }
        .login-header p {
          color: #6b7280;
          font-size: 0.875rem;
        }
        .login-form {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .form-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }
        .form-group input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #d1d5db;
          border-radius: 0.5rem;
          outline: none;
          transition: border 0.3s;
        }
        .form-group input:focus {
          border-color: #7e5bef;
        }
        .icon {
          width: 1rem;
          height: 1rem;
          color: #6b7280;
        }
        .form-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
          color: #6b7280;
        }
        .forgot-btn {
          background: none;
          border: none;
          color: #7e5bef;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          text-decoration: underline;
        }
        .login-btn {
          width: 100%;
          background: linear-gradient(to right, #7e5bef, #3b82f6);
          color: white;
          padding: 0.75rem;
          border-radius: 0.75rem;
          font-weight: bold;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .login-btn:hover {
          transform: scale(1.03);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        .signup-link {
          text-align: center;
          color: #6b7280;
          font-size: 0.875rem;
        }
        .signup-link button {
          background: none;
          border: none;
          color: #7e5bef;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
        }
        .back-home {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          margin-top: 1rem;
          padding: 0.5rem;
          font-weight: 500;
          border: none;
          background: none;
          cursor: pointer;
          color: #374151;
        }
        .back-home:hover {
          color: #111827;
        }
        .demo-box {
          margin-top: 1rem;
          background: #f5f3ff;
          border-radius: 1rem;
          border: 2px solid #ddd6fe;
          padding: 1rem;
          text-align: center;
          font-size: 0.875rem;
          color: #6b7280;
        }
        .demo-box p strong {
          color: #374151;
        }
      `}</style>
    </div>
  );
};

export default Login;