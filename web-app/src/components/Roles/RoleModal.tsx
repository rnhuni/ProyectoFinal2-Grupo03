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
  Stack,
  FormErrorMessage,
  Textarea,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role } from "../../interfaces/Role"; // Asegúrate de usar la interfaz correcta aquí

// Esquema de validación de Zod
const schema = z.object({
  roleName: z
    .string()
    .min(3, { message: "El nombre del rol debe tener al menos 3 caracteres." }),
  email: z.string().email({ message: "Debe ser un correo válido." }),
  role: z.string().nonempty({ message: "El rol es requerido." }),
  description: z
    .string()
    .min(10, { message: "La descripción debe tener al menos 10 caracteres." })
    .optional(), // La descripción es opcional
  permissions: z
    .array(z.number())
    .min(1, { message: "Debes asignar al menos un permiso." }),
});

type FormData = z.infer<typeof schema>;

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Role; // Ahora usa la interfaz `Role` correctamente
  mode: "create" | "edit";
}

const RoleModal: React.FC<RoleModalProps> = ({
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
      roleName: "",
      description: "",
      permissions: [],
    },
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        roleName: initialData.roleName,
        description: initialData.description || "", // Asegurarse de manejar un valor vacío
        permissions: initialData.permissions,
      });
    } else {
      reset({
        roleName: "",
        description: "",
        permissions: [],
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
          {mode === "edit" ? "Editar Rol" : "Crear Rol"}
        </ModalHeader>
        <ModalCloseButton aria-label="close" />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl isInvalid={!!errors.roleName}>
                <FormLabel>Nombre del Rol</FormLabel>
                <Input placeholder="Nombre del Rol" {...register("roleName")} />
                {errors.roleName && (
                  <FormErrorMessage>{errors.roleName.message}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.description}>
                <FormLabel>Descripción</FormLabel>
                <Textarea
                  placeholder="Descripción del rol"
                  {...register("description")}
                />
                {errors.description && (
                  <FormErrorMessage>
                    {errors.description.message}
                  </FormErrorMessage>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.permissions}>
                <FormLabel>Permisos (IDs separados por coma)</FormLabel>
                <Input
                  placeholder="Permisos (ej: 1, 2, 3)"
                  {...register("permissions", {
                    setValueAs: (v) =>
                      v.split(",").map((n: string) => parseInt(n.trim())),
                  })}
                />
                {errors.permissions && (
                  <FormErrorMessage>
                    {errors.permissions.message}
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
            {mode === "edit" ? "Guardar" : "Crear"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RoleModal;
