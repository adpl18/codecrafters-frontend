import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { updateUserAttributes, getUserInfo } from '../auth/authService';
import { put } from '../api/functions';
import API from '../api/endpoints';

export default function EditProfile() {
  // const [userInfo, setUserInfo] = useState({});
  const [name, setName] = useState('');
  const [family_name, setFamilyName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  useEffect(() => {
    fetchUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserInfo = async () => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      try {
        const userResponse = await getUserInfo(accessToken);
        // setUserInfo(userResponse);
        setName(userResponse.name || '');
        setFamilyName(userResponse.family_name || '');
        setBirthdate(userResponse.birthdate || '');
      } catch (error) {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('No access token found');
      return;
    }
  
    const attributes = [
      { Name: 'name', Value: name },
      { Name: 'family_name', Value: family_name },
      { Name: 'birthdate', Value: birthdate },
    ];
  
    try {
      // throw error if birthdate is of a under 18 years old
      if ( new Date().getFullYear() - new Date(birthdate).getFullYear() < 18) {
        alert('Debes ser mayor de edad');
        return;
      }
      
      // Actualiza en AWS Cognito
      await updateUserAttributes(accessToken, attributes);
      
      // Llamada al backend para actualizar usuario
      const response = await put(API.PUT_USER(userId), {
        firstName: name,
        lastName: family_name,
        birthdate,
      })
  
      if (response.ok) {
        // const updatedUserInfo = await getUserInfo(accessToken);
        // setUserInfo(updatedUserInfo);
        navigate('/profile');
      } else {
        throw new Error('Failed to update user on backend');
      }
    } catch (error) {
      alert(`Failed to update profile: ${error.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center">
      <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">Editar Perfil</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre"
              required
            />
          </div>
          <div>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
              id="familyName"
              type="text"
              value={family_name}
              onChange={(e) => setFamilyName(e.target.value)}
              placeholder="Apellido"
              required
            />
          </div>
          <div>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
              id="birthdate"
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              placeholder="Día de Nacimiento"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full focus:outline-none focus:shadow-outline"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}