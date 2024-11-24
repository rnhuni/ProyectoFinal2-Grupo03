import AWS from 'aws-sdk';

// Configurar AWS
AWS.config.region = 'us-east-1';
const cognito = new AWS.CognitoIdentityServiceProvider();

// Tipos para el resultado de autenticación
interface AuthResult {
  AccessToken: string;
  IdToken: string;
  RefreshToken: string;
  ExpiresIn: number;
  TokenType: string;
}

// Función de inicio de sesión
export const loginUser = async (
  username: string,
  password: string,
): Promise<AuthResult> => {
  const params = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: '7evjfjtvscn0qsok8la2kf1ja',
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };

  try {
    const response = await cognito.initiateAuth(params).promise();
    return response.AuthenticationResult as AuthResult;
  } catch (error) {
    // console.error('Error en login:', error);
    throw error;
  }
};
