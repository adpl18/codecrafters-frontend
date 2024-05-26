import { 
  CognitoIdentityProviderClient, 
  InitiateAuthCommand, 
  SignUpCommand, 
  ConfirmSignUpCommand, 
  ForgotPasswordCommand, 
  ConfirmForgotPasswordCommand,
  GetUserCommand
} from "@aws-sdk/client-cognito-identity-provider";
import config from "../config.json";

// test1234code

export const cognitoClient = new CognitoIdentityProviderClient({
  region: config.region,
});

export const signIn = async (username, password) => {
  const params = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: config.clientId,
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

export const signUp = async (email, password) => {
  const params = {
    ClientId: config.clientId,
    Username: email,
    Password: password,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
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
    ClientId: config.clientId,
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
    ClientId: config.clientId,
    Username: email,
  };

  try {
    const command = new ForgotPasswordCommand(params);
    await cognitoClient.send(command);
  } catch (error) {
    throw new Error(`Failed to initiate password reset: ${error.message}`);
  }
};

export const resetPassword = async (email, code, password) => {
  const params = {
    ClientId: config.clientId,
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

export const logout = () => {
  sessionStorage.removeItem('idToken');
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
};