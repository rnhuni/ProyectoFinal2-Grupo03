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
  useToast,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "../../interfaces/User";
import useUsers from "../../hooks/users/useUser";
import useRoles from "../../hooks/roles/useRoles";

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
  onSave: (data: FormData) => void;
  initialData?: User;
  mode: "create" | "edit";
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSave,
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

  const { error: usersError, createUser, updateUser } = useUsers();
  const { reloadRoles, error: rolesError, roles } = useRoles();
  const toast = useToast();

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

  useEffect(() => {
    reloadRoles();
  }, []);

  const onSubmit = async (data: FormData) => {
    const userData: User = {
      name: data.name,
      email: data.email,
      role_id: data.role_id,
      client_id: data.client_id,
    };

    try {
      if (mode === "edit" && initialData) {
        await updateUser({ ...initialData, ...userData });
        toast({
          title: "Usuario actualizado.",
          description: "El usuario ha sido actualizado exitosamente.",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      } else {
        await createUser(userData);
        toast({
          title: "Usuario creado.",
          description: "El usuario ha sido creado exitosamente.",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error.",
        description: "Ocurrió un error al procesar el usuario.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }

    onSave(userData);
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
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
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
          {rolesError && <p style={{ color: "red" }}>Error: {rolesError}</p>}
          {usersError && <p style={{ color: "red" }}>Error: {usersError}</p>}
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
