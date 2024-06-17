import { 
  CognitoIdentityProviderClient, 
  InitiateAuthCommand, 
  SignUpCommand, 
  ConfirmSignUpCommand, 
  ForgotPasswordCommand, 
  ConfirmForgotPasswordCommand,
  GetUserCommand,
  UpdateUserAttributesCommand,
  DeleteUserCommand
} from "@aws-sdk/client-cognito-identity-provider";

export const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.REACT_APP_REGION_AWS,
});

export const signIn = async (username, password) => {
  const params = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: process.env.REACT_APP_CLIENT_ID_AWS,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };
  try {
    const command = new InitiateAuthCommand(params);
    const { AuthenticationResult } = await cognitoClient.send(command);
    if (AuthenticationResult) {
      sessionStorage.setItem("idToken", AuthenticationResult.IdToken || '');
      sessionStorage.setItem("accessToken", AuthenticationResult.AccessToken || '');
      sessionStorage.setItem("refreshToken", AuthenticationResult.RefreshToken || '');
      return AuthenticationResult;
    }
  } catch (error) {
    console.error("Error signing in: ", error);
    throw error;
  }
};

export const signUp = async (email, password, birthdate, family_name, name) => {
  const params = {
    ClientId: "7q06v34k47fm0065k1d1mepre3",
    Username: email,
    Password: password,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
      {
        Name: "birthdate",
        Value: birthdate,
      },
      {
        Name: "family_name",
        Value: family_name,
      },
      {
        Name: "name",
        Value: name,
      },
    ],
  };
  try {
    const command = new SignUpCommand(params);
    const response = await cognitoClient.send(command);
    console.log("Sign up success: ", response);
    return response;
  } catch (error) {
    console.error("Error signing up: ", error);
    throw error;
  }
};

export const confirmSignUp = async (username, code) => {
  const params = {
    ClientId: "7q06v34k47fm0065k1d1mepre3",
    Username: username,
    ConfirmationCode: code,
  };
  try {
    const command = new ConfirmSignUpCommand(params);
    await cognitoClient.send(command);
    console.log("User confirmed successfully");
    return true;
  } catch (error) {
    console.error("Error confirming sign up: ", error);
    throw error;
  }
};

export const forgotPassword = async (email) => {
  const params = {
    ClientId: process.env.REACT_APP_CLIENT_ID_AWS,
    Username: email,
  };

  try {
    const command = new ForgotPasswordCommand(params);
    await cognitoClient.send(command);
    console.log("Password reset email sent successfully");
  } catch (error) {
    throw new Error(`Failed to initiate password reset: ${error.message}`);
  }
};

export const resetPassword = async (email, code, password) => {
  const params = {
    ClientId: "7q06v34k47fm0065k1d1mepre3",
    Username: email,
    ConfirmationCode: code,
    Password: password,
  };

  try {
    const command = new ConfirmForgotPasswordCommand(params);
    await cognitoClient.send(command);
  } catch (error) {
    throw new Error(`Failed to initiate password reset: ${error.message}`);
  }
};

export const getUserInfo = async (accessToken) => {
  const params = {
    AccessToken: accessToken,
  };

  try {
    const command = new GetUserCommand(params);
    const response = await cognitoClient.send(command);

    const userAttributes = {};
    response.UserAttributes.forEach(item => {
        userAttributes[item.Name] = item.Value;
    });
    return userAttributes;
  } catch (error) {
    console.error('Error getting user info:', error);
    throw error;
  }
};

export const updateUserAttributes = async (accessToken, attributes) => {
  const params = {
    AccessToken: accessToken,
    UserAttributes: attributes,
  };

  try {
    const command = new UpdateUserAttributesCommand(params);
    const response = await cognitoClient.send(command);
    console.log("User attributes updated successfully:", response);
    return response;
  } catch (error) {
    console.error("Error updating user attributes:", error);
    throw error;
  }
};

export const deleteUser = async (accessToken) => {
  const params = {
    AccessToken: accessToken,
  };
  try {
    const command = new DeleteUserCommand(params);
    await cognitoClient.send(command);
    console.log("User deleted successfully");
  } catch (error) {
    console.error("Error deleting user: ", error);
    throw error;
  }
};

export const logout = () => {
  sessionStorage.removeItem('idToken');
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
  localStorage.removeItem('token');
};
