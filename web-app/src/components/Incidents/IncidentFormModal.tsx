import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Select,
  Text,
  Textarea,
  FormErrorMessage,
} from "@chakra-ui/react";
import { FaUpload } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";

import incidentSchema from "./incidentSchema";
import { useTranslation } from "react-i18next";
import { Attachment, Incident } from "../../interfaces/Indicents";

interface IncidentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Incident) => void;
  initialData?: Incident | null;
  mode: "create" | "edit";
}

const IncidentFormModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode,
}: IncidentFormModalProps) => {
  const { t } = useTranslation();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [progress, setProgress] = useState(0);
  const [showProgressBox, setShowProgressBox] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Incident>({
    resolver: zodResolver(incidentSchema),
    defaultValues: initialData || {},
  });

  useEffect(() => {
    reset(initialData || {});
    if (initialData?.attachments) {
      setAttachments(initialData.attachments);
    }
  }, [initialData, reset]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newAttachments: Attachment[] = Array.from(files).map((file) => ({
      id: URL.createObjectURL(file),
      file_name: file.name,
      content_type: file.type,
      file_uri: URL.createObjectURL(file),
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);
    setShowProgressBox(true);

    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(oldProgress + 10, 100);
      });
    }, 400);
  };

  const onSubmit = (data: Incident) => {
    data.attachments = attachments;
    onSave(data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent maxW="600px">
        <ModalHeader>
          {mode === "edit"
            ? t("incidentScreen.tittle")
            : t("incidentScreen.tittle")}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Incident Type Field */}
            <FormControl isInvalid={!!errors.incidentType} mb={4}>
              <FormLabel>{t("incidentScreen.incidentType")}</FormLabel>
              <Select
                placeholder={t("incidentScreen.incidentTypePlaceholder")}
                {...register("incidentType")}
                defaultValue={initialData?.incidentType || ""}
              >
                <option value="technical">
                  {t("incidentScreen.incidentTypeSelectOne")}
                </option>
                <option value="billing">
                  {t("incidentScreen.incidentTypeSelectTwo")}
                </option>
                <option value="general">
                  {t("incidentScreen.incidentTypeSelectThree")}
                </option>
                <option value="security">
                  {t("incidentScreen.incidentTypeSelectFour")}
                </option>
                <option value="maintenance">
                  {t("incidentScreen.incidentTypeSelectFive")}
                </option>
              </Select>
              {errors.incidentType && (
                <FormErrorMessage>
                  {t(`incidentScreen.errors.incidentTypeRequired`)}
                </FormErrorMessage>
              )}
            </FormControl>

            {/* Incident Description Field */}
            <FormControl isInvalid={!!errors.incidentDescription} mb={4}>
              <FormLabel>{t("incidentScreen.incidentDescription")}</FormLabel>
              <Textarea
                h={60}
                placeholder={t("incidentScreen.incidentDescriptionPlaceholder")}
                maxLength={200}
                {...register("incidentDescription")}
              />
              {errors.incidentDescription && (
                <FormErrorMessage>
                  {t(`incidentScreen.errors.incidentDescriptionRequired`)}
                </FormErrorMessage>
              )}
            </FormControl>

            {/* Attachments Field */}
            <FormControl mb={4}>
              <FormLabel>{t("incidentScreen.attachment")}</FormLabel>
              <Button
                onClick={() => document.getElementById("fileInput")?.click()}
                rightIcon={<Icon as={FaUpload} />}
                width="65%"
                bg={"#6C728F"}
                colorScheme="blue"
              >
                {t("incidentScreen.attachment")}
              </Button>
              <Input
                multiple
                accept=".csv, .xls, .xlsx"
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
            </FormControl>

            {/* Progress Bar for Uploads */}
            {showProgressBox && (
              <Box bg={"#F6F8FA"} mt={4} w="100%" px={4} minH={16} pt={2}>
                {attachments.map((file) => (
                  <Text key={file.id}>{file.file_name}</Text>
                ))}
                <Progress
                  value={progress}
                  size="sm"
                  colorScheme="green"
                  mt={2}
                  borderRadius={4}
                />
              </Box>
            )}
          </form>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} mr={3}>
            {t("incidentScreen.modalAttachment.cancelButton")}
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit(onSubmit)}>
            {mode === "edit"
              ? t("incidentScreen.createIncident")
              : t("incidentScreen.createIncident")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default IncidentFormModal;
