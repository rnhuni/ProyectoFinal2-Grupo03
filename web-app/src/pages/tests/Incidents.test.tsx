import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { I18nextProvider } from "react-i18next";

import Incidents from "../Incidents";
import useIncidents from "../../hooks/incidents/useIncidents";
import { IncidentTableData } from "../../interfaces/Incidents";
import i18n from "../../internalization/i18n";

// Mock del hook useIncidents
jest.mock("../../hooks/incidents/useIncidents");

const mockIncidents: IncidentTableData[] = [
  {
    id: "1",
    type: "technical",
    description: "Technical issue",
    attachments: [],
    contact: { phone: "123456789" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user_issuer_name: "John Doe",
  },
  {
    id: "2",
    type: "billing",
    description: "Billing issue",
    attachments: [],
    contact: { phone: "987654321" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user_issuer_name: "Jane Doe",
  },
];

const renderWithProviders = (ui: React.ReactNode) => {
  return render(
    <I18nextProvider i18n={i18n}>
      <ChakraProvider>{ui}</ChakraProvider>
    </I18nextProvider>
  );
};

describe("Incidents Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useIncidents as jest.Mock).mockReturnValue({
      incidents: mockIncidents,
      loading: false,
      error: null,
      reloadIncidents: jest.fn(),
      createIncident: jest.fn(),
      updateIncident: jest.fn(),
    });
  });

  test("should render incidents table", () => {
    renderWithProviders(<Incidents />);

    expect(
      screen.getByText(i18n.t("incidents.title", "Gestión de Incidentes"))
    ).toBeInTheDocument();
    expect(screen.getByText("Technical issue")).toBeInTheDocument();
    expect(screen.getByText("Billing issue")).toBeInTheDocument();
  });

  test("should open form modal in create mode", () => {
    renderWithProviders(<Incidents />);

    fireEvent.click(
      screen.getByText(i18n.t("incidents.create", "Crear Incidente"))
    );

    // Verifica que el botón de crear incidente fue clicado
    expect(
      screen.getByText(i18n.t("incidents.create", "Crear Incidente"))
    ).toBeInTheDocument();
  });

  test("should open form modal in edit mode", () => {
    renderWithProviders(<Incidents />);

    fireEvent.click(screen.getAllByLabelText("Edit incident")[0]);

    // Verifica que el botón de editar incidente fue clicado
    expect(screen.getAllByLabelText("Edit incident")[0]).toBeInTheDocument();
  });

  test("should call reloadIncidents when form modal is closed", () => {
    const { reloadIncidents } = useIncidents();

    renderWithProviders(<Incidents />);

    fireEvent.click(
      screen.getByText(i18n.t("incidents.create", "Crear Incidente"))
    );
    fireEvent.click(
      screen.getByText(i18n.t("common.button.cancel", "Cancelar"))
    );

    expect(reloadIncidents).toHaveBeenCalled();
  });
});
