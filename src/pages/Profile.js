import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from "../auth/UserContext";
import { deleteUser } from '../auth/authService';

export default function Profile() {
  const { userInfo, setUserInfo, logout } = useContext(UserContext);
  const [backendUserInfo, setBackendUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userFetched, setUserFetched] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      console.log(userInfo);
      fetch(`${process.env.REACT_APP_BACKEND_URL}/users/email/${userInfo.email}`)
        .then(response => response.json())
        .then(data => {
          setBackendUserInfo(data.user);
          setLoading(false);
          setUserFetched(true);
        })
        .catch(error => {
          console.error('Error fetching user from backend:', error);
          setLoading(false);
          setUserFetched(true);
        });
    } else {
      setLoading(false);
      setUserFetched(true);
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    if (userFetched && !userInfo) {
      navigate("/login");
    }
  }, [userFetched, userInfo, navigate]);

  const handleLogout = () => {
    logout();
    setUserInfo(null);
    navigate("/");
  };

  const handleEditProfile = () => {
    navigate("/edit-profile", { state: { userId: backendUserInfo?.id } });
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.");
    if (confirmation) {
      try {
        const accessToken = sessionStorage.getItem('accessToken');
        
        await deleteUser(accessToken);
        
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${backendUserInfo?.id}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          logout();
          setUserInfo(null);
          navigate("/");
          console.log("USUARIO ELIMINADO CORRECTAMENTE EN EL BACKEND")
        } else {
          throw new Error('Failed to delete user on backend');
        }
      } catch (error) {
        alert(`Error al eliminar la cuenta: ${error.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cover bg-center">
        <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center">
      <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">{userInfo.name} {userInfo.family_name}</h1>
        <div className="text-center">
            <div className="space-y-4">
              <p><span className="font-bold">Email:</span> {userInfo.email}</p>
              <p><span className="font-bold">Día de Nacimiento:</span> {new Date(userInfo.birthdate).toLocaleDateString()}</p>
              <button
                onClick={handleEditProfile}
                className="w-full py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full focus:outline-none focus:shadow-outline mb-4"
              >
                Editar Usuario
              </button>
              <button
                onClick={handleLogout}
                className="w-full py-2 bg-red-500 hover:bg-red-700 text-white font-bold rounded-full focus:outline-none focus:shadow-outline"
              >
                Cerrar Sesión
              </button>
              <button
                onClick={handleDeleteAccount}
                className="w-full py-2 bg-gray-500 hover:bg-gray-700 text-white font-bold rounded-full focus:outline-none focus:shadow-outline mt-4"
              >
                Eliminar Cuenta
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}
