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
  Badge,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role } from "../../interfaces/Role"; // Asegúrate de usar la interfaz correcta aquí
import { roleSchema } from "./RolesModalSchema";

type FormData = z.infer<typeof roleSchema>;

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
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      description: "",
      permissions: [],
    },
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        name: initialData.name,
        permissions: initialData.permissions,
      });
    } else {
      reset({
        name: "",
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
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Nombre del Rol</FormLabel>
                <Input placeholder="Nombre del Rol" {...register("name")} />
                {errors.name && (
                  <FormErrorMessage>{errors.name.message}</FormErrorMessage>
                )}
              </FormControl>


              <>
                {/* Mostrar roles actuales del usuario */}
                {initialData?.permissions?.length ? (
                  <FormControl>
                    <FormLabel>Permisos actuales</FormLabel>
                    <Stack spacing={2}>
                      {initialData.permissions.map((permission) => (
                        <Badge key={permission.id} colorScheme="blue">
                          {permission.id}
                        </Badge>
                      ))}
                    </Stack>
                  </FormControl>
                ) : null}
              </>

              
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
