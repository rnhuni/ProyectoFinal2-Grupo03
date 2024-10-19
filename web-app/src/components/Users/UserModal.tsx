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

const schema = z.object({
  name: z
    .string()
    .min(3, { message: "El nombre debe tener al menos 3 caracteres." }),
  email: z.string().email({ message: "Debe ser un correo válido." }),
  role_id: z.string().nonempty({ message: "El rol es requerido." }),
  client_id: z.string().nonempty({ message: "El cliente es requerido." }),
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
      role_id: "",
      client_id: "",
    },
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        name: initialData.name,
        email: initialData.email,
        role_id: initialData.role_id,
        client_id: initialData.client_id,
      });
    } else {
      reset({
        name: "",
        email: "",
        role_id: "",
        client_id: "",
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

              <FormControl isInvalid={!!errors.role_id}>
                <FormLabel>Rol</FormLabel>
                <Select {...register("role_id")}>
                  <option value="">Selecciona un rol</option>
                  <option value="role-1">Admin</option>
                  <option value="role-2">Usuario</option>
                  <option value="role-3">Administrador Cliente</option>
                </Select>
                {errors.role_id && (
                  <FormErrorMessage>{errors.role_id.message}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.client_id}>
                <FormLabel>ID de Cliente</FormLabel>
                <Input placeholder="ID de Cliente" {...register("client_id")} />
                {errors.client_id && (
                  <FormErrorMessage>
                    {errors.client_id.message}
                  </FormErrorMessage>
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
