import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  List,
  ListItem,
} from "@chakra-ui/react";
import { Plan } from "../../interfaces/Plan";

interface PlanDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null; // Puede ser nulo si no hay plan seleccionado
}

const PlanDetailsModal: React.FC<PlanDetailsModalProps> = ({
  isOpen,
  onClose,
  plan,
}) => {
  if (!plan) {
    return null; // No renderizar el modal si no hay plan seleccionado
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{`Detalles del Plan: ${plan.name}`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontWeight="bold" mb={2}>
            {plan.name}
          </Text>
          <List spacing={2}>
            {/* Lista de características del plan */}
            {plan.features?.split(",").map((feature, index) => (
              <ListItem key={index}>• {feature.trim()}</ListItem>
            ))}
          </List>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={onClose}>
            Volver
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PlanDetailsModal;
