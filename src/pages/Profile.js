import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { logout } from '../auth/authService';
import { useNavigate } from 'react-router-dom';
import Login from '../layouts/Login';

const Profile = () => {
  const { userInfo, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="profile">
      <h1>User Profile</h1>
      <p>This is the users profile page.</p>
      
      {isAuthenticated && userInfo ? (
        <div>
          <p>Name: {userInfo.name}</p>
          <p>Email: {userInfo.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) 
      : (
        <div>
          <p>User is not authenticated.</p>
          <Login />
        </div>
      )
    }
      <Link to="/">Go Home</Link>
    </div>
  );
};

export default Profile;