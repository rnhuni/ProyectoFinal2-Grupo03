import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Spinner, Box } from "@chakra-ui/react";
import config from "../../cognito_config.json"; // Ajusta la ruta según la ubicación de tu archivo JSON

const LoginCognito = () => {
  debugger;
  const navigate = useNavigate();

  // Obtenemos las propiedades desde el archivo JSON
  const cognitoLoginUrl = `https://abcallg03.auth.us-east-1.amazoncognito.com/login?client_id=${
    config.cognito.clientId
  }&response_type=code&scope=email+openid+profile&redirect_uri=${encodeURIComponent(
    config.cognito.redirectUri
  )}`;
  const cognitoTokenUrl = config.cognito.url;
  const clientId = config.cognito.clientId;
  const redirectUri = config.cognito.redirectUri;
  const grantType = config.cognito.grantType;

  // Redirige automáticamente a Cognito cuando se monte el componente
  useEffect(() => {
    debugger;
    const query = new URLSearchParams(window.location.search);
    const authorizationCode = query.get("code");

    if (!authorizationCode) {
      // Si no hay un código de autorización, redirigir al login de Cognito
      window.location.href = cognitoLoginUrl;
    } else {
      // Si hay un código de autorización, intercambiarlo por los tokens
      fetchTokens(authorizationCode);
    }
  }, []);

  const fetchTokens = async (code: string) => {
    debugger;
    try {
      const response = await fetch(cognitoTokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: grantType,
          client_id: clientId,
          code: code,
          redirect_uri: redirectUri,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("id_token", data.id_token);
        navigate("/dashboard"); // Redirigir al dashboard tras el login exitoso
      } else {
        console.error("Failed to fetch tokens:", data);
      }
    } catch (error) {
      console.error("Error exchanging code for tokens:", error);
    }
  };

  return (
    <Box textAlign="center" mt={10}>
      {window.location.search.includes("code") ? (
        <Spinner size="xl" label="Processing login..." />
      ) : (
        <Spinner size="xl" label="Redirecting to Cognito..." />
      )}
    </Box>
  );
};

export default LoginCognito;
