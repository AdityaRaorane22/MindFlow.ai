import React, { useState } from 'react';
import { Brain, User, Mail, Lock, ArrowLeft, CheckCircle } from 'lucide-react';

const Signup = ({ setIsLoggedIn, setCurrentPage, setUserData }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

const handleSignup = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.msg);
      return;
    }

    // success
    setUserData({
      name,
      email,
      flowScore: 0,
      coins: 100,
      level: 1,
      streak: 0,
      totalTime: 0
    });

    setIsLoggedIn(true);
    setCurrentPage("dashboard");

  } catch (err) {
    console.log(err);
    alert("Server error");
  }
};


  return (
    <div className="signup-container">
      <div className="signup-card">
        {/* Header */}
        <div className="signup-header">
          <div className="signup-icon">
            <Brain />
          </div>
          <h1>Join MindFlow</h1>
          <p>Start your journey to peak focus</p>
        </div>

        {/* Form */}
        <div className="signup-form">
          <div className="form-group">
            <label>
              <User /> Full Name
            </label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
          </div>

          <div className="form-group">
            <label>
              <Mail /> Email
            </label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>

          <div className="form-group">
            <label>
              <Lock /> Password
            </label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>

          <div className="form-group">
            <label>
              <Lock /> Confirm Password
            </label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
          </div>

          {/* Features */}
          <div className="features">
            <p>What you'll get:</p>
            <div>
              {['100 starter coins','AI-powered flow tracking','Personalized insights','Gamified learning'].map((feat, i) => (
                <div key={i}>
                  <CheckCircle /> {feat}
                </div>
              ))}
            </div>
          </div>

          <button className="signup-btn" onClick={handleSignup}>Create Account</button>

          <div className="login-link">
            Already have an account?{' '}
            <button onClick={() => setCurrentPage('login')}>Login</button>
          </div>

          <button className="back-home" onClick={() => setCurrentPage('home')}>
            <ArrowLeft /> Back to Home
          </button>
        </div>

        <p className="terms">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>

      {/* Inline CSS */}
      <style>{`
        .signup-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          background: #f5f5f5;
        }
        .signup-card {
          max-width: 400px;
          width: 100%;
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .signup-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .signup-icon {
          display: inline-block;
          padding: 1rem;
          background: linear-gradient(135deg, #7e5bef, #3b82f6);
          border-radius: 1rem;
          margin-bottom: 0.5rem;
          color: white;
        }
        .signup-header h1 {
          font-size: 2rem;
          margin-bottom: 0.25rem;
        }
        .signup-header p {
          color: #555;
        }
        .signup-form .form-group {
          margin-bottom: 1.5rem;
        }
        .signup-form label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #333;
        }
        .signup-form input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #ccc;
          border-radius: 0.75rem;
          outline: none;
          transition: border 0.3s;
        }
        .signup-form input:focus {
          border-color: #7e5bef;
        }
        .features {
          background: #f3e8ff;
          padding: 1rem;
          border-radius: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .features p {
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .features div > div {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #555;
          margin-bottom: 0.25rem;
        }
        .signup-btn {
          width: 100%;
          background: linear-gradient(90deg, #7e5bef, #3b82f6);
          color: white;
          padding: 0.75rem;
          border-radius: 0.75rem;
          font-weight: 700;
          font-size: 1.125rem;
          transition: transform 0.2s, box-shadow 0.2s;
          border: none;
          cursor: pointer;
        }
        .signup-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        .login-link {
          text-align: center;
          margin-top: 1rem;
        }
        .login-link button {
          color: #7e5bef;
          font-weight: 600;
          background: none;
          border: none;
          cursor: pointer;
        }
        .back-home {
          width: 100%;
          margin-top: 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: #555;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.2s;
        }
        .back-home:hover {
          color: #222;
        }
        .terms {
          text-align: center;
          font-size: 0.75rem;
          color: #aaa;
          margin-top: 1.5rem;
        }
      `}</style>
    </div>
  );
};

export default Signup;