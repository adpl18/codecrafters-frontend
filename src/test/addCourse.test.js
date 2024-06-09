import { render, fireEvent } from '@testing-library/react';
import { act } from 'react';
import AddCourse from '../pages/AddCourse';
import { BrowserRouter as Router } from 'react-router-dom';
import UserContext from '../auth/UserContext';
import { useNavigate } from 'react-router-dom';
import { createMemoryHistory } from 'history';

// Mock de fetch
// export const mockFetch = (data, status = 200, statusText = 'OK') => {
//   return jest.fn().mockImplementation(() =>
//     Promise.resolve({
//       ok: status >= 200 && status < 300,
//       status,
//       statusText,
//       json: () => Promise.resolve(data),
//     })
//   );
// };

// Mock del contexto
const mockUserValue = {
  userInfo: { /* aquí puedes colocar la información del usuario simulada */ },
  setUserInfo: jest.fn(),
  logout: jest.fn()
};

// Mock del hook useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    useNavigate: () => mockNavigate,
  };
});

describe('Test name from button save', () => {
  it('should render Guardar when the user is login', async () => {
    // window.fetch = mockFetch({ response: 'ok' });
    const { getByRole, findByRole, findAllByRole } = render(
      <Router>
        <UserContext.Provider value={
          mockUserValue
          // userInfo: {name: 'John Doe', email: 'john@gmail.com'}
          }>
          <AddCourse />
        </UserContext.Provider>
      </Router>
    );
    const button = await findByRole('button', {name: 'Guardar'});
    // fireEvent.click(button);
    // expect(fetch).toHaveBeenCalledWith('url_del_api', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ /* datos del curso */ }),
    // });
  })
  it('should render Iniciar sesión when the user is not login', async () => {
    const { getByRole, findByRole, findAllByRole } = render(
      <Router>
        <UserContext.Provider value={{...mockUserValue, userInfo: null}}>
          <AddCourse />
        </UserContext.Provider>
      </Router>
    );
    const button = await findByRole('button', {name: 'Iniciar sesión'});
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  })
});

// MOdal, verificar titulo correcto
// Verificar que los horarios ya tomados, no se puedan seleccionar
// Verificar que el horario seleccionado se muestre en el modal
// Verificar que el horario seleccionado se muestre en la lista de horarios
// Verificar que al guardar el curso, se haga un fetch a la API
// Verificar que al guardar el curso, se redirija a la página de inicio
// Verificar que al guardar el curso, se limpie el formulario
// Verificar que al guardar el curso, se muestre un mensaje de éxito
// Verificar que al guardar el curso, se muestre un mensaje de error
// Verificar que al guardar el curso, se muestre un spinner de carga
// Verificar que no se mande la API si el formulario no está completo
