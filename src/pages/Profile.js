import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from "../auth/UserContext";
import { deleteUser } from '../auth/authService';

export default function Profile() {
  const { userInfo, setUserInfo, logout } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      console.log("hola")
      navigate("/login");
    }
  }, [userInfo, navigate]);

  const handleLogout = () => {
    logout();
    setUserInfo(null);
    navigate("/");
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.");
    if (confirmation) {
      try {
        const accessToken = sessionStorage.getItem('accessToken');
        
        await deleteUser(accessToken);
        
        const response = await fetch(`${process.env.BACKEND_URL}/users/${userInfo.id}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          logout();
          setUserInfo(null);
          navigate("/");
        } else {
          throw new Error('Failed to delete user on backend');
        }
      } catch (error) {
        alert(`Error al eliminar la cuenta: ${error.message}`);
      }
    }
  };

  return (userInfo &&
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center">
      <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">{userInfo.name} {userInfo.family_name}</h1>
        <div className="text-center">
          {userInfo ? (
            <div className="space-y-4">
              <p><span className="font-bold">Email:</span> {userInfo.email}</p>
              <p><span className="font-bold">Día de Nacimiento:</span> {userInfo.birthdate}</p>
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
          ) : null}
        </div>
      </div>
    </div>
  );
}
