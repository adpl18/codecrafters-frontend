import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import UserContext from "../auth/UserContext";

export default function Profile() {
  const { userInfo, setUserInfo, logout } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  const handleLogout = () => {
    logout();
    setUserInfo(null);
    navigate("/");
  };

  return (
    <div className="profile">
      <h1>User Profile</h1>
      <p>This is the users profile page.</p>
      
      {userInfo ? (
        <div>
          <p>Name: {userInfo.name}</p>
          <p>Email: {userInfo.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : null
    }
      <Link to="/">Go Home</Link>
    </div>
  );
}
