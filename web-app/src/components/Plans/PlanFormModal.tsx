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
  price: z.string().min(1, "El precio es requerido"),
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
    formState: { errors },
  } = useForm<Plan>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "0",
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

  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    featuresList.map(() => false)
  );

  useEffect(() => {
    if (plan) {
      reset(plan);
      const planFeatures = plan.features.split(", ").map((f) => f.trim());
      setCheckedItems(
        featuresList.map((feature) => planFeatures.includes(feature))
      );
    } else {
      reset({
        name: "",
        description: "",
        price: "0",
      });
      setCheckedItems(featuresList.map(() => false));
    }
  }, [plan, reset]);

  const handleFeatureChange = (index: number) => {
    setCheckedItems((prev) =>
      prev.map((item, i) => (i === index ? !item : item))
    );
  };

  const onSubmit = (data: Plan) => {
    const selectedFeatures = featuresList.filter(
      (_, index) => checkedItems[index]
    );
    const updatedPlan = {
      ...data,
      features: selectedFeatures.join(", "),
    };
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
                {featuresList.map((feature, index) => (
                  <Checkbox
                    key={feature}
                    isChecked={checkedItems[index]}
                    onChange={() => handleFeatureChange(index)}
                  >
                    {feature}
                  </Checkbox>
                ))}
              </Grid>
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