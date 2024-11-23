import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { I18nextProvider } from "react-i18next";
import i18n from "../../internalization/i18n"; // Asegúrate de importar tu configuración de i18n
import Incidents from "../Incidents";
import useIncidents from "../../hooks/incidents/useIncidents";
import { IncidentTableData } from "../../interfaces/Incidents";

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
    user_issuer_id: "",
    assigned_to_id: "",
    closed_by_id: undefined,
    status: "open",
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
    user_issuer_id: "",
    assigned_to_id: "123",
    closed_by_id: "",
    status: "assigned",
  },
];

const renderWithProviders = (ui: React.ReactNode) => {
  return render(
    <I18nextProvider i18n={i18n}>
      <ChakraProvider>{ui}</ChakraProvider>
    </I18nextProvider>
  );
};

describe("Incidents Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useIncidents as jest.Mock).mockReturnValue({
      incidents: mockIncidents,
      loading: false,
      error: null,
      reloadIncidents: jest.fn(),
      createIncident: jest.fn(),
      updateIncident: jest.fn(),
      claimIncident: jest.fn(),
      closeIncident: jest.fn(),
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

  test("should show loading spinner when loading", () => {
    (useIncidents as jest.Mock).mockReturnValue({
      incidents: [],
      loading: true,
      error: null,
      reloadIncidents: jest.fn(),
      createIncident: jest.fn(),
      updateIncident: jest.fn(),
    });

    renderWithProviders(<Incidents />);
    expect(screen.getByRole("status")).toBeInTheDocument(); // Verifica el spinner
  });

  test("should show error message when there is an error", () => {
    (useIncidents as jest.Mock).mockReturnValue({
      incidents: [],
      loading: false,
      error: "Error loading incidents",
      reloadIncidents: jest.fn(),
      createIncident: jest.fn(),
      updateIncident: jest.fn(),
    });

    renderWithProviders(<Incidents />);
    expect(screen.getByText("Error loading incidents")).toBeInTheDocument();
  });

  test("should open the form modal when create button is clicked", () => {
    renderWithProviders(<Incidents />);

    fireEvent.click(
      screen.getByText(i18n.t("incidents.create", "Crear Incidente"))
    );
    expect(
      screen.getByText(i18n.t("common.button.save", "Guardar"))
    ).toBeInTheDocument();
  });

  test("should call handleEdit when edit button is clicked", () => {
    renderWithProviders(<Incidents />);

    fireEvent.click(screen.getAllByLabelText("Edit incident")[0]);
    expect(screen.getByText("Guardar")).toBeInTheDocument();
  });

  test("should call handleViewDetails when view details button is clicked", () => {
    renderWithProviders(<Incidents />);

    fireEvent.click(screen.getAllByLabelText("View details incident")[0]);
    expect(
      screen.getByText(i18n.t("incidents.details", "Detalles"))
    ).toBeInTheDocument();
  });

  test("should open confirm modal when assign button is clicked", () => {
    renderWithProviders(<Incidents />);

    fireEvent.click(screen.getAllByLabelText("Assign incident")[0]);
    expect(
      screen.getByText(i18n.t("confirmation.title", "Confirmación de Acción"))
    ).toBeInTheDocument();
  });

  test("should open confirm modal when close button is clicked", () => {
    renderWithProviders(<Incidents />);

    fireEvent.click(screen.getAllByLabelText("Close incident")[0]);
    expect(
      screen.getByText(i18n.t("confirmation.title", "Confirmación de Acción"))
    ).toBeInTheDocument();
  });

  test("should not show assign button if assigned_to_id exists", () => {
    renderWithProviders(<Incidents />);

    // Incidente 2 tiene assigned_to_id, no debería mostrar el botón "Assign"
    expect(screen.queryAllByLabelText("Assign incident")[1]).toBeUndefined();
  });

  test("should not show close button if closed_by_id exists", () => {
    renderWithProviders(<Incidents />);

    // Si cerramos el incidente 2, no debería mostrar el botón "Close"
    fireEvent.click(screen.getAllByLabelText("Close incident")[0]);
    expect(screen.queryAllByLabelText("Close incident")[1]).toBeUndefined();
  });
});
