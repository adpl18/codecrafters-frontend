import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../auth/UserContext';
import { updateUserAttributes, getUserInfo } from '../auth/authService';

export default function EditProfile() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const [name, setName] = useState(userInfo?.name || '');
  const [family_name, setFamilyName] = useState(userInfo?.family_name || '');
  const [birthdate, setBirthdate] = useState(userInfo?.birthdate || '');

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

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
      // Actualiza en AWS Cognito
      await updateUserAttributes(accessToken, attributes);
      
      // Llamada al backend para actualizar usuario
      const response = await fetch(`${process.env.BACKEND_URL}/users`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: name,
          lastName: family_name,
          birthdate,
        }),
      });
  
      if (response.ok) {
        const updatedUserInfo = await getUserInfo(accessToken);
        setUserInfo(updatedUserInfo);
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
