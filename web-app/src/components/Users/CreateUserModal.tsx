import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Esquema de validación usando Zod
const schema = z
  .object({
    name: z
      .string()
      .min(3, { message: "El nombre debe tener al menos 3 caracteres." }),
    email: z.string().email({ message: "Debe ser un correo válido." }),
    password: z
      .string()
      .min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
    confirmPassword: z
      .string()
      .min(6, { message: "La confirmación de contraseña es requerida." }),
    role: z.string().nonempty({ message: "El rol es requerido." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Datos enviados:", data);
    onClose(); // Cierra el modal después de guardar
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Crear Nuevo Usuario</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <Text>
                Complete el siguiente formulario con la información requerida.
              </Text>

              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Nombre</FormLabel>
                <Input placeholder="Nombre" {...register("name")} />
                {errors.name && (
                  <Text color="red.500">{errors.name.message}</Text>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.email}>
                <FormLabel>Correo electrónico</FormLabel>
                <Input
                  placeholder="Correo electrónico"
                  {...register("email")}
                />
                {errors.email && (
                  <Text color="red.500">{errors.email.message}</Text>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.password}>
                <FormLabel>Contraseña</FormLabel>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  {...register("password")}
                />
                {errors.password && (
                  <Text color="red.500">{errors.password.message}</Text>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.confirmPassword}>
                <FormLabel>Confirmación de contraseña</FormLabel>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirmación de contraseña"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <Text color="red.500">{errors.confirmPassword.message}</Text>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.role}>
                <FormLabel>Rol</FormLabel>
                <Select {...register("role")}>
                  <option value="">Selecciona un rol</option>
                  <option value="Admin">Administrador</option>
                  <option value="User">Usuario</option>
                  <option value="ClientAdmin">Administrador Clientes</option>
                </Select>
                {errors.role && (
                  <Text color="red.500">{errors.role.message}</Text>
                )}
              </FormControl>
            </Stack>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit(onSubmit)}>
            Crear
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
