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
  Select,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link as RouterLink } from "react-router-dom";

const schema = z
  .object({
    nombre: z.string().min(1, { message: "El nombre es obligatorio" }).max(50),
    apellido: z
      .string()
      .min(1, { message: "El apellido es obligatorio" })
      .max(50),
    correo: z
      .string()
      .email({ message: "Correo electrónico inválido" })
      .max(200),
    pais: z.string().min(1, { message: "Selecciona un país" }),
    ciudad: z.string().min(1, { message: "Selecciona una ciudad" }),
    telefono: z
      .string()
      .min(10, { message: "Número de teléfono inválido" })
      .max(20),
    contraseña: z
      .string()
      .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
    confirmarContraseña: z.string(),
  })
  .refine((data) => data.contraseña === data.confirmarContraseña, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarContraseña"],
  });

type FormData = z.infer<typeof schema>;

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    console.log(data);
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
          <Heading fontSize={"3xl"}>Vamos a empezar</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            Completa la información para registrarte
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
              <Stack direction={["column", "row"]} spacing={6}>
                <FormControl isInvalid={!!errors.nombre}>
                  <FormLabel>Nombre</FormLabel>
                  <Input
                    type="text"
                    {...register("nombre")}
                    placeholder="Ingrese su nombre"
                  />
                  {errors.nombre && (
                    <Text color="red.500" fontSize="sm">
                      {errors.nombre.message}
                    </Text>
                  )}
                </FormControl>
                <FormControl isInvalid={!!errors.apellido}>
                  <FormLabel>Apellido</FormLabel>
                  <Input
                    type="text"
                    {...register("apellido")}
                    placeholder="Ingrese su apellido"
                  />
                  {errors.apellido && (
                    <Text color="red.500" fontSize="sm">
                      {errors.apellido.message}
                    </Text>
                  )}
                </FormControl>
              </Stack>

              <FormControl isInvalid={!!errors.correo}>
                <FormLabel>Correo electrónico</FormLabel>
                <Input
                  type="email"
                  {...register("correo")}
                  placeholder="Ingrese su correo electrónico"
                />
                {errors.correo && (
                  <Text color="red.500" fontSize="sm">
                    {errors.correo.message}
                  </Text>
                )}
              </FormControl>

              <Stack direction={["column", "row"]} spacing={6}>
                <FormControl isInvalid={!!errors.pais}>
                  <FormLabel>País</FormLabel>
                  <Select
                    {...register("pais")}
                    placeholder="Selecciona un país"
                  >
                    <option value="Colombia">Colombia</option>
                    <option value="México">México</option>
                    <option value="Argentina">Argentina</option>
                  </Select>
                  {errors.pais && (
                    <Text color="red.500" fontSize="sm">
                      {errors.pais.message}
                    </Text>
                  )}
                </FormControl>
                <FormControl isInvalid={!!errors.ciudad}>
                  <FormLabel>Ciudad</FormLabel>
                  <Select
                    {...register("ciudad")}
                    placeholder="Selecciona una ciudad"
                  >
                    <option value="Bogotá">Bogotá</option>
                    <option value="Medellín">Medellín</option>
                    <option value="Cali">Cali</option>
                  </Select>
                  {errors.ciudad && (
                    <Text color="red.500" fontSize="sm">
                      {errors.ciudad.message}
                    </Text>
                  )}
                </FormControl>
              </Stack>

              <FormControl isInvalid={!!errors.telefono}>
                <FormLabel>Número de teléfono</FormLabel>
                <Input
                  type="tel"
                  {...register("telefono")}
                  placeholder="Ingrese su número de teléfono"
                />
                {errors.telefono && (
                  <Text color="red.500" fontSize="sm">
                    {errors.telefono.message}
                  </Text>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.contraseña}>
                <FormLabel>Contraseña</FormLabel>
                <Input
                  type="password"
                  {...register("contraseña")}
                  placeholder="Ingrese una contraseña"
                />
                {errors.contraseña && (
                  <Text color="red.500" fontSize="sm">
                    {errors.contraseña.message}
                  </Text>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.confirmarContraseña}>
                <FormLabel>Confirmar Contraseña</FormLabel>
                <Input
                  type="password"
                  {...register("confirmarContraseña")}
                  placeholder="Repite la contraseña"
                />
                {errors.confirmarContraseña && (
                  <Text color="red.500" fontSize="sm">
                    {errors.confirmarContraseña.message}
                  </Text>
                )}
              </FormControl>

              <Stack pt={4}>
                <Button
                  type="submit"
                  isDisabled={!isValid}
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  Empezar
                </Button>
              </Stack>

              <Stack pt={6}>
                <Text align={"center"}>
                  ¿Ya tienes una cuenta?{" "}
                  <Link as={RouterLink} to="/signin" color="blue.400">
                    Inicia sesión
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default SignUpForm;
