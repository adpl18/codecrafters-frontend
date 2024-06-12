import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp, signIn, getUserInfo } from '../auth/authService';
import UserContext from '../auth/UserContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [family_name, setFamilyName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
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
      alert(`Sign in failed: ${error}`);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      await signUp(email, password, {
        name: name,
        family_name: family_name,
        birthdate: birthdate
      });
      navigate('/');
    } catch (error) {
      alert(`Sign up failed: ${error.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center">
      <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">Bienvenid@</h1>
        <h4 className="text-xl text-center text-gray-700 mb-6">
          {isSignUp ? 'Ingresa tus datos para Registrarte' : 'Ingresa tus datos para Iniciar Sesión'}
        </h4>
        <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-6">
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
          <div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full focus:outline-none focus:shadow-outline"
            >
              {isSignUp ? 'Registrarse' : 'Iniciar Sesión'}
            </button>
          </div>
        </form>
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full py-2 mt-4 text-center text-blue-500 hover:underline focus:outline-none"
        >
          {isSignUp ? '¿Ya tienes una cuenta? Inicia sesión' : '¿No tienes una cuenta? Regístrate aquí'}
        </button>
      </div>
    </div>
  );
}
