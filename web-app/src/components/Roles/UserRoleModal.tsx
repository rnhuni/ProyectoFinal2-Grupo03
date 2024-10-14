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
  Badge,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRole } from "../../interfaces/UserRole";
import { User } from "../../interfaces/User";

// Esquema de validación con Zod para el formulario
const schema = z.object({
  userId: z.number().min(1, { message: "Debes seleccionar un usuario." }),
  role: z.string().nonempty({ message: "El rol es requerido." }),
});

type FormData = z.infer<typeof schema>;

interface UserRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: UserRole;
  mode: "create" | "edit";
  users: User[]; // Lista de usuarios disponibles
  availableRoles: string[]; // Lista de todos los roles disponibles
}

const UserRoleModal: React.FC<UserRoleModalProps> = ({
  isOpen,
  onClose,
  initialData,
  mode,
  users,
  availableRoles,
}) => {
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      userId: initialData?.userId || 0,
      role: "",
    },
  });

  // Llenar datos automáticamente cuando se selecciona un usuario
  const handleUserChange = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setValue("userId", user.id);
    }
  };

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        userId: initialData.userId,
        role: initialData.role,
      });
      const user = users.find((u) => u.id === initialData.userId);
      if (user) {
        setSelectedUser(user);
      }
    } else {
      reset({
        userId: 0,
        role: "",
      });
      setSelectedUser(undefined);
    }
  }, [initialData, mode, reset, users]);

  const onSubmit = (data: FormData) => {
    console.log("Datos enviados:", data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {mode === "edit" ? "Editar Rol" : "Asignar Rol"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl isInvalid={!!errors.userId}>
                <FormLabel>Usuario</FormLabel>
                <Select
                  placeholder="Selecciona un usuario"
                  {...register("userId", {
                    setValueAs: (value) => Number(value), // Convierte a número
                    onChange: (e) => handleUserChange(Number(e.target.value)),
                  })}
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.id.toString()}>
                      {user.name}
                    </option>
                  ))}
                </Select>
                {errors.userId && (
                  <FormErrorMessage>{errors.userId.message}</FormErrorMessage>
                )}
              </FormControl>

              {selectedUser && (
                <>
                  <FormControl>
                    <FormLabel>Fecha Creación</FormLabel>
                    <Input value={selectedUser.createdAt} isReadOnly />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input value={selectedUser.email} isReadOnly />
                  </FormControl>

                  {/* Mostrar roles actuales del usuario */}
                  {selectedUser.roles.length > 0 && (
                    <FormControl>
                      <FormLabel>Roles actuales</FormLabel>
                      <Stack spacing={2}>
                        {selectedUser.roles.map((role) => (
                          <Badge key={role.id} colorScheme="blue">
                            {role.roleName}
                          </Badge>
                        ))}
                      </Stack>
                    </FormControl>
                  )}
                </>
              )}

              <FormControl isInvalid={!!errors.role}>
                <FormLabel>Rol</FormLabel>
                <Select placeholder="Selecciona un rol" {...register("role")}>
                  {availableRoles
                    .filter(
                      (role) =>
                        !selectedUser?.roles.some(
                          (r) => r.roleName === role // Evita roles duplicados
                        )
                    )
                    .map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
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
            {mode === "edit" ? "Guardar" : "Asignar"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserRoleModal;
