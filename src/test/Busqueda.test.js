import React from 'react';
import { render, fireEvent, waitFor, act, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Busqueda from '../pages/Busqueda';
import * as apiFunctions from '../api/functions';

const mockCourses = [
  {
    id: 1,
    name: 'Python',
    category: 'Programming',
    price: 10000,
  },
  {
    id: 2,
    name: 'Java',
    category: 'Programming',
    price: 15000,
  },
];

describe('Busqueda Component', () => {
  beforeEach(() => {
    jest.spyOn(apiFunctions, 'get').mockResolvedValue({ courses: mockCourses });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('it should render correctly all the courses', async () => {
    let getByText, getByPlaceholderText;
    
    await act(async () => {
      const renderResult = render(
        <MemoryRouter>
          <Busqueda />
        </MemoryRouter>
      );

      getByText = renderResult.getByText;
      getByPlaceholderText = renderResult.getByPlaceholderText;
    });

    expect(apiFunctions.get).toHaveBeenCalled();
    // console.log(apiFunctions.get.mock.calls);

    await waitFor(() => {
      expect(getByText('Python')).toBeInTheDocument();
      expect(getByText('Java')).toBeInTheDocument();
    });
  });

  it('it should renders search results correctly', async () => {
    let getByText, getByPlaceholderText;
    
    await act(async () => {
      const renderResult = render(
        <MemoryRouter>
          <Busqueda />
        </MemoryRouter>
      );

      getByText = renderResult.getByText;
      getByPlaceholderText = renderResult.getByPlaceholderText;
    });

    expect(apiFunctions.get).toHaveBeenCalled();

    await act(async () => {
      fireEvent.change(getByPlaceholderText('Ingresar...'), {
        target: { value: 'java' },
      });
      fireEvent.click(getByText('Buscar'));
    });

    await waitFor(() => {
      expect(getByText('Java')).toBeInTheDocument();
      expect(screen.queryByText('Python')).not.toBeInTheDocument();
    });
  });
});