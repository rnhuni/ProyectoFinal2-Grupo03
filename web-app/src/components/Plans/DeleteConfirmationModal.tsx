import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ModalCloseButton,
  Icon,
  Text,
} from "@chakra-ui/react";
import { FaExclamationCircle } from "react-icons/fa";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  planName: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  planName,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">
          <Icon as={FaExclamationCircle} color="red.500" boxSize={8} mb={2} />
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody textAlign="center">
          <Text fontSize="lg" mb={4}>
            {`El plan "${planName}" está en uso. ¿Deseas eliminarlo?`}
          </Text>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button variant="outline" mr={3} onClick={onClose}>
            No
          </Button>
          <Button colorScheme="red" onClick={onConfirm}>
            Eliminar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmationModal;