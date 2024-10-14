import {
  Box,
  Text,
  Heading,
  FormLabel,
  Input,
  FormControl,
  InputGroup,
  InputRightElement,
  IconButton,
  Select,
  Divider,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const FormUM = () => {
  const [showPassword, setShowPassword] = useState(false);
  const sidebg = useColorModeValue("#0056f0", "gray.800");

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box>
    <Box padding="3% 0 0 10%">
      <Box w={"100%"}>
        <Heading as="h5" size="md" textAlign="left">
          Crear Nuevo Usuario
        </Heading>
      </Box>
      <Box paddingTop="3.5%">
        <Text fontSize="sm">
          Complete el siguiente formulario con la información requerida.
        </Text>
      </Box>
      <Box paddingTop="2%">
        <FormControl isRequired>
          <FormLabel fontSize="sm">Nombre</FormLabel>
          <Input placeholder="Name" w="68%" />

          <FormLabel paddingTop="2%" fontSize="sm">
            Correo electrónico
          </FormLabel>
          <Input placeholder="Correo electrónico" w="68%" />

          <FormLabel fontSize="sm" paddingTop="2%">
            Contraseña
          </FormLabel>
          <InputGroup w="68%">
            <Input
              placeholder="******"
              type={showPassword ? "text" : "password"}
              pr="4.5rem"
              sx={{
                "&::-ms-reveal, &::-ms-clear": {
                  display: "none",
                },
                "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button": {
                  display: "none",
                },
              }}
            />
            {/* Aquí se coloca el icono dentro del input */}
            <InputRightElement>
              <IconButton
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                onClick={handleTogglePassword}
                variant="ghost"
              />
            </InputRightElement>
          </InputGroup>
          <FormLabel fontSize="sm" paddingTop="2%">
            Confirmación de contraseña
          </FormLabel>
          <InputGroup w="68%">
            <Input
              placeholder="******"
              type={showPassword ? "text" : "password"}
              pr="4.5rem"
              sx={{
                "&::-ms-reveal, &::-ms-clear": {
                  display: "none",
                },
                "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button": {
                  display: "none",
                },
              }}
            />
            {/* Aquí se coloca el icono dentro del input */}
            <InputRightElement>
              <IconButton
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                onClick={handleTogglePassword}
                variant="ghost"
              />
            </InputRightElement>
          </InputGroup>
          <FormLabel fontSize="sm" paddingTop="2%" >Rol</FormLabel>
          <Select placeholder="Select option" w="68%">
            <option>X</option>
            <option>Y</option>
          </Select>
        </FormControl>
        
      </Box>
    </Box>
    <Divider paddingTop="2.5%" w="79.7%">

    </Divider>
    <Box paddingTop="2%" w="76%" display="flex" justifyContent="flex-end">
        <Button  marginRight="4" w="12%">Cancelar</Button>
        <Button bg={sidebg} w="12%" color={"white"}>Crear</Button>
      </Box>

    </Box>
  );
};

export default FormUM;
