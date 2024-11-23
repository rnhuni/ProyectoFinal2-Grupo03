import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { I18nextProvider } from "react-i18next";
import { ChakraProvider } from "@chakra-ui/react";
import i18n from "../../internalization/i18n";
import IncidentDetailModal from "./IncidentDetailModal";
import { IncidentTableData } from "../../interfaces/Incidents";
import apiClient from "../../services/HttpClient";
// Mock del módulo HttpClient
jest.mock("../../services/HttpClient", () => ({
  get: jest.fn(),
  post: jest.fn(),
  interceptors: {
    request: { use: jest.fn(), eject: jest.fn() },
    response: { use: jest.fn(), eject: jest.fn() },
  },
}));

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

const mockIncident: IncidentTableData = {
  id: "1",
  type: "technical",
  description: "Problema técnico",
  attachments: [],
  contact: { phone: "123456789" },
  createdAt: "2024-11-08T21:02:00.000Z",
  updatedAt: "2024-11-08T21:02:00.000Z",
  user_issuer_name: "Juan Pérez",
  user_issuer_id: "",
};

const renderWithProviders = (ui: React.ReactNode) => {
  return render(
    <I18nextProvider i18n={i18n}>
      <ChakraProvider>{ui}</ChakraProvider>
    </I18nextProvider>
  );
};

