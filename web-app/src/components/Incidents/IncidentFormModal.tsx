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
  Alert,
  AlertIcon,
  useToast,
  Badge,
} from "@chakra-ui/react";
import { FaUpload } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Attachment, Incident } from "../../interfaces/Incidents";
import useFileUpload from "../../hooks/uploadFile/useFileUpload";
import useIncidents from "../../hooks/incidents/useIncidents";
import incidentSchema from "./incidentSchema";
import useChannels from "../../hooks/channels/useChannels";
import Chat from "../../components/Chat/Chat";

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
  const toast = useToast();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showProgressBox, setShowProgressBox] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { createIncidentSession } = useChannels();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Incident>({
    resolver: zodResolver(incidentSchema),
    defaultValues: { type: "", description: "" },
  });

  useEffect(() => {
    reset(initialData || {});
    if (initialData?.attachments) {
      setAttachments(initialData.attachments);
    }
  }, [initialData, reset]);

  const handleChatButtonClick = () => {
    setShowChat(true);
  };

  const {
    getUploadUrl,
    uploadFile,
    uploadProgress,
    loading: fileLoading,
  } = useFileUpload();

  const {
    createIncident,
    updateIncident,
    loading: incidentLoading,
    error: incidentError,
  } = useIncidents();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    const newAttachments: Attachment[] = [];
    for (const file of files) {
      const isAcceptedType = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ].includes(file.type);

      if (!isAcceptedType) {
        toast({
          title: "Error",
          description: "Solo se permiten archivos de tipo Excel o CSV.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        continue;
      }

      const uploadData = await getUploadUrl(file.name, file.type);
      if (uploadData) {
        newAttachments.push({
          id: uploadData.media_id,
          file_name: uploadData.media_name,
          content_type: uploadData.content_type,
          file_uri: uploadData.upload_url,
          fileObject: file,
        });
      }
    }

    setAttachments((prev) => [...prev, ...newAttachments]);
    setShowProgressBox(true);
  };

  const onSubmit = async (data: Incident) => {
    if (mode === "edit" && initialData) {
      data.id = initialData.id;
    }
    const uploadedAttachments = [];

    try {
      for (const attachment of attachments) {
        if (attachment.fileObject && attachment.file_uri) {
          const success = await uploadFile(
            attachment.fileObject,
            attachment.file_uri
          );
          if (success) {
            uploadedAttachments.push({
              id: attachment.id,
              file_name: attachment.file_name,
              content_type: attachment.content_type,
              file_uri: attachment.file_uri,
            });
          } else {
            throw new Error(
              `Error al cargar el archivo: ${attachment.file_name}`
            );
          }
        }
      }

      data.attachments = uploadedAttachments;
      data.contact = { phone: "1234567890" };

      if (mode === "edit") {
        await updateIncident(data);
        toast({
          title: "Incidente actualizado",
          description: "El incidente se ha actualizado exitosamente.",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      } else {
        const res = await createIncident(data);
        console.log("Id del incidente", res?.id);
        if (res?.id) {
          await createIncidentSession(res.id);
        }
        toast({
          title: "Incidente creado",
          description: "El incidente se ha creado exitosamente.",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      }

      onSave(data);
      handleCloseModal();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Hubo un error inesperado.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setAttachments([]);
    setShowProgressBox(false);
    reset({ type: "", description: "" });
    onClose();
  };

  const handleCloseChat = () => {
    setShowChat(false);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleCloseModal} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent maxW="600px">
          <ModalHeader>
            {mode === "edit"
              ? t("incidents.tittleEdit")
              : t("incidents.tittle")}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {incidentError && (
              <Alert status="error" mb={4}>
                <AlertIcon />
                {incidentError}
              </Alert>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl isInvalid={!!errors.type} mb={4}>
                <FormLabel>{t("incidents.incidentType")}</FormLabel>
                <Select
                  placeholder={t("incidents.incidentTypePlaceholder")}
                  {...register("type")}
                  defaultValue={initialData?.type || ""}
                >
                  <option value="technical">
                    {t("incidents.incidentTypeSelectOne")}
                  </option>
                  <option value="billing">
                    {t("incidents.incidentTypeSelectTwo")}
                  </option>
                  <option value="general">
                    {t("incidents.incidentTypeSelectThree")}
                  </option>
                  <option value="security">
                    {t("incidents.incidentTypeSelectFour")}
                  </option>
                  <option value="maintenance">
                    {t("incidents.incidentTypeSelectFive")}
                  </option>
                </Select>
                {errors.type && (
                  <FormErrorMessage>
                    {t(`incidents.errors.typeRequired`)}
                  </FormErrorMessage>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.description} mb={4}>
                <FormLabel>{t("incidents.incidentDescription")}</FormLabel>
                <Textarea
                  h={60}
                  placeholder={t("incidents.incidentDescriptionPlaceholder")}
                  maxLength={200}
                  {...register("description")}
                />
                {errors.description && (
                  <FormErrorMessage>
                    {t(`incidents.errors.descriptionRequired`)}
                  </FormErrorMessage>
                )}
              </FormControl>

              {/* Mostrar archivos adjuntos previamente cargados */}
              {attachments.length > 0 && (
                <Box mb={4}>
                  <FormLabel>Archivos Adjuntos Cargados</FormLabel>
                  {attachments.map((attachment) => (
                    <Badge
                      key={attachment.id}
                      colorScheme="purple"
                      mr={3}
                      mb={3}
                    >
                      {attachment.file_name}
                    </Badge>
                  ))}
                </Box>
              )}

              <FormControl mb={4}>
                <FormLabel>{t("incidents.attachment")}</FormLabel>
                <Button
                  onClick={() => document.getElementById("fileInput")?.click()}
                  rightIcon={<Icon as={FaUpload} />}
                  width="65%"
                  bg={"#6C728F"}
                  colorScheme="blue"
                >
                  {t("incidents.attachment")}
                </Button>
                <Input
                  data-testid="file-input"
                  multiple
                  accept=".csv, .xls, .xlsx"
                  type="file"
                  id="fileInput"
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                />
              </FormControl>

              {showProgressBox && (
                <Box bg={"#F6F8FA"} mt={4} w="100%" px={4} minH={16} pt={2}>
                  {attachments.map((file) => (
                    <Text key={file.id}>{file.file_name}</Text>
                  ))}
                  <Progress
                    value={uploadProgress}
                    size="sm"
                    colorScheme="green"
                    mt={2}
                    borderRadius={4}
                  />
                </Box>
              )}
              {mode === "edit" && (
                <Button onClick={handleChatButtonClick} colorScheme="blue">
                  {t("chat.openChat")}
                </Button>
              )}
            </form>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleCloseModal} mr={3}>
              {t("incidents.modalAttachment.cancelButton")}
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmit(onSubmit)}
              isLoading={fileLoading || incidentLoading}
            >
              {mode === "edit"
                ? t("incidents.editIncident")
                : t("incidents.createIncident")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {showChat && initialData?.id && (
        <Modal isOpen={showChat} onClose={handleCloseChat} size="xl" isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Chat</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Chat incidentId={initialData.id} />
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleCloseChat}>Close Chat</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default IncidentFormModal;
