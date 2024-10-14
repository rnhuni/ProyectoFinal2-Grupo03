import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  InputGroup,
  InputRightElement,
  Checkbox,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const schema = z.object({
  usuario: z
    .string()
    .min(3, { message: "El usuario debe tener al menos 3 caracteres." }),
  contraseña: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
});

type FormData = z.infer<typeof schema>;

const SignInForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (data: FormData) => {
    console.log(data);
    navigate("/dashboard"); // Redirige al dashboard después del inicio de sesión
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Bienvenido a ABCALL</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            Ingrese su usuario y contraseña para continuar
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl id="usuario" isInvalid={!!errors.usuario}>
                <FormLabel>Usuario</FormLabel>
                <Input
                  type="text"
                  {...register("usuario")}
                  placeholder="Ingrese su usuario"
                />
                {errors.usuario && (
                  <Text color="red.500" fontSize="sm">
                    {errors.usuario.message}
                  </Text>
                )}
              </FormControl>

              <FormControl id="contraseña" isInvalid={!!errors.contraseña}>
                <FormLabel>Contraseña</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...register("contraseña")}
                    placeholder="Ingrese su contraseña"
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {errors.contraseña && (
                  <Text color="red.500" fontSize="sm">
                    {errors.contraseña.message}
                  </Text>
                )}
              </FormControl>

              <Stack spacing={10}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  <Checkbox>Recuérdame</Checkbox>
                  <Link color={"blue.400"}>Olvidó su contraseña</Link>
                </Stack>
                <Button
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  type="submit"
                  isDisabled={!isValid}
                >
                  Iniciar Sesión
                </Button>
              </Stack>
            </Stack>
          </form>
          <Stack pt={6}>
            <Text align={"center"}>
              ¿No tienes una cuenta?{" "}
              <Link as={RouterLink} to="/signup" color="blue.400">
                Regístrate
              </Link>
            </Text>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default SignInForm;
