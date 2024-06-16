import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// import { signUp, signIn, confirmSignUp, getUserInfo, forgotPassword } from '../auth/authService';
import { signUp, signIn, confirmSignUp, getUserInfo } from '../auth/authService';
import UserContext from '../auth/UserContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [family_name, setFamilyName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const { setUserInfo } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const session = await signIn(email, password);
      console.log('Sign in successful', session);
      if (session && typeof session.AccessToken !== 'undefined') {
        sessionStorage.setItem('accessToken', session.AccessToken);
        if (sessionStorage.getItem('accessToken')) {
          try {
            const userResponse = await getUserInfo(session.AccessToken);
            setUserInfo(userResponse);
          } catch (error) {
            console.error('Error fetching user info:', error);
            setUserInfo(false);
          }
          navigate('/');
        } else {
          console.error('Session token was not set properly.');
        }
      } else {
        console.error('SignIn session or AccessToken is undefined.');
      }
    } catch (error) {
      if (error.name === 'UserNotConfirmedException') {
        setIsConfirming(true);
      } else {
        alert(`Sign in failed: ${error}`);
      }
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      // Registro en AWS Cognito
      await signUp(email, password, birthdate, family_name, name);
      
      // Llamada al backend para crear el usuario
      const response = await fetch(`${process.env.BACKEND_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: name,
          lastName: family_name,
          email,
          birthdate,
        }),
      });
  
      if (response.ok) {
        setIsConfirming(true);
      } else {
        throw new Error('Failed to create user on backend');
      }
    } catch (error) {
      alert(`Sign up failed: ${error.message}`);
    }
  };

  const handleConfirmSignUp = async (e) => {
    e.preventDefault();
    try {
      await confirmSignUp(email, confirmationCode);
      alert('Bienvenido a CodeCrafters');
      setIsConfirming(false);
      setIsSignUp(false);
    } catch (error) {
      alert(`Confirmation failed: ${error.message}`);
    }
  };

  // const handleForgotPassword = async () => {
  //   try {
  //     await forgotPassword(email); // Call the forgotPassword function with the user's email
  //     alert('Se envió un correo electrónico con instrucciones para restablecer tu contraseña.');
  //     setIsConfirming(true);
  //   } catch (error) {
  //     console.error('Error requesting password reset:', error);
  //     alert(`Error al solicitar restablecimiento de contraseña: ${error.message}`);
  //   }
  // };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center">
      <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">Bienvenid@</h1>
        <h4 className="text-xl text-center text-gray-700 mb-6">
          {isConfirming 
            ? 'Se envió un código a tu email, introdúcelo' 
            : (isSignUp ? 'Ingresa tus datos para Registrarte' : 'Ingresa tus datos para Iniciar Sesión')}
        </h4>
        <form onSubmit={isConfirming ? handleConfirmSignUp : (isSignUp ? handleSignUp : handleSignIn)} className="space-y-6">
          {isConfirming ? (
            <div>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                id="confirmationCode"
                type="text"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                placeholder="Código de Confirmación"
                required
              />
            </div>
          ) : (
            <>
              <div>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                />
              </div>
              <div>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  required
                />
              </div>
              {isSignUp && (
                <>
                  <div>
                    <input
                      className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirma tu contraseña"
                      required
                    />
                  </div>
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
                      placeholder="Dia de nacimiento"
                      required
                    />
                  </div>
                </>
              )}
            </>
          )}
          <div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full focus:outline-none focus:shadow-outline"
            >
              {isConfirming ? 'Confirmar' : (isSignUp ? 'Registrarse' : 'Iniciar Sesión')}
            </button>
          </div>
        </form>
        {!isConfirming && (
          <>
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full py-2 mt-4 text-center text-blue-500 hover:underline focus:outline-none"
            >
              {isSignUp ? '¿Ya tienes una cuenta? Inicia sesión' : '¿No tienes una cuenta? Regístrate aquí'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
