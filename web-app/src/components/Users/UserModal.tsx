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
  FormErrorMessage,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "../../interfaces/User";

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

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: User;
  mode: "create" | "edit";
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  initialData,
  mode,
}) => {
  const {
    register,
    handleSubmit,
    reset,
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

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        name: initialData.name,
        email: initialData.email,
        password: "",
        confirmPassword: "",
        role: initialData.role,
      });
    } else {
      reset({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
      });
    }
  }, [initialData, mode, reset]);

  const onSubmit = (data: FormData) => {
    console.log("Datos enviados:", data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {mode === "edit" ? "Editar Usuario" : "Crear Usuario"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Nombre</FormLabel>
                <Input placeholder="Nombre" {...register("name")} />
                {errors.name && (
                  <FormErrorMessage>{errors.name.message}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.email}>
                <FormLabel>Correo electrónico</FormLabel>
                <Input
                  placeholder="Correo electrónico"
                  {...register("email")}
                />
                {errors.email && (
                  <FormErrorMessage>{errors.email.message}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.password}>
                <FormLabel>Contraseña</FormLabel>
                <Input
                  type="password"
                  placeholder="Contraseña"
                  {...register("password")}
                />
                {errors.password && (
                  <FormErrorMessage>{errors.password.message}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.confirmPassword}>
                <FormLabel>Confirmación de contraseña</FormLabel>
                <Input
                  type="password"
                  placeholder="Confirmación de contraseña"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <FormErrorMessage>
                    {errors.confirmPassword.message}
                  </FormErrorMessage>
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
                  <FormErrorMessage>{errors.role.message}</FormErrorMessage>
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
            {mode === "edit" ? "Editar" : "Crear"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
