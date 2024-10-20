import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
  Select,
  useDisclosure,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

const filterSchema = z.object({
  field: z.enum(["name", "email", "role_id", "status", "client_id"], {
    required_error: "Debes seleccionar un campo para buscar",
  }),
  searchValue: z.string().min(1, "El campo de búsqueda no puede estar vacío"),
});

type FilterFormData = z.infer<typeof filterSchema>;

const UserFilterDrawer = ({
  applyFilters,
}: {
  applyFilters: (filters: FilterFormData) => void;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);

  const { t } = useTranslation();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FilterFormData>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      field: undefined,
      searchValue: "",
    },
  });

  const onSubmit = (data: FilterFormData) => {
    applyFilters(data);
    onClose();
  };

  return (
    <>
      <Button ref={btnRef} colorScheme="blue" onClick={onOpen}>
        {t("users.filter", "Filtrar")}
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{t("users.filters", "Filtros")}</DrawerHeader>

          <DrawerBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={4}>
                <FormControl isInvalid={!!errors.field}>
                  <FormLabel>{t("users.field", "Campo")}</FormLabel>
                  <Controller
                    name="field"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        placeholder={t(
                          "users.select_field",
                          "Seleccione el campo a buscar"
                        )}
                      >
                        <option value="name">
                          {t("users.name", "Nombre")}
                        </option>
                        <option value="email">
                          {t("users.email", "Correo Electrónico")}
                        </option>
                        <option value="role_id">
                          {t("users.role", "Rol")}
                        </option>
                        <option value="status">
                          {t("users.status_label", "Estado")}
                        </option>
                        <option value="client_id">
                          {t("users.client", "Cliente")}
                        </option>
                      </Select>
                    )}
                  />
                  {errors.field && (
                    <Text color="red.500" fontSize="sm">
                      {t(
                        "users.field_error",
                        "Debes seleccionar un campo para buscar"
                      )}
                    </Text>
                  )}
                </FormControl>

                <FormControl isInvalid={!!errors.searchValue}>
                  <FormLabel>{t("users.search", "Buscar")}</FormLabel>
                  <Controller
                    name="searchValue"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder={t("users.search_placeholder", "Buscar")}
                      />
                    )}
                  />
                  {errors.searchValue && (
                    <Text color="red.500" fontSize="sm">
                      {t(
                        "users.search_error",
                        "El campo de búsqueda no puede estar vacío"
                      )}
                    </Text>
                  )}
                </FormControl>
              </Stack>
            </form>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              {t("common.button.cancel", "Cancelar")}
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit(onSubmit)}>
              {t("users.apply_filter", "Aplicar Filtro")}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default UserFilterDrawer;
