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
import { Role } from "../../interfaces/Role";
import { roleSchema } from "./RolePermissionsSchema";
import { z } from "zod";
import usePermissions from "../../hooks/permissions/usePermissions";
import useRoles from "../../hooks/roles/useRoles";
import { useTranslation } from "react-i18next";

type FormData = z.infer<typeof roleSchema>;

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Role;
  mode: "create" | "edit";
  setReloadData: React.Dispatch<React.SetStateAction<boolean>>;
}

const RoleModal: React.FC<RoleModalProps> = ({
  isOpen,
  onClose,
  initialData,
  mode,
  setReloadData,
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
  const { t } = useTranslation();
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [selectedPermission, setSelectedPermission] = useState<string>("");
  const checkboxCheckedBg = "white";
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { permissions, reloadPermissions } = usePermissions();
  const { createRole, updateRole } = useRoles();

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        id: initialData.id,
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
      setSelectedPermission("");
      setShowError(false);
    }
  }, [initialData, mode, reset]);

  useEffect(() => {
    reloadPermissions();
    setShowError(false);
  }, []);

  const handleCheckboxChange = (
    permissionId: string,
    action: "write" | "read" | "update" | "delete"
  ) => {
    const actionId = `${permissionId}-${action}`;

    setSelectedActions((prevState) => {
      const updatedActions = prevState.includes(actionId)
        ? prevState.filter((id) => id !== actionId)
        : [...prevState, actionId];
      return updatedActions;
    });

    const currentPermissions = getValues("permissions");

    const permissionIndex = currentPermissions.findIndex(
      (p: { id: string; actions: string[] }) => p.id === permissionId
    );

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

    setValue("permissions", updatedPermissions);
  };

  const handlePermissionSelect = (permissionId: string) => {
    const currentPermissions = getValues("permissions");

    const permissionExists = currentPermissions.some(
      (p: { id: string }) => p.id === permissionId
    );
    if (!permissionExists) {
      const updatedPermissions = [
        ...currentPermissions,
        { id: permissionId, actions: [] },
      ];
      setValue("permissions", updatedPermissions);
    }
    setSelectedPermission(permissionId);
  };

  const handleRequest = async (data: FormData) => {
    let createdRole;
    if (mode == "edit") {
      createdRole = await updateRole(data as Role);
    } else {
      createdRole = await createRole(data as Role);
    }

    return createdRole;
  };

  const onSubmit = async (data: FormData) => {
    const message = await handleRequest(data);

    if (typeof message === "string") {
      if (message == "Role already exists") {
        setErrorMessage("role.validations.exists");
      } else if (message == "permissions is required") {
        setErrorMessage("role.validations.permissions_required");
      } else if (message.includes("list values")) {
        setErrorMessage("role.validations.permissions_list_values");
      } else {
        setErrorMessage("permissions_unknown");
      }
      setShowError(true);
    } else {
      setReloadData(true);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {mode === "edit" ? t("role.modal.edit") : t("role.modal.create")}
        </ModalHeader>
        <ModalCloseButton aria-label="close" />
        <ModalBody>
          {showError && (
            <FormControl>
              <FormLabel color="red.500">{t(`${errorMessage}`)}</FormLabel>
            </FormControl>
          )}
          <form
            role="form_modal"
            data-testid="role-modal-form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Stack spacing={4}>
              {/* Nombre del Rol */}
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>{t("role.modal.name")}</FormLabel>
                <Input
                  placeholder={t("role.modal.name")}
                  {...register("name")}
                />
                {errors.name && (
                  <FormErrorMessage>
                    {t(`${errors.name.message}`, { count: 3 })}
                  </FormErrorMessage>
                )}
              </FormControl>

              {/* Mostrar permisos actuales con acciones */}
              {getValues("permissions").length > 0 && (
                <FormControl>
                  <FormLabel>{t("role.modal.current_permissions")}</FormLabel>
                  <Stack spacing={2}>
                    {getValues("permissions").map((permission) => (
                      <Badge
                        color={"white"}
                        padding={"2"}
                        key={permission.id}
                        bg={"blue.500"}
                      >
                        {permission.id}
                        <Stack pl={6} mt={1} spacing={1}>
                          <HStack spacing={4}>
                            {["write", "read", "update", "delete"].map(
                              (action) => (
                                <Checkbox
                                  id={`${permission.id}-${action}`}
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
                                  colorScheme="green"
                                  size="md"
                                  _checked={{
                                    padding: "0.5em",
                                    height: "2.5em",
                                    width: "auto",
                                    bg: checkboxCheckedBg,
                                    borderColor: "white",
                                  }}
                                  borderRadius="md"
                                >
                                  <Text
                                    textTransform="capitalize"
                                    fontSize="sm"
                                    fontWeight="medium"
                                    color={
                                      selectedActions.includes(
                                        `${permission.id}-${action}`
                                      )
                                        ? "blue.500"
                                        : "white"
                                    }
                                  >
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
                <FormLabel>{t("role.modal.select_permission")}</FormLabel>
                <Select
                  role="select"
                  placeholder={t("role.modal.select_permission")}
                  value={selectedPermission}
                  onChange={(e) => handlePermissionSelect(e.target.value)}
                >
                  {permissions.map((permission) => (
                    <option
                      role="select_option"
                      key={permission.id}
                      value={permission.id}
                    >
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
            {t("common.button.cancel")}
          </Button>
          <Button
            colorScheme="blue"
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            {mode === "edit"
              ? t("common.button.edit")
              : t("common.button.create")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RoleModal;
