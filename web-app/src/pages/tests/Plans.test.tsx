import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Plans from "../Plans";
import { Plan } from "../../interfaces/Plan";
import usePlans from "../../hooks/plans/usePlans";
import { I18nextProvider } from "react-i18next";
import i18n from "../../internalization/i18n";

// Mock del hook usePlans
jest.mock("../../hooks/plans/usePlans");

const mockPlans: Plan[] = [
  {
    id: "1",
    name: "Plan Básico",
    description: "Un plan básico",
    price: 100,
    features: ["Feature 1", "Feature 2"],
    status: "active",
    roles: [],
  },
  {
    id: "2",
    name: "Plan Avanzado",
    description: "Un plan avanzado",
    price: 200,
    features: ["Feature 3", "Feature 4"],
    status: "inactive",
    roles: [],
  },
];

const renderWithProviders = (ui: React.ReactNode) => {
  return render(
    <I18nextProvider i18n={i18n}>
      <ChakraProvider>{ui}</ChakraProvider>
    </I18nextProvider>
  );
};

describe("Plans Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (usePlans as jest.Mock).mockReturnValue({
      plans: mockPlans,
      loading: false,
      error: null,
      reloadPlans: jest.fn(),
      createPlan: jest.fn(),
      updatePlan: jest.fn(),
      deletePlan: jest.fn(),
    });
  });

  test("should render plans table", () => {
    renderWithProviders(<Plans />);

    expect(screen.getByText("Plan Básico")).toBeInTheDocument();
    expect(screen.getByText("Plan Avanzado")).toBeInTheDocument();
  });

  test("should open form modal in edit mode", () => {
    renderWithProviders(<Plans />);

    fireEvent.click(
      screen.getAllByLabelText(i18n.t("plans.edit", "Editar"))[0]
    );

    expect(
      screen.getByText(i18n.t("plans.modal.edit", "Editar plan de suscripción"))
    ).toBeInTheDocument();
  });

  test("should apply filters", () => {
    renderWithProviders(<Plans />);

    fireEvent.click(screen.getByText(i18n.t("plans.filter", "Filtrar")));

    fireEvent.change(
      screen.getByLabelText(i18n.t("plans.search_field", "Campo de búsqueda")),
      {
        target: { value: "Básico" },
      }
    );

    fireEvent.click(
      screen.getByText(i18n.t("plans.apply_filter", "Aplicar Filtro"))
    );

    expect(screen.getByText("Plan Básico")).toBeInTheDocument();
    expect(screen.queryByText("Plan Avanzado")).not.toBeInTheDocument();
  });

  test("should clear filters", () => {
    renderWithProviders(<Plans />);

    fireEvent.click(screen.getByText(i18n.t("plans.filter", "Filtrar")));

    fireEvent.change(
      screen.getByLabelText(i18n.t("plans.search_field", "Campo de búsqueda")),
      {
        target: { value: "Básico" },
      }
    );

    fireEvent.click(
      screen.getByText(i18n.t("plans.apply_filter", "Aplicar Filtro"))
    );

    fireEvent.click(
      screen.getByText(i18n.t("plans.clear_filters", "Limpiar Filtros"))
    );

    expect(screen.getByText("Plan Básico")).toBeInTheDocument();
    expect(screen.getByText("Plan Avanzado")).toBeInTheDocument();
  });

  test("should open and close details modal", () => {
    renderWithProviders(<Plans />);

    fireEvent.click(
      screen.getAllByLabelText(i18n.t("plans.details", "Detalles"))[0]
    );

    expect(
      screen.getByText(i18n.t("plans.details", "Detalles"))
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText(i18n.t("plans.close", "Cerrar")));

    expect(
      screen.queryByText(i18n.t("plans.details", "Detalles"))
    ).not.toBeInTheDocument();
  });

  test("should delete a plan", () => {
    renderWithProviders(<Plans />);

    fireEvent.click(
      screen.getAllByLabelText(i18n.t("plans.delete", "Eliminar"))[0]
    );

    expect(
      screen.getByText(
        i18n.t(
          "plans.delete_confirmation",
          "¿Estás seguro de que deseas eliminar este plan?"
        )
      )
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText(i18n.t("plans.delete", "Eliminar")));

    expect(screen.queryByText("Plan Básico")).not.toBeInTheDocument();
  });

  test("should show loading spinner", () => {
    (usePlans as jest.Mock).mockReturnValue({
      plans: [],
      loading: true,
      error: null,
      reloadPlans: jest.fn(),
      createPlan: jest.fn(),
      updatePlan: jest.fn(),
      deletePlan: jest.fn(),
    });

    renderWithProviders(<Plans />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  test("should show error message", () => {
    (usePlans as jest.Mock).mockReturnValue({
      plans: [],
      loading: false,
      error: "Error loading plans",
      reloadPlans: jest.fn(),
      createPlan: jest.fn(),
      updatePlan: jest.fn(),
      deletePlan: jest.fn(),
    });

    renderWithProviders(<Plans />);

    expect(screen.getByText("Error loading plans")).toBeInTheDocument();
  });

  test("renders correctly", () => {
    const { getByText } = renderWithProviders(<Plans />);

    // Verificar que el texto "Planes Disponibles" esté en el componente usando i18n
    expect(getByText(i18n.t("plans.title", "Planes Disponibles"))).toBeTruthy();
  });
});
