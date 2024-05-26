import { useState, useEffect } from 'react';
import { getUserInfo } from './authService';

export const useAuth = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const accessToken = sessionStorage.getItem('accessToken');
      if (accessToken) {
        try {
          const userResponse = await getUserInfo(accessToken);
          console.log(userResponse)
          setUserInfo(userResponse);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      }
    };

    fetchUserInfo();
  }, []);
  
  return { userInfo, isAuthenticated };
};
