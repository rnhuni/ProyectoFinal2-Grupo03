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
  FormErrorMessage,
  Text,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plan } from "../../interfaces/Plan";
import { useEffect, useState } from "react";
import { featuresList } from "../../data/FeaturesList";
import { useTranslation } from "react-i18next";

// Define the schema using Zod
const planSchema = z.object({
  name: z.string().min(1, "plans.validations.name"),
  description: z.string().min(1, "plans.validations.description"),
  price: z.number().min(1, "plans.validations.price"),
  features: z.array(z.string()).nonempty("plans.validations.features"),
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
  const { t } = useTranslation();
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
          {mode === "edit" ? t("plans.modal.edit") : t("plans.modal.create")}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.name} mb={4}>
              <FormLabel>{t("plans.modal.name")}</FormLabel>
              <Controller
                name="name"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
              {errors.name && (
                <FormErrorMessage>
                  {t(`${errors.name.message}`)}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.description} mb={4}>
              <FormLabel>{t("plans.modal.description")}</FormLabel>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder={t("plans.modal.description_placeholder")}
                  />
                )}
              />
              {errors.description && (
                <FormErrorMessage>
                  {t(`${errors?.description?.message}`)}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>{t("plans.modal.characteristics")}</FormLabel>
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
                <Text color="red.400" fontSize="sm">
                  {t(`${errors?.features?.message}`)}
                </Text>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.price} mb={4}>
              <FormLabel>{t("plans.modal.price")}</FormLabel>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Precio del plan" />
                )}
              />
              {errors.price && (
                <FormErrorMessage>
                  {t(`${errors?.price?.message}`)}
                </FormErrorMessage>
              )}
            </FormControl>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
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

export default PlanFormModal;
