import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { I18nextProvider } from "react-i18next";
import i18n from "../../internalization/i18n"; // Asegúrate de importar tu configuración de i18n
import IncidentDetailModal from "./IncidentDetailModal";
import { IncidentTableData } from "../../interfaces/Incidents";
import apiClient from "../../services/HttpClient";

// Mock del servicio apiClient
jest.mock("../../services/HttpClient");

const mockIncident: IncidentTableData = {
  id: "1",
  type: "technical",
  description: "Technical issue",
  attachments: [
    {
      id: "1",
      content_type: "application/pdf",
      file_name: "file1.pdf",
      file_uri: "http://example.com/file1.pdf",
    },
  ],
  contact: { phone: "123456789" },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  user_issuer_name: "John Doe",
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

  beforeEach(() => {
    jest.clearAllMocks();
    i18n.changeLanguage("es");
  });

  test("should render incident details", () => {
    renderWithProviders(
      <IncidentDetailModal
        isOpen={true}
        onClose={onClose}
        incident={mockIncident}
      />
    );

    expect(
      screen.getByText(i18n.t("incidentDetail.title", "Detalles del Incidente"))
    ).toBeInTheDocument();
    expect(
      screen.getByText(i18n.t("incidentDetail.id", "ID") + ":")
    ).toBeInTheDocument();
    expect(screen.getByText(mockIncident.id)).toBeInTheDocument();
    expect(
      screen.getByText(
        i18n.t("incidentDetail.description", "Descripción") + ":"
      )
    ).toBeInTheDocument();
    expect(screen.getByText(mockIncident.description)).toBeInTheDocument();
    expect(
      screen.getByText(i18n.t("incidentDetail.type", "Tipo") + ":")
    ).toBeInTheDocument();
    expect(screen.getByText(mockIncident.type)).toBeInTheDocument();
    expect(
      screen.getByText(i18n.t("incidentDetail.user", "Usuario") + ":")
    ).toBeInTheDocument();
    expect(screen.getByText(mockIncident.user_issuer_name)).toBeInTheDocument();
    expect(
      screen.getByText(i18n.t("incidentDetail.phone", "Teléfono") + ":")
    ).toBeInTheDocument();
    expect(screen.getByText(mockIncident.contact.phone)).toBeInTheDocument();
    expect(
      screen.getByText(
        i18n.t("incidentDetail.createdAt", "Fecha de Creación") + ":"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => {
        return (
          element?.textContent ===
          new Date(mockIncident.createdAt).toLocaleString()
        );
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        i18n.t("incidentDetail.attachments", "Archivos Adjuntos") + ":"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockIncident.attachments[0].file_name)
    ).toBeInTheDocument();
  });

  test("should call onClose when close button is clicked", () => {
    renderWithProviders(
      <IncidentDetailModal
        isOpen={true}
        onClose={onClose}
        incident={mockIncident}
      />
    );

    fireEvent.click(screen.getByText(i18n.t("incidentDetail.close", "Cerrar")));

    expect(onClose).toHaveBeenCalled();
  });

  test("should handle download button click", async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({
      data: { url: "http://example.com/file1.pdf" },
    });

    renderWithProviders(
      <IncidentDetailModal
        isOpen={true}
        onClose={onClose}
        incident={mockIncident}
      />
    );

    fireEvent.click(
      screen.getByText(i18n.t("incidentDetail.download", "Descargar"))
    );

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith(
        "/v1/incident/media/download-url",
        {
          media_id: mockIncident.attachments[0].id,
        }
      );
    });
  });
});