describe("IncidentDetailModal Component", () => {
  const onClose = jest.fn();

  beforeAll(() => {
    jest
      .spyOn(Date.prototype, "toLocaleString")
      .mockImplementation(function () {
        return "08/11/2024, 21:02:00";
      });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("id_token", "mocked_token");
    i18n.changeLanguage("es");
  });

  afterEach(() => {
    localStorage.clear();
  });

  test("renderiza correctamente los detalles del incidente", async () => {
    mockedApiClient.get.mockResolvedValueOnce({ data: [] });

    const formattedDate = "08/11/2024, 21:02:00";

    renderWithProviders(
      <IncidentDetailModal
        isOpen={true}
        onClose={onClose}
        incident={mockIncident}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Detalles del Incidente")).toBeInTheDocument();
      expect(screen.getByText("ID:")).toBeInTheDocument();
      expect(screen.getByText(mockIncident.id)).toBeInTheDocument();
      expect(screen.getByText("Descripción:")).toBeInTheDocument();
      expect(screen.getByText(mockIncident.description)).toBeInTheDocument();
      expect(screen.getByText("Tipo:")).toBeInTheDocument();
      expect(screen.getByText(mockIncident.type)).toBeInTheDocument();
      expect(screen.getByText("Usuario:")).toBeInTheDocument();
      expect(
        screen.getByText(mockIncident.user_issuer_name)
      ).toBeInTheDocument();
      expect(screen.getByText("Teléfono:")).toBeInTheDocument();
      expect(screen.getByText(mockIncident.contact.phone)).toBeInTheDocument();
      expect(screen.getByText("Fecha de Creación:")).toBeInTheDocument();
      expect(screen.getByText(formattedDate)).toBeInTheDocument();
    });
  });

  test("muestra estado de carga al obtener los archivos adjuntos", () => {
    mockedApiClient.get.mockImplementation(() => new Promise(() => {}));

    renderWithProviders(
      <IncidentDetailModal
        isOpen={true}
        onClose={onClose}
        incident={mockIncident}
      />
    );

    expect(
      screen.getByText("Cargando archivos adjuntos...")
    ).toBeInTheDocument();
  });

  test("muestra mensaje cuando no hay archivos adjuntos", async () => {
    mockedApiClient.get.mockResolvedValueOnce({ data: [] });

    renderWithProviders(
      <IncidentDetailModal
        isOpen={true}
        onClose={onClose}
        incident={mockIncident}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("No hay archivos adjuntos")).toBeInTheDocument();
    });
  });

  test("llama a onClose al hacer clic en el botón de cerrar", () => {
    mockedApiClient.get.mockResolvedValueOnce({ data: [] });

    renderWithProviders(
      <IncidentDetailModal
        isOpen={true}
        onClose={onClose}
        incident={mockIncident}
      />
    );

    fireEvent.click(screen.getByText("Cerrar"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  //   // Simular un rechazo en la llamada a la API
  //   mockedApiClient.get.mockRejectedValueOnce(new Error("Error"));

  //   // Crear el mock de useToast con todos los métodos necesarios
  //   const mockToast = Object.assign(jest.fn(), {
  //     update: jest.fn(),
  //     promise: jest.fn(),
  //     closeAll: jest.fn(),
  //     close: jest.fn(),
  //     isActive: jest.fn(),
  //   }) as ReturnType<typeof Chakra.useToast>;

  //   // Mockear useToast para que retorne mockToast
  //   jest.spyOn(Chakra, "useToast").mockReturnValue(mockToast);

  //   console.log("Antes de renderizar el componente");

  //   // Renderizar el componente
  //   renderWithProviders(
  //     <IncidentDetailModal
  //       isOpen={true}
  //       onClose={onClose}
  //       incident={mockIncident}
  //     />
  //   );

  //   console.log("Después de renderizar el componente");

  //   // Espera a que el mensaje de error aparezca en el DOM
  //   const errorMessage = await screen.findByText(
  //     "No se pudieron cargar los archivos adjuntos."
  //   );
  //   console.log("Dentro de waitFor");
  //   screen.debug(); // Imprime el DOM actual en la consola
  //   expect(errorMessage).toBeInTheDocument();

  //   console.log("Antes de verificar mockToast");

  //   // Verifica que mockToast se haya llamado con los parámetros correctos
  //   expect(mockToast).toHaveBeenCalledWith({
  //     title: "Error al obtener los archivos adjuntos",
  //     description: "No se pudieron cargar los archivos adjuntos.",
  //     status: "error",
  //     duration: 3000,
  //     isClosable: true,
  //   });

  //   console.log("Después de verificar mockToast");
  // });
  test("maneja error al obtener los archivos adjuntos", async () => {
    mockedApiClient.get.mockRejectedValueOnce(new Error("Error"));

    renderWithProviders(
      <IncidentDetailModal
        isOpen={true}
        onClose={onClose}
        incident={mockIncident}
      />
    );

    const toastTitle = await screen.findByText(
      "Error al obtener los archivos adjuntos"
    );
    const toastDescription = await screen.findByText(
      "No se pudieron cargar los archivos adjuntos."
    );

    expect(toastTitle).toBeInTheDocument();
    expect(toastDescription).toBeInTheDocument();

    const alert = await screen.findByRole("status");
    expect(alert).toBeInTheDocument();
  });

  test("renderiza correctamente los archivos adjuntos", async () => {
    const incidentWithAttachments = {
      ...mockIncident,
      attachments: [
        {
          id: "file1",
          filename: "archivo1.pdf",
          url: "/path/to/archivo1.pdf",
          content_type: "application/pdf",
          file_name: "archivo1.pdf",
          file_uri: "/path/to/archivo1.pdf",
        },
        {
          id: "file2",
          filename: "imagen1.jpg",
          url: "/path/to/imagen1.jpg",
          content_type: "image/jpeg",
          file_name: "imagen1.jpg",
          file_uri: "/path/to/imagen1.jpg",
        },
      ],
    };

    mockedApiClient.get.mockResolvedValueOnce({
      data: incidentWithAttachments.attachments,
    });

    renderWithProviders(
      <IncidentDetailModal
        isOpen={true}
        onClose={onClose}
        incident={incidentWithAttachments}
      />
    );

    for (const attachment of incidentWithAttachments.attachments) {
      const attachmentElement = await screen.findByText(attachment.filename);
      expect(attachmentElement).toBeInTheDocument();
    }
  });
});
