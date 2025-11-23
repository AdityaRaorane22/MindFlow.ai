import React, { useState } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Features from './pages/Features';
import LearnFocus from './pages/LearnFocus';
import FocusMode from './pages/FocusMode';
import Contact from './pages/Contact';
import Navbar from './components/Navbar';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    flowScore: 0,
    coins: 0,
    level: 1,
    streak: 0,
    totalTime: 0
  });

  const renderPage = () => {
    // Redirect to login if not logged in and trying to access protected pages
    if (!isLoggedIn && ['dashboard', 'profile', 'focus', 'learn'].includes(currentPage)) {
      return <Login setIsLoggedIn={setIsLoggedIn} setCurrentPage={setCurrentPage} setUserData={setUserData} />;
    }

    switch(currentPage) {
      case 'home':
        return <Home setCurrentPage={setCurrentPage} isLoggedIn={isLoggedIn} />;
      case 'login':
        return <Login setIsLoggedIn={setIsLoggedIn} setCurrentPage={setCurrentPage} setUserData={setUserData} />;
      case 'signup':
        return <Signup setIsLoggedIn={setIsLoggedIn} setCurrentPage={setCurrentPage} setUserData={setUserData} />;
      case 'dashboard':
        return <Dashboard userData={userData} setUserData={setUserData} setCurrentPage={setCurrentPage} />;
      case 'profile':
        return <Profile userData={userData} setUserData={setUserData} setIsLoggedIn={setIsLoggedIn} setCurrentPage={setCurrentPage} />;
      case 'features':
        return <Features setCurrentPage={setCurrentPage} isLoggedIn={isLoggedIn} />;
      case 'learn':
        return <LearnFocus setCurrentPage={setCurrentPage} />;
      case 'focus':
        return <FocusMode userData={userData} setUserData={setUserData} setCurrentPage={setCurrentPage} />;
      case 'contact':
        return <Contact setCurrentPage={setCurrentPage} isLoggedIn={isLoggedIn} />;
      default:
        return <Home setCurrentPage={setCurrentPage} isLoggedIn={isLoggedIn} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {isLoggedIn && (
        <Navbar 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          userData={userData} 
        />
      )}
      {renderPage()}
    </div>
  );
}

export default App;