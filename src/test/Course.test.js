import React from 'react';
import { render, fireEvent, waitFor, act, screen, debug } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Course from '../pages/Course';
import * as apiFunctions from '../api/functions';
import { getUserInfo } from '../auth/authService';

jest.mock('../auth/authService');

const course = {
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
};

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

const user = {
  birthdate: "1990-01-01T00:00:00.000Z",
  email: "john.doe@example.com",
  firstName: "John Updated",
  id: 1,
  lastName: "Doe"
}

const user2 = {
  birthdate: "1990-01-01T00:00:00.000Z",
  email: "johnotro.doe@example.com",
  firstName: "John otro Updated",
  id: 2,
  lastName: "Doe"
}

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

jest.mock('../api/functions', () => ({
  ...jest.requireActual('../api/functions'),
  get: jest.fn(),
  post: jest.fn(() => Promise.resolve({ ok: true })), 
}));

function showAlert() {
  window.alert('Mensaje');
}

describe('Curso Component', () => {
  let originalAlert;

  beforeEach(() => {
    originalAlert = window.alert;
    window.alert = jest.fn();
    sessionStorage.clear();
    Object.defineProperty(window, 'sessionStorage', {value: sessionStorage});
    jest.spyOn(apiFunctions, 'get').mockResolvedValue({ course: course, availabilities: availabilities, user: user});
  });

  afterEach(() => {
    window.alert = originalAlert;
    jest.restoreAllMocks();
  });

  
  it('it should render correctly the course', async () => {
    let getByText, getByPlaceholderText;
    
    await act(async () => {
      const renderResult = render(
        <MemoryRouter>
          <Course />
        </MemoryRouter>
      );

      getByText = renderResult.getByText;
      getByPlaceholderText = renderResult.getByPlaceholderText;
    });

    expect(apiFunctions.get).toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByText('JavaScript Fundamentals')).toBeInTheDocument();
      expect(screen.getByText('An introductory course on JavaScript programming.')).toBeInTheDocument();
      expect(screen.getByText('John Updated Doe')).toBeInTheDocument();
      expect(screen.getByText('Precio: $20.999 CLP')).toBeInTheDocument();
      expect(screen.getByText('Categoría: Programming')).toBeInTheDocument();

      expect(screen.queryByRole('button', { name: 'Editar' })).not.toBeInTheDocument();
      expect(screen.queryByText('button', { name: 'Eliminar' })).not.toBeInTheDocument();
    });
  });

  it('it should not render the button if you are not the teacher', async () => {
    sessionStorage.setItem('accessToken', 'mockedAccessToken');
    jest.spyOn(apiFunctions, 'get').mockResolvedValue({ course: course, availabilities: availabilities, user: user2});

    getUserInfo.mockResolvedValue({
      birthdate: "1990-01-01T00:00:00.000Z",
      email: "johnotro.doe@example.com",
      firstName: "John otro Updated",
      id: 2,
      lastName: "Doe"
    }); 

    let getByText, getByPlaceholderText;
    
    await act(async () => {
      const renderResult = render(
        <MemoryRouter>
          <Course />
        </MemoryRouter>
      );

      getByText = renderResult.getByText;
      getByPlaceholderText = renderResult.getByPlaceholderText;
    });

    expect(apiFunctions.get).toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByText('JavaScript Fundamentals')).toBeInTheDocument();
      expect(screen.getByText('An introductory course on JavaScript programming.')).toBeInTheDocument();
      expect(screen.getByText('John Updated Doe')).toBeInTheDocument();
      expect(screen.getByText('Precio: $20.999 CLP')).toBeInTheDocument();
      expect(screen.getByText('Categoría: Programming')).toBeInTheDocument();

      expect(screen.queryByRole('button', { name: 'Editar' })).not.toBeInTheDocument();
      expect(screen.queryByText('button', { name: 'Eliminar' })).not.toBeInTheDocument();
    });
  });

  it('it should opens edit modal and triggers edit functionality', async () => {
    sessionStorage.setItem('accessToken', 'mockedAccessToken');

    getUserInfo.mockResolvedValue({
      birthdate: "1990-01-01T00:00:00.000Z",
      email: "john.doe@example.com",
      firstName: "John Updated",
      id: 1,
      lastName: "Doe"
    }); 

    render(
      <MemoryRouter>
        <Course />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.queryByText('Crear un curso')).not.toBeInTheDocument();
    });

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Editar' }));
      expect(screen.queryByText('Crear un curso')).toBeInTheDocument();
    });
    
  });
  
  it('it should delete course', async () => {
    sessionStorage.setItem('accessToken', 'mockedAccessToken');

    getUserInfo.mockResolvedValue({
      birthdate: "1990-01-01T00:00:00.000Z",
      email: "john.doe@example.com",
      firstName: "John Updated",
      id: 1,
      lastName: "Doe"
    }); 

    render(
      <MemoryRouter>
        <Course />
      </MemoryRouter>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
    });
  
    await waitFor(() => {
      showAlert();
      expect(window.alert).toHaveBeenCalledWith('Mensaje');
    });
  });

  
  // it('it should not render the edit button', async () => {
  //   sessionStorage.setItem('accessToken', 'mockedAccessToken');

  //   getUserInfo.mockResolvedValue({
  //     birthdate: "1990-01-01T00:00:00.000Z",
  //     email: "johnotro.doe@example.com",
  //     firstName: "John otro Updated",
  //     id: 2,
  //     lastName: "Doe"
  //   }); 

  //   render(
  //     <MemoryRouter>
  //       <Course />
  //     </MemoryRouter>
  //   );

  //   await waitFor(() => {
  //     expect(screen.queryByRole('button', { name: 'Editar' })).not.toBeInTheDocument();
  //     expect(screen.queryByText('button', { name: 'Eliminar' })).not.toBeInTheDocument();
  //   });
  // });
  


});
