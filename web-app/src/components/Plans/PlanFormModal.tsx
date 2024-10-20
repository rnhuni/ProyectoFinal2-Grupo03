import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
  Checkbox,
  Grid,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plan } from "../../interfaces/Plan";
import { useEffect, useState } from "react";

// Define the schema using Zod
const planSchema = z.object({
  name: z.string().min(1, "El nombre del plan es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  price: z.number().min(1, "El precio es requerido"),
  features: z
    .array(z.string())
    .nonempty("Debes seleccionar al menos una característica"),
});

type PlanFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedPlan: Plan) => void;
  plan: Plan | null;
  mode: "create" | "edit";
};

const PlanFormModal = ({
  isOpen,
  onClose,
  onSave,
  plan,
  mode,
}: PlanFormModalProps) => {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<Plan>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      features: [],
    },
  });

  const featuresList = [
    "Soporte técnico 24/7",
    "Acceso a reportes detallados",
    "Editar perfiles",
    "Integración con plataformas externas",
    "Facturación automática",
    "Usuarios permitidos: 1, 10, ilimitados",
    "Espacio de almacenamiento",
    "Actualizaciones de software automáticas",
    "Acceso móvil",
    "Modificar usuarios",
    "Eliminar usuarios",
    "Varios usuarios al tiempo",
    "Con publicidad",
    "Sin publicidad",
    "Facturación periódica",
  ];

  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    () =>
      featuresList.reduce(
        (acc, feature) => ({ ...acc, [feature]: false }),
        {} as { [key: string]: boolean }
      )
  );

  useEffect(() => {
    if (plan) {
      reset({
        ...plan,
        features: Array.isArray(plan.features) ? plan.features : [], // Aseguramos que features siempre sea un array
      });
      const initialFeatures = plan.features || [];
      setCheckedItems(
        featuresList.reduce((acc, feature) => {
          acc[feature] = initialFeatures.includes(feature);
          return acc;
        }, {} as { [key: string]: boolean })
      );
    } else {
      reset({
        name: "",
        description: "",
        price: 0,
        features: [], // Reseteamos como un array vacío
      });
      setCheckedItems(
        featuresList.reduce(
          (acc, feature) => ({ ...acc, [feature]: false }),
          {} as { [key: string]: boolean }
        )
      );
    }
  }, [plan, reset]);

  const handleCheckboxChange = (feature: string) => {
    setCheckedItems((prev) => {
      const updated = { ...prev, [feature]: !prev[feature] };
      const selectedFeatures = Object.keys(updated).filter(
        (key) => updated[key]
      );
      setValue("features", selectedFeatures); // Actualizamos el valor del campo 'features' en el formulario
      return updated;
    });
  };

  const onSubmit = (data: Plan) => {
    const selectedFeatures = Object.keys(checkedItems).filter(
      (feature) => checkedItems[feature]
    );
    const updatedPlan = {
      ...data,
      features: selectedFeatures, // Guardamos las características seleccionadas como un array
    };
    console.log("Objeto final que se enviará:", updatedPlan);
    onSave(updatedPlan);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {mode === "edit"
            ? "Editar plan de suscripción"
            : "Crear nuevo plan de suscripción"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.name} mb={4}>
              <FormLabel>Nombre del plan *</FormLabel>
              <Controller
                name="name"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </FormControl>

            <FormControl isInvalid={!!errors.description} mb={4}>
              <FormLabel>Descripción *</FormLabel>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Descripción del plan" />
                )}
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Características del Plan *</FormLabel>
              <Grid templateColumns="repeat(3, 1fr)" gap={2}>
                {featuresList.map((feature) => (
                  <Checkbox
                    key={feature}
                    isChecked={checkedItems[feature]} // Estado individual para cada checkbox
                    onChange={() => handleCheckboxChange(feature)} // Cambia el estado de cada checkbox de manera independiente
                  >
                    {feature}
                  </Checkbox>
                ))}
              </Grid>
              {errors.features && (
                <p style={{ color: "red" }}>
                  {errors.features.message?.toString()}
                </p>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.price} mb={4}>
              <FormLabel>Precio *</FormLabel>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Precio del plan" />
                )}
              />
            </FormControl>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit(onSubmit)}>
            {mode === "edit" ? "Editar" : "Crear Plan"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PlanFormModal;
