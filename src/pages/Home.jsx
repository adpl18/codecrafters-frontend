import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { get } from '../api/functions';
import { API } from '../api/endpoints';

const Home = () => {

  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    await get(API.GET_TEST())
  };

  return (
    <div>
      <p>This is the home page.</p>
      <p>
          Grupo codecrafters 2024-1 - Proyecto profesores 
        </p>
        <Link to="/profile">Go to Profile</Link>
    </div>
  );
};

export default Home;
