import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import UserContext from "./auth/UserContext"
import { getUserInfo } from './auth/authService';
import { logout } from './auth/authService';
import Footer from './layouts/Footer';
import Navbar from './layouts/Navbar';
import ProjectRoutes from './Routes';
import backgroundImage from './assets/images/bola-color.png'; 
import "./assets/css/App.css";

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const accessToken = sessionStorage.getItem('accessToken');
      if (accessToken) {
        try {
          const userResponse = await getUserInfo(accessToken);
          setUserInfo(userResponse);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, loading, setLoading, setUserInfo, logout }}>
      {
      <div className="App flex flex-col min-h-screen" style={{ 
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
      }}>
        <Router>
          <Navbar />
          <div className="flex-grow">
            <ProjectRoutes />
          </div>
          <Footer />
        </Router>
      </div>
      }
    </UserContext.Provider>
  );
}

export default App;
