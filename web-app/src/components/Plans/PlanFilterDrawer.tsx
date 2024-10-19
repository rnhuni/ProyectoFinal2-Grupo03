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

// Definir esquema de validación usando Zod
const filterSchema = z.object({
  field: z.enum(["name", "description", "status", "price"], {
    required_error: "Debes seleccionar un campo para buscar",
  }),
  searchValue: z.string().min(1, "El campo de búsqueda no puede estar vacío"),
});

// Definición del tipo para el formulario basado en el esquema
type FilterFormData = z.infer<typeof filterSchema>;

const PlanFilterDrawer = ({
  applyFilters,
}: {
  applyFilters: (filters: FilterFormData) => void;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);

  // Configuración de react-hook-form con Zod
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
    onClose(); // Cerrar el Drawer después de aplicar los filtros
  };

  return (
    <>
      <Button ref={btnRef} colorScheme="blue" onClick={onOpen}>
        Filtrar
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
          <DrawerHeader>Filtros</DrawerHeader>

          <DrawerBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={4}>
                <FormControl isInvalid={!!errors.field}>
                  <FormLabel>Campo</FormLabel>
                  <Controller
                    name="field"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        placeholder="Seleccione el campo a buscar"
                      >
                        <option value="name">Nombre</option>
                        <option value="description">Descripción</option>
                        <option value="status">Estado</option>
                        <option value="price">Precio</option>
                      </Select>
                    )}
                  />
                  {errors.field && (
                    <Text color="red.500" fontSize="sm">
                      {errors.field.message}
                    </Text>
                  )}
                </FormControl>

                <FormControl isInvalid={!!errors.searchValue}>
                  <FormLabel>Buscar</FormLabel>
                  <Controller
                    name="searchValue"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Buscar" />
                    )}
                  />
                  {errors.searchValue && (
                    <Text color="red.500" fontSize="sm">
                      {errors.searchValue.message}
                    </Text>
                  )}
                </FormControl>
              </Stack>
            </form>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit(onSubmit)}>
              Aplicar Filtro
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default PlanFilterDrawer;
