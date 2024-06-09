// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signUp, forgotPassword, resetPassword, getUserInfo } from '../auth/authService';
import UserContext from '../auth/UserContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const { setUserInfo } = useContext(UserContext);
  const [code, setCode] = useState('');
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
      await signUp(email, password);
      navigate('/');
    } catch (error) {
      alert(`Sign up failed: ${error}`);
    }
  };

  
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      alert('A password reset link has been sent to your email.');
    } catch (error) {
      alert(`Failed to initiate password reset: ${error}`);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(email, code, password);
      alert('Password reset successful');
    } catch (error) {
      alert(`Failed to reset password: ${error}`);
    }
  }

  return (
    <div className="loginForm">
      <h1>Welcome</h1>
      <h4>{isSignUp ? 'Sign up to create an account' : 'Sign in to your account'}</h4>
      <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
        <div>
          <input
            className="inputText"
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
            className="inputText"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        <div>
          <input
            className="inputText"
            id="code"
            type="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Código"
          />
        </div>
        {isSignUp && (
          <div>
            <input
              className="inputText"
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
            />
          </div>
        )}
        <button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
      </form>
      <button onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
      </button>
      {!isSignUp && (
        <div>
          <button onClick={handleForgotPassword}>Forgot Password</button>
          <button onClick={handleResetPassword}>Reset Password</button>
        </div>
      )}
    </div>
  );
}
