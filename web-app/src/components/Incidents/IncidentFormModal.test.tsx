// src/components/Incidents/IncidentFormModal.test.tsx

import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
  within,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { ChakraProvider, useToast } from "@chakra-ui/react";
import { I18nextProvider } from "react-i18next";
import i18n from "../../internalization/i18n";
import IncidentFormModal from "./IncidentFormModal";
import { Incident } from "../../interfaces/Incidents";
import useFileUpload from "../../hooks/uploadFile/useFileUpload";
import useIncidents from "../../hooks/incidents/useIncidents";

// Mocks
jest.mock("../../hooks/uploadFile/useFileUpload");
jest.mock("../../hooks/incidents/useIncidents");
jest.mock("@chakra-ui/react", () => {
  const originalModule = jest.requireActual("@chakra-ui/react");
  return {
    __esModule: true,
    ...originalModule,
    useToast: jest.fn(),
  };
});

const toastMock = jest.fn();

const renderWithProviders = (ui: React.ReactNode) => {
  return render(
    <I18nextProvider i18n={i18n}>
      <ChakraProvider>{ui}</ChakraProvider>
    </I18nextProvider>
  );
};

describe("IncidentFormModal Component", () => {
  const onClose = jest.fn();
  const onSave = jest.fn();
  const createIncident = jest.fn();
  const updateIncident = jest.fn();
  const getUploadUrl = jest.fn();
  const uploadFile = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useToast as jest.Mock).mockReturnValue(toastMock);
    (useFileUpload as jest.Mock).mockReturnValue({
      getUploadUrl,
      uploadFile,
      uploadProgress: 0,
      loading: false,
    });
    (useIncidents as jest.Mock).mockReturnValue({
      createIncident,
      updateIncident,
      loading: false,
      error: null,
    });
    i18n.changeLanguage("es");
  });

  afterEach(() => {
    cleanup();
  });

  test("should render form fields and submit button", () => {
    renderWithProviders(
      <IncidentFormModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        initialData={null}
        mode="create"
      />
    );

    expect(
      screen.getByLabelText(
        i18n.t("incidentScreen.incidentType", "Tipo de incidente")
      )
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(
        i18n.t(
          "incidentScreen.incidentDescription",
          "Descripción del incidente"
        )
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: i18n.t("incidentScreen.attachment", "Adjuntar archivos"),
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: i18n.t("incidentScreen.modalAttachment.cancelButton", "Cancelar"),
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: i18n.t("incidentScreen.createIncident", "Crear incidente"),
      })
    ).toBeInTheDocument();
  });

  test("should call onSave and createIncident when form is submitted in create mode", async () => {
    renderWithProviders(
      <IncidentFormModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        initialData={null}
        mode="create"
      />
    );

    fireEvent.change(
      screen.getByLabelText(
        i18n.t("incidentScreen.incidentType", "Tipo de incidente")
      ),
      {
        target: { value: "technical" },
      }
    );

    fireEvent.change(
      screen.getByLabelText(
        i18n.t(
          "incidentScreen.incidentDescription",
          "Descripción del incidente"
        )
      ),
      {
        target: { value: "Test description" },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: i18n.t("incidentScreen.createIncident", "Crear incidente"),
      })
    );

    await waitFor(() => {
      expect(createIncident).toHaveBeenCalledWith({
        type: "technical",
        description: "Test description",
        attachments: [],
        contact: { phone: "1234567890" },
      });
      expect(onSave).toHaveBeenCalled();
    });
  });

  test("should call onSave and updateIncident when form is submitted in edit mode", async () => {
    const initialData: Incident = {
      id: "1",
      type: "technical",
      description: "Test description",
      attachments: [],
      contact: { phone: "1234567890" },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    renderWithProviders(
      <IncidentFormModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        initialData={initialData}
        mode="edit"
      />
    );

    fireEvent.change(
      screen.getByLabelText(
        i18n.t(
          "incidentScreen.incidentDescription",
          "Descripción del incidente"
        )
      ),
      {
        target: { value: "Updated description" },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: i18n.t("incidentScreen.editIncident", "Actualizar incidente"),
      })
    );

    await waitFor(() => {
      expect(updateIncident).toHaveBeenCalledWith(
        expect.objectContaining({
          type: initialData.type,
          description: "Updated description",
          attachments: [],
          contact: { phone: "1234567890" },
        })
      );
      expect(onSave).toHaveBeenCalled();
    });
  });

  test("should handle file uploads correctly", async () => {
    const file = new File(["dummy content"], "test.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    getUploadUrl.mockResolvedValue({
      media_id: "media123",
      media_name: "test.xlsx",
      content_type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      upload_url: "http://example.com/upload",
    });
    uploadFile.mockResolvedValue(true);

    renderWithProviders(
      <IncidentFormModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        initialData={null}
        mode="create"
      />
    );

    const uploadButton = screen.getByRole("button", {
      name: i18n.t("incidentScreen.attachment", "Adjuntar archivos"),
    });
    fireEvent.click(uploadButton);

    const fileInput = screen.getByTestId("file-input") as HTMLInputElement;

    Object.defineProperty(fileInput, "files", {
      value: [file],
    });
    fireEvent.change(fileInput);

    // Limitar la búsqueda al contenedor de archivos adjuntos
    await waitFor(() => {
      const attachmentsLabel = screen.getByText("Archivos Adjuntos Cargados");
      expect(attachmentsLabel).toBeInTheDocument();
      const attachmentsContainer = attachmentsLabel.parentElement;
      expect(attachmentsContainer).toBeInTheDocument();
      if (attachmentsContainer) {
        const { getByText } = within(attachmentsContainer);
        const badgeElement = getByText("test.xlsx");
        expect(badgeElement).toBeInTheDocument();
        // Opcional: Verificar que el Badge tiene la clase correcta
        expect(badgeElement).toHaveClass("chakra-badge");
      }
    });

    fireEvent.change(
      screen.getByLabelText(
        i18n.t("incidentScreen.incidentType", "Tipo de incidente")
      ),
      { target: { value: "technical" } }
    );
    fireEvent.change(
      screen.getByLabelText(
        i18n.t(
          "incidentScreen.incidentDescription",
          "Descripción del incidente"
        )
      ),
      { target: { value: "Test description with file" } }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: i18n.t("incidentScreen.createIncident", "Crear incidente"),
      })
    );

    await waitFor(() => {
      expect(uploadFile).toHaveBeenCalledWith(
        file,
        "http://example.com/upload"
      );
      expect(createIncident).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "technical",
          description: "Test description with file",
          attachments: [
            {
              id: "media123",
              file_name: "test.xlsx",
              content_type:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              file_uri: "http://example.com/upload",
            },
          ],
          contact: { phone: "1234567890" },
        })
      );
      expect(onSave).toHaveBeenCalled();
    });
  });

  test("should display error toast when uploadFile fails", async () => {
    const file = new File(["dummy content"], "test.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    getUploadUrl.mockResolvedValue({
      media_id: "media123",
      media_name: "test.xlsx",
      content_type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      upload_url: "http://example.com/upload",
    });

    // Mockear para lanzar el error esperado
    uploadFile.mockRejectedValue(
      new Error("Error al cargar el archivo: test.xlsx")
    );

    renderWithProviders(
      <IncidentFormModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        initialData={null}
        mode="create"
      />
    );

    const uploadButton = screen.getByRole("button", {
      name: i18n.t("incidentScreen.attachment", "Adjuntar archivos"),
    });
    fireEvent.click(uploadButton);

    const fileInput = screen.getByTestId("file-input") as HTMLInputElement;

    Object.defineProperty(fileInput, "files", {
      value: [file],
    });
    fireEvent.change(fileInput);

    // Limitar la búsqueda al contenedor de archivos adjuntos
    await waitFor(() => {
      const attachmentsLabel = screen.getByText("Archivos Adjuntos Cargados");
      expect(attachmentsLabel).toBeInTheDocument();

      const attachmentsContainer = attachmentsLabel.parentElement;
      expect(attachmentsContainer).toBeInTheDocument();

      if (attachmentsContainer) {
        const { getByText } = within(attachmentsContainer);
        const badgeElement = getByText("test.xlsx");
        expect(badgeElement).toBeInTheDocument();
        // Verificar que el elemento encontrado es un Badge
        expect(badgeElement.closest("span")).toHaveClass("chakra-badge");
      }
    });

    fireEvent.change(
      screen.getByLabelText(
        i18n.t("incidentScreen.incidentType", "Tipo de incidente")
      ),
      { target: { value: "technical" } }
    );
    fireEvent.change(
      screen.getByLabelText(
        i18n.t(
          "incidentScreen.incidentDescription",
          "Descripción del incidente"
        )
      ),
      { target: { value: "Test description with file" } }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: i18n.t("incidentScreen.createIncident", "Crear incidente"),
      })
    );

    await waitFor(() => {
      expect(uploadFile).toHaveBeenCalledWith(
        file,
        "http://example.com/upload"
      );

      // Asegurar que createIncident NO fue llamado
      expect(createIncident).not.toHaveBeenCalled();

      // Asegurar que onSave NO fue llamado
      expect(onSave).not.toHaveBeenCalled();

      // Verificar que el toast de error fue llamado correctamente
      expect(toastMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Error",
          description: "Error al cargar el archivo: test.xlsx",
          status: "error",
          duration: 4000,
          isClosable: true,
        })
      );

      // Asegurar que onClose fue llamado si es parte del manejo de errores
      expect(onClose).toHaveBeenCalled();
    });
  });

  test("should display error toast when createIncident fails", async () => {
    createIncident.mockRejectedValue(new Error("Error creating incident"));

    renderWithProviders(
      <IncidentFormModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        initialData={null}
        mode="create"
      />
    );

    fireEvent.change(
      screen.getByLabelText(
        i18n.t("incidentScreen.incidentType", "Tipo de incidente")
      ),
      { target: { value: "technical" } }
    );
    fireEvent.change(
      screen.getByLabelText(
        i18n.t(
          "incidentScreen.incidentDescription",
          "Descripción del incidente"
        )
      ),
      { target: { value: "Test description" } }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: i18n.t("incidentScreen.createIncident", "Crear incidente"),
      })
    );

    await waitFor(() => {
      expect(toastMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Error",
          description: "Error creating incident",
          status: "error",
          duration: 4000,
          isClosable: true,
        })
      );
      expect(onClose).toHaveBeenCalled();
    });
  });

  test("should display error when uploading an unsupported file type", async () => {
    const unsupportedFile = new File(["dummy content"], "test.txt", {
      type: "text/plain",
    });

    renderWithProviders(
      <IncidentFormModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        initialData={null}
        mode="create"
      />
    );

    const uploadButton = screen.getByRole("button", {
      name: i18n.t("incidentScreen.attachment", "Adjuntar archivos"),
    });
    fireEvent.click(uploadButton);

    const fileInput = screen.getByTestId("file-input") as HTMLInputElement;

    Object.defineProperty(fileInput, "files", {
      value: [unsupportedFile],
    });
    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(toastMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Error",
          description: "Solo se permiten archivos de tipo Excel o CSV.",
          status: "error",
          duration: 4000,
          isClosable: true,
        })
      );
    });
  });

  test("should call onClose when cancel button is clicked", () => {
    renderWithProviders(
      <IncidentFormModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        initialData={null}
        mode="create"
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: i18n.t("incidentScreen.modalAttachment.cancelButton", "Cancelar"),
      })
    );

    expect(onClose).toHaveBeenCalled();
  });
});
