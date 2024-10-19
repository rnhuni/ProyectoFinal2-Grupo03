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
  Alert,
  AlertIcon,
  Spinner,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Permission } from "../../interfaces/Permissions";
import { permissionsModalSchema } from "./PermissionsModalSchema";
import { useTranslation } from "react-i18next";
import usePermissions from "../../hooks/permissions/usePermissions";

type FormData = z.infer<typeof permissionsModalSchema>;

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Permission;
  mode: "create" | "edit";
}

export const PermissionModal: React.FC<PermissionModalProps> = ({
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
    resolver: zodResolver(permissionsModalSchema),
    defaultValues: {
      name: "",
      description: "",
      resource: "resource",
    },
  });
  const { t } = useTranslation();
  const { createPermission, updatePermission, error, loading } =
    usePermissions();

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        id: initialData.id,
        name: initialData.name,
        description: initialData.description,
        resource: initialData.resource,
      });
    } else {
      reset({
        id: "",
        name: "",
        description: "",
        resource: "",
      });
    }
  }, [initialData, mode, reset]);

  const onSubmit = (data: FormData) => {
    // console.log("Datos enviados:", data);
    handleSubmitAsyn(data);
    onClose();
  };

  const handleSubmitAsyn = async (data: FormData) => {
    if (mode === "edit") {
      await updatePermission(data);
      // console.log("Permiso actualizado:", updatedPermission);
    } else {
      await createPermission(data);
      // console.log("Permiso creado:", createdPermission);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {mode === "edit"
            ? t("permissions.modal.edit")
            : t("permissions.modal.create")}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Mensaje de error */}
          {error && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              {t("permissions.modal.error_message")}
            </Alert>
          )}

          {/* Indicador de carga */}
          {loading && (
            <Alert status="info" mb={4}>
              <AlertIcon />
              <Spinner size="sm" mr={2} />
              {t("permissions.modal.loading_message")}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>{t("permissions.name")}</FormLabel>
                <Input
                  placeholder={t("permissions.name")}
                  {...register("name")}
                />
                {errors.name && (
                  <FormErrorMessage>
                    {t(`${errors.name.message}`, { count: 3 })}
                  </FormErrorMessage>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.resource}>
                <FormLabel>{t("permissions.resource")}</FormLabel>
                <Input
                  placeholder={t("permissions.resource")}
                  {...register("resource")}
                />
                {errors.resource && (
                  <FormErrorMessage>
                    {t(`${errors.resource.message}`, { count: 3 })}
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={!!errors.description}>
                <FormLabel>{t("permissions.description")}</FormLabel>
                <Input
                  placeholder={t("permissions.description")}
                  {...register("description")}
                />
                {errors.description && (
                  <FormErrorMessage>
                    {t(`${errors.description.message}`, { count: 10 })}
                  </FormErrorMessage>
                )}
              </FormControl>
            </Stack>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            {t("common.button.cancel")}
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit(onSubmit)}>
            {mode === "edit"
              ? t("common.button.edit")
              : t("common.button.create")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
