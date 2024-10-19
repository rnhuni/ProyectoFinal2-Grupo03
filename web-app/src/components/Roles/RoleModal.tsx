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
  Checkbox,
  HStack,
  Text,
  Select,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role } from "../../interfaces/Role"; // Asegúrate de usar la interfaz correcta aquí
import { roleSchema } from "./RolePermissionsSchema";
import { z } from "zod";
import usePermissions from "../../hooks/permissions/usePermissions";
import useRoles from "../../hooks/roles/useRoles";

type FormData = z.infer<typeof roleSchema>;

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Role;
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
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      permissions: [],
    },
  });

  // Guardar las acciones seleccionadas para cada permiso
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [selectedPermission, setSelectedPermission] = useState<string>("");
  const { permissions, reloadPermissions } = usePermissions();
  const { createRole } = useRoles();

  // Inicializar o resetear el formulario según el modo
  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        name: initialData.name,
        permissions: initialData.permissions?.map((p) => ({
          id: p.id,
          actions: p.actions,
        })),
      });

      const initialActions = (initialData.permissions ?? []).flatMap(
        (permission) =>
          permission.actions.map((action) => `${permission.id}-${action}`)
      );
      setSelectedActions(initialActions);

      setSelectedPermission("");
    } else {
      reset({
        name: "",
        permissions: [],
      });
      setSelectedActions([]);
      setSelectedPermission(""); // Limpiar la selección del permiso
    }
  }, [initialData, mode, reset]);

  useEffect(() => {
    reloadPermissions(); // Carga inicial de permisos
  }, []);

  // Manejar el cambio en los checkboxes para acciones
  const handleCheckboxChange = (
    permissionId: string,
    action: "write" | "read" | "update" | "delete"
  ) => {
    const actionId = `${permissionId}-${action}`;
    console.log("Action ID:", actionId);

    setSelectedActions((prevState) => {
      const updatedActions = prevState.includes(actionId)
        ? prevState.filter((id) => id !== actionId)
        : [...prevState, actionId];
      console.log("Updated Actions:", updatedActions);
      return updatedActions;
    });

    const currentPermissions = getValues("permissions");
    console.log("Current Permissions:", currentPermissions);

    const permissionIndex = currentPermissions.findIndex(
      (p: { id: string; actions: string[] }) => p.id === permissionId
    );
    console.log("Permission Index:", permissionIndex);

    let updatedPermissions;

    if (permissionIndex !== -1) {
      const permission = currentPermissions[permissionIndex];
      const updatedPermission = {
        ...permission,
        actions: permission.actions.includes(action)
          ? permission.actions.filter((a: string) => a !== action)
          : [...permission.actions, action],
      };

      updatedPermissions = [
        ...currentPermissions.slice(0, permissionIndex),
        updatedPermission,
        ...currentPermissions.slice(permissionIndex + 1),
      ];
    } else {
      updatedPermissions = [
        ...currentPermissions,
        {
          id: permissionId,
          actions: [action],
        },
      ];
    }

    console.log("Updated Permissions:", updatedPermissions);
    setValue("permissions", updatedPermissions);
  };

  // Manejar la selección del permiso en el select
  const handlePermissionSelect = (permissionId: string) => {
    const currentPermissions = getValues("permissions");

    // Verificar si el permiso ya existe
    const permissionExists = currentPermissions.some(
      (p: { id: string }) => p.id === permissionId
    );
    if (!permissionExists) {
      // Si no existe, agregar el nuevo permiso con un array vacío de acciones
      const updatedPermissions = [
        ...currentPermissions,
        { id: permissionId, actions: [] },
      ];
      setValue("permissions", updatedPermissions);
    }
    setSelectedPermission(permissionId); // Actualizar la selección de permiso
  };

  // Función de envío del formulario
  const onSubmit = (data: FormData) => {
    createRole(data as Role);
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
              {/* Nombre del Rol */}
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Nombre del Rol</FormLabel>
                <Input placeholder="Nombre del Rol" {...register("name")} />
                {errors.name && (
                  <FormErrorMessage>{errors.name.message}</FormErrorMessage>
                )}
              </FormControl>

              {/* Mostrar permisos actuales con acciones */}
              {getValues("permissions").length > 0 && (
                <FormControl>
                  <FormLabel>Permisos actuales</FormLabel>
                  <Stack spacing={2}>
                    {getValues("permissions").map((permission) => (
                      <Badge key={permission.id} colorScheme="blue">
                        {permission.id}
                        <Stack pl={6} mt={1} spacing={1}>
                          <HStack spacing={4}>
                            {["write", "read", "update", "delete"].map(
                              (action) => (
                                <Checkbox
                                  key={`${permission.id}-${action}`}
                                  isChecked={selectedActions.includes(
                                    `${permission.id}-${action}`
                                  )}
                                  onChange={() =>
                                    handleCheckboxChange(
                                      permission.id,
                                      action as
                                        | "write"
                                        | "read"
                                        | "update"
                                        | "delete"
                                    )
                                  }
                                >
                                  <Text textTransform={"lowercase"}>
                                    {action}
                                  </Text>
                                </Checkbox>
                              )
                            )}
                          </HStack>
                        </Stack>
                      </Badge>
                    ))}
                  </Stack>
                </FormControl>
              )}

              {/* Selector para permisos */}
              <FormControl mt={4}>
                <FormLabel>Seleccionar Permiso</FormLabel>
                <Select
                  placeholder="Seleccionar permiso"
                  value={selectedPermission}
                  onChange={(e) => handlePermissionSelect(e.target.value)}
                >
                  {permissions.map((permission) => (
                    <option key={permission.id} value={permission.id}>
                      {permission.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            colorScheme="blue"
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            {mode === "edit" ? "Guardar" : "Crear"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RoleModal;
