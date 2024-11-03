import React, { useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Checkbox,
  SimpleGrid,
  Button,
  Select,
  useDisclosure,
  Box,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { WarningIcon } from "@chakra-ui/icons";
import { Subscription } from "../../interfaces/SubscriptionsBase";

interface UpdatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription | null;
}

interface FormData {
  currentPlan: string;
  description: string;
  features: {
    support: boolean;
    reports: boolean;
    editProfiles: boolean;
    billing: boolean;
    users: boolean;
    mobileAccess: boolean;
  };
}

const UpdatePlanModal: React.FC<UpdatePlanModalProps> = ({
  isOpen,
  onClose,
  subscription,
}) => {
  const { handleSubmit, control, reset } = useForm<FormData>({
    defaultValues: {
      currentPlan: "",
      description: "",
      features: {
        support: false,
        reports: false,
        editProfiles: false,
        billing: false,
        users: false,
        mobileAccess: false,
      },
    },
  });

  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
  } = useDisclosure();

  useEffect(() => {
    if (subscription) {
      reset({
        currentPlan: subscription.currentPlan || "",
        description: subscription.description || "",
        features: {
          support: true,
          reports: true,
          editProfiles: false,
          billing: true,
          users: false,
          mobileAccess: false,
        },
      });
    }
  }, [subscription, reset]);

  const onSubmit = (data: FormData) => {
    console.log(data);
    // llamada a una API
    onConfirmClose();
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "COP",
    }).format(amount);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent maxW="70%">
          <ModalHeader bg={"#F5F8FD"} boxShadow="sm">
            Editar plan de suscripción
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onConfirmOpen)}>
              <FormControl mb={4}>
                <FormLabel>Nombre del plan</FormLabel>
                <Controller
                  name="currentPlan"
                  control={control}
                  render={({ field }) => (
                    <Select {...field}>
                      <option value="Plan Básico">Plan Básico</option>
                      <option value="Plan Avanzado">Plan Avanzado</option>
                      <option value="Plan Premium">Plan Premium</option>
                      <option value="Plan Pro">Plan Pro</option>
                    </Select>
                  )}
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Descripción</FormLabel>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => <Textarea {...field} />}
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Características del Plan</FormLabel>
                <SimpleGrid columns={2} spacing={2}>
                  <Controller
                    name="features.support"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        isChecked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      >
                        Soporte técnico 24/7
                      </Checkbox>
                    )}
                  />
                  <Controller
                    name="features.reports"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        isChecked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      >
                        Acceso a reportes avanzados
                      </Checkbox>
                    )}
                  />
                  <Controller
                    name="features.editProfiles"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        isChecked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      >
                        Editar perfiles
                      </Checkbox>
                    )}
                  />
                  <Controller
                    name="features.billing"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        isChecked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      >
                        Facturación automática
                      </Checkbox>
                    )}
                  />
                  <Controller
                    name="features.users"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        isChecked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      >
                        Usuarios permitidos: 1
                      </Checkbox>
                    )}
                  />
                  <Controller
                    name="features.mobileAccess"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        isChecked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      >
                        Acceso móvil
                      </Checkbox>
                    )}
                  />
                  {/* Agrega más características según sea necesario */}
                </SimpleGrid>
              </FormControl>
              <FormControl>
                <FormLabel>Precio</FormLabel>
                <Input
                  value={formatCurrency(subscription?.amountPaid || 0)}
                  readOnly
                />
              </FormControl>
              <ModalFooter>
                <Button variant="ghost" onClick={onClose}>
                  Cancelar
                </Button>
                <Button colorScheme="blue" ml={3} type="submit">
                  Actualizar
                </Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isConfirmOpen} onClose={onConfirmClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar Actualización</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display="flex" alignItems="center">
              <WarningIcon color="#F87700" mr={2} boxSize={12} />
              ¿Estás seguro de que deseas actualizar el plan de suscripción?
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onConfirmClose}>
              Cancelar
            </Button>
            <Button colorScheme="blue" ml={3} onClick={handleSubmit(onSubmit)}>
              Confirmar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdatePlanModal;
