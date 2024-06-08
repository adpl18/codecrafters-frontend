import { 
  CognitoIdentityProviderClient, 
  InitiateAuthCommand, 
  SignUpCommand, 
  ConfirmSignUpCommand, 
  ForgotPasswordCommand, 
  ConfirmForgotPasswordCommand,
  GetUserCommand
} from "@aws-sdk/client-cognito-identity-provider";

// test1234code

export const cognitoClient = new CognitoIdentityProviderClient({
  region: "us-east-1",
  // region: process.env.REACT_APP_REGION_AWS,
});

export const signIn = async (username, password) => {
  const params = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: "7q06v34k47fm0065k1d1mepre3",
    // ClientId: "7q06v34k47fm0065k1d1mepre3",
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
    ClientId: "7q06v34k47fm0065k1d1mepre3",
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
    ClientId: "7q06v34k47fm0065k1d1mepre3",
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

export const logout = () => {
  sessionStorage.removeItem('idToken');
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
};