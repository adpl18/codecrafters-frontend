import React from 'react';
import { render, screen } from '@testing-library/react';
import Course from '../pages/Course';
import { BrowserRouter as Router } from 'react-router-dom'; // Asegúrate de importar BrowserRouter

jest.mock('../auth/authService');
jest.mock('../api/functions');

describe('Course component', () => {
  it('renders loading initially', async () => {
    render(
      <Router>
        <Course />
      </Router>
    );

    expect(screen.getByText('Cargando...')).toBeInTheDocument

  });
});


