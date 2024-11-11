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
  useToast,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { featuresList } from "../../data/FeaturesList";
import { useTranslation } from "react-i18next";
import {
  BaseSubscription,
  UpdateActiveSubscriptionData,
} from "../../interfaces/SubscriptionsBase";

const subscriptionSchema = z.object({
  notifyByEmail: z.boolean().optional(),
  subscriptionBaseId: z.string().min(1, "subscriptions.validations.base_id"),
  features: z.array(z.string()).nonempty("subscriptions.validations.features"),
});

type SubscriptionActiveModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (subscriptionData: UpdateActiveSubscriptionData) => void;
  subscription?: BaseSubscription | null;
};

const SubscriptionActiveModal = ({
  isOpen,
  onClose,
  onSave,
  subscription,
}: SubscriptionActiveModalProps) => {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<{
    notifyByEmail: boolean;
    subscriptionBaseId: string;
    features: string[];
  }>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      notifyByEmail: true,
      subscriptionBaseId: "",
      features: [],
    },
  });

  const { t } = useTranslation();
  const toast = useToast();

  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    () =>
      featuresList.reduce(
        (acc, feature) => ({ ...acc, [feature]: false }),
        {} as { [key: string]: boolean }
      )
  );

  // Resetear formulario al cargar suscripción o para crear una nueva
  useEffect(() => {
    if (subscription) {
      reset({
        subscriptionBaseId: subscription.id,
        notifyByEmail: true,
        features: subscription.features.map((feature) => feature.id),
      });

      setCheckedItems(
        featuresList.reduce((acc, feature) => {
          acc[feature] = subscription.features.some((f) => f.id === feature);
          return acc;
        }, {} as { [key: string]: boolean })
      );
    } else {
      reset({
        notifyByEmail: true,
        subscriptionBaseId: "",
        features: [],
      });
      setCheckedItems(
        featuresList.reduce(
          (acc, feature) => ({ ...acc, [feature]: false }),
          {} as { [key: string]: boolean }
        )
      );
    }
  }, [subscription, reset]);

  const handleCheckboxChange = (feature: string) => {
    setCheckedItems((prev) => {
      const updated = { ...prev, [feature]: !prev[feature] };
      const selectedFeatures = Object.keys(updated).filter(
        (key) => updated[key]
      );
      setValue("features", selectedFeatures); // Actualizar el campo de 'features' en el formulario
      return updated;
    });
  };

  const onSubmit = async (data: UpdateActiveSubscriptionData) => {
    const subscriptionData = {
      notifyByEmail: data.notifyByEmail,
      subscriptionBaseId: data.subscriptionBaseId,
      features: data.features,
    };

    try {
      onSave(subscriptionData);
      toast({
        title: t("subscriptions.modal.success"),
        description: t("subscriptions.modal.success_message"),
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast({
        title: t("subscriptions.modal.error"),
        description: t("subscriptions.modal.error_message"),
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("subscriptions.modal.title")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl mb={4}>
              <FormLabel>{t("subscriptions.modal.notifyByEmail")}</FormLabel>
              <Controller
                name="notifyByEmail"
                control={control}
                render={({ field }) => (
                  <Checkbox isChecked={field.value} onChange={field.onChange}>
                    {t("subscriptions.modal.notifyByEmail_label")}
                  </Checkbox>
                )}
              />
            </FormControl>

            <FormControl isInvalid={!!errors.subscriptionBaseId} mb={4}>
              <FormLabel>
                {t("subscriptions.modal.subscriptionBaseId")}
              </FormLabel>
              <Controller
                name="subscriptionBaseId"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder={t(
                      "subscriptions.modal.subscriptionBaseId_placeholder"
                    )}
                  />
                )}
              />
              {errors.subscriptionBaseId && (
                <FormErrorMessage>
                  {t(`${errors.subscriptionBaseId.message}`)}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>{t("subscriptions.modal.features")}</FormLabel>
              <Grid templateColumns="repeat(3, 1fr)" gap={2}>
                {featuresList.map((feature) => (
                  <Checkbox
                    key={feature}
                    isChecked={checkedItems[feature]}
                    onChange={() => handleCheckboxChange(feature)}
                  >
                    {feature}
                  </Checkbox>
                ))}
              </Grid>
              {errors.features && (
                <Text color="red.400" fontSize="sm">
                  {t(`${errors.features.message}`)}
                </Text>
              )}
            </FormControl>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            {t("common.button.cancel")}
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit(onSubmit)}>
            {t("common.button.save")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SubscriptionActiveModal;
