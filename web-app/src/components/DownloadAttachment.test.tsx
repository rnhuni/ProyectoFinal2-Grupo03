// DownloadAttachment.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DownloadAttachment from "./DownloadAttachment";
import apiClient from "../services/HttpClient";
import { ChakraProvider } from "@chakra-ui/react";

// Mock de apiClient
jest.mock("../services/HttpClient");
const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe("DownloadAttachment Component", () => {
  const mockAttachmentInfo = {
    id: "attachment-id",
    file_name: "test-file.pdf",
    content_type: "application/pdf",
    file_uri: "https://example.com/test-file.pdf",
  };

  const mockIncidentId = "incident-id";

  beforeEach(() => {
    // Restaurar todos los mocks antes de cada prueba
    jest.clearAllMocks();

    // Mock de localStorage si es necesario
    Storage.prototype.getItem = jest.fn(() => "mocked_token");
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test("se renderiza correctamente", () => {
    render(
      <ChakraProvider>
        <DownloadAttachment
          attachmentInfo={mockAttachmentInfo}
          incidentId={mockIncidentId}
        />
      </ChakraProvider>
    );

    const button = screen.getByRole("button", { name: /Descargar Archivo/i });
    expect(button).toBeInTheDocument();
  });

  test("inicia el proceso de descarga al hacer clic en el botón", async () => {
    // Mock de apiClient.get
    mockedApiClient.get.mockResolvedValueOnce({
      data: { url: "https://example.com/test-file.pdf" },
    });

    // Guardar la implementación original de createElement
    const originalCreateElement = document.createElement;

    // Mock de createElement para elementos <a>
    const createElementSpy = jest
      .spyOn(document, "createElement")
      .mockImplementation((tagName: string) => {
        if (tagName === "a") {
          const anchorElement = originalCreateElement.call(document, "a");
          anchorElement.click = jest.fn();
          return anchorElement;
        }
        return originalCreateElement.call(document, tagName);
      });

    const appendChildSpy = jest.spyOn(document.body, "appendChild");
    const removeChildSpy = jest.spyOn(document.body, "removeChild");

    render(
      <ChakraProvider>
        <DownloadAttachment
          attachmentInfo={mockAttachmentInfo}
          incidentId={mockIncidentId}
        />
      </ChakraProvider>
    );

    const button = screen.getByRole("button", { name: /Descargar Archivo/i });
    fireEvent.click(button);

    // Verificar que el botón muestra el estado de carga
    expect(button).toHaveTextContent("Descargando");
    expect(button).toBeDisabled();

    // Esperar a que se llame a la API con los parámetros correctos
    await waitFor(() => {
      expect(mockedApiClient.get).toHaveBeenCalledWith(
        `/incident/incidents/${mockIncidentId}/attachments/${mockAttachmentInfo.id}`
      );
    });

    // Verificar que se crea y manipula el elemento <a>
    expect(createElementSpy).toHaveBeenCalledWith("a");
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();

    // Verificar que el mensaje de éxito aparece en el DOM
    const successToast = await screen.findByText(
      "El archivo se está descargando."
    );
    expect(successToast).toBeInTheDocument();

    // Restaurar la implementación original de createElement
    createElementSpy.mockRestore();
  });

  test("maneja el error cuando falla la descarga", async () => {
    // Mock de apiClient.get para rechazar la promesa
    mockedApiClient.get.mockRejectedValueOnce(new Error("Network Error"));

    render(
      <ChakraProvider>
        <DownloadAttachment
          attachmentInfo={mockAttachmentInfo}
          incidentId={mockIncidentId}
        />
      </ChakraProvider>
    );

    const button = screen.getByRole("button", { name: /Descargar Archivo/i });
    fireEvent.click(button);

    // Verificar que el botón muestra el estado de carga
    expect(button).toHaveTextContent("Descargando");
    expect(button).toBeDisabled();

    // Esperar a que se llame a la API
    await waitFor(() => {
      expect(mockedApiClient.get).toHaveBeenCalled();
    });

    // Verificar que el mensaje de error aparece en el DOM
    const errorToast = await screen.findByText(
      "No se pudo descargar el archivo. Inténtelo nuevamente."
    );
    expect(errorToast).toBeInTheDocument();

    // Verificar que el botón vuelve a su estado original
    await waitFor(() => {
      expect(button).not.toBeDisabled();
      expect(button).toHaveTextContent("Descargar Archivo");
    });
  });

  test("gestiona correctamente el estado de carga", async () => {
    // Mock de apiClient.get
    mockedApiClient.get.mockResolvedValueOnce({
      data: { url: "https://example.com/test-file.pdf" },
    });

    // Guardar la implementación original de createElement
    const originalCreateElement = document.createElement;

    // Mock de createElement para elementos <a>
    const createElementSpy = jest
      .spyOn(document, "createElement")
      .mockImplementation((tagName: string) => {
        if (tagName === "a") {
          const anchorElement = originalCreateElement.call(document, "a");
          anchorElement.click = jest.fn();
          return anchorElement;
        }
        return originalCreateElement.call(document, tagName);
      });

    const appendChildSpy = jest.spyOn(document.body, "appendChild");
    const removeChildSpy = jest.spyOn(document.body, "removeChild");

    render(
      <ChakraProvider>
        <DownloadAttachment
          attachmentInfo={mockAttachmentInfo}
          incidentId={mockIncidentId}
        />
      </ChakraProvider>
    );

    const button = screen.getByRole("button", { name: /Descargar Archivo/i });
    expect(button).not.toBeDisabled();

    fireEvent.click(button);

    // Verificar que el botón muestra el texto de carga y está deshabilitado
    expect(button).toHaveTextContent("Descargando");
    expect(button).toBeDisabled();

    // Esperar a que se llame a la API
    await waitFor(() => {
      expect(mockedApiClient.get).toHaveBeenCalled();
    });

    // Verificar que el botón se habilita nuevamente y muestra el texto original
    await waitFor(() => {
      expect(button).not.toBeDisabled();
      expect(button).toHaveTextContent("Descargar Archivo");
    });

    // Validar que se creó y eliminó el elemento <a>
    expect(createElementSpy).toHaveBeenCalledWith("a");
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();

    // Restaurar la implementación original de createElement
    createElementSpy.mockRestore();
  });
});
