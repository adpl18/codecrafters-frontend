import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Profile from '../pages/Profile';
import Login from '../pages/Login';
import * as authService from '../auth/authService';
import * as apiFunctions from '../api/functions';
import { getUserInfo } from '../auth/authService';

jest.mock('../auth/authService');

const user = {
  birthdate: "1990-01-01T00:00:00.000Z",
  email: "john.doe@example.com",
  firstName: "John Updated",
  id: 1,
  lastName: "Doe"
}

const availabilities = [
  {
    id: 1,
    date: '2024-06-16', 
    startTime: '09:00:00', 
    endTime: '10:00:00', 
    isAvailable: true, 
    userId: 1,
    User:{
      birthdate: "1990-01-01T00:00:00.000Z",
      email: "john.doe@example.com",
      firstName: "John Updated",
      id: 1,
      lastName: "Doe"
    }
  }
]

const courses = [{
  id: 1,
  name: "JavaScript Fundamentals",
  price: 20999,
  description: "An introductory course on JavaScript programming.",
  category: "Programming",
  userId: 1,
  User: {
    id: 1,
    firstName: "John Updated",
    lastName: "Doe",
    email: "john.doe@example.com",
    birthdate: "1990-01-01T00:00:00.000Z",
  }
}];

const reservations = [
  {
    Availability: {id: 64, date: '2024-07-06', startTime: '09:00:00', endTime: '10:00:00', isAvailable: false},
    Course: {id: 15, name: 'Ajedrez Básico', price: 2000, description: 'Ajedrez muy entretenido', category: 'Otros'},
    User: {id: 33, firstName: 'asuncion', lastName: 'dominguez', email: 'asunciondp@gmail.com', birthdate: '1999-02-22T00:00:00.000Z'},
    availabilityId: 64,
    courseId: 15,
    id: 23,
    isCancelled: true,
    isReviewed: false,
    userId: 33
  }
]

const sessionStorage = (() => {
  let store = {};
  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      store = {};
    }
  };
})();

describe('Profile Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    Object.defineProperty(window, 'sessionStorage', {value: sessionStorage});
    jest.spyOn(apiFunctions, 'get').mockResolvedValue({ courses:courses, user: user, availabilities: availabilities, reservations: reservations});
    
  });

  it('renders profile component when user is authenticated', async () => {
    const userInfo = {
      id: 1,
      username: 'test',
      email: 'test@example.com',
      name: 'John',
      family_name: 'Doe',
      birthdate: '1990-01-01',
    };
    authService.getUserInfo.mockResolvedValueOnce(userInfo);

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

  });

  it('renders login component when user is not authenticated', async () => {
    authService.getUserInfo.mockRejectedValueOnce(new Error('User not authenticated'));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const loginButton = screen.getByRole('button', { name: /Iniciar Sesión/i });
    expect(loginButton).toBeInTheDocument();
  });

  it('renders user information after loading', async () => {
    sessionStorage.setItem('accessToken', 'mockedAccessToken');
    const userInfo = {
      birthdate: "1990-01-01T00:00:00.000Z",
      email: "john.doe@example.com",
      firstName: "John Updated",
      id: 1,
      lastName: "Doe"
    };
    authService.getUserInfo.mockResolvedValueOnce(userInfo);

    render(<Profile />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    });
  });

});
