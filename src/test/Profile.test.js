import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Profile from '../pages/Profile';
import Login from '../pages/Login';

jest.mock('../auth/authService');
import * as authService from '../auth/authService';
import { getUserInfo } from '../auth/authService';

// jest.mock('@aws-sdk/client-cognito-identity-provider');

// describe('getUserInfo function', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('fetches user info correctly', async () => {
//     const accessToken = 'mocked-access-token';
//     const mockUserAttributes = [
//       { Name: 'sub', Value: 'mocked-sub' },
//       { Name: 'email', Value: 'test@example.com' },
//       { Name: 'name', Value: 'John' },
//       { Name: 'family_name', Value: 'Doe' },
//       { Name: 'birthdate', Value: '1990-01-01' },
//     ];

//     const mockSend = jest.fn().mockResolvedValue({ UserAttributes: mockUserAttributes });
//     mocked(CognitoIdentityProviderClient).mockImplementation(() => ({
//       send: mockSend,
//     }));

//     const userInfo = await getUserInfo(accessToken);

//     expect(userInfo).toEqual({
//       sub: 'mocked-sub',
//       email: 'test@example.com',
//       name: 'John',
//       family_name: 'Doe',
//       birthdate: '1990-01-01',
//     });

//     expect(mockSend).toHaveBeenCalledWith(expect.any(GetUserCommand));
//     const commandParams = mockSend.mock.calls[0][0];
//     expect(commandParams).toEqual({
//       AccessToken: accessToken,
//     });
//   });

//   it('throws error when getUserInfo fails', async () => {
//     const accessToken = 'invalid-access-token';

//     const mockSend = jest.fn().mockRejectedValue(new Error('User not authenticated'));
//     mocked(CognitoIdentityProviderClient).mockImplementation(() => ({
//       send: mockSend,
//     }));

//     await expect(getUserInfo(accessToken)).rejects.toThrow('User not authenticated');

//     expect(mockSend).toHaveBeenCalledWith(expect.any(GetUserCommand));
//     const commandParams = mockSend.mock.calls[0][0];
//     expect(commandParams).toEqual({
//       AccessToken: accessToken,
//     });
//   });
// });

describe('Profile Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
});

