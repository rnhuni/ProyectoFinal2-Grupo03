import { render, screen, fireEvent } from "@testing-library/react";
import PlanDetailsModal from "./PlanDetailsModal";
import { ChakraProvider } from "@chakra-ui/react";
import { Plan } from "../../interfaces/Plan";
import { I18nextProvider } from "react-i18next";
import i18n from "../../internalization/i18n"; // Importa tu configuración de i18n

describe("PlanDetailsModal", () => {
  const onCloseMock = jest.fn();

  const mockPlan: Plan = {
    id: "1",
    name: "Plan Premium",
    features: ["Feature 1", "Feature 2", "Feature 3"],
    price: 99.99,
    status: "Active",
    description: "",
    roles: [],
  };

  const renderWithProviders = (ui: React.ReactNode) => {
    return render(
      <I18nextProvider i18n={i18n}>
        <ChakraProvider>{ui}</ChakraProvider>
      </I18nextProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    i18n.changeLanguage("es");
  });

  test("should not render modal when plan is null", () => {
    renderWithProviders(
      <PlanDetailsModal isOpen={true} onClose={onCloseMock} plan={null} />
    );

    // No debe renderizarse nada si el plan es null
    expect(screen.queryByText(/Detalles del Plan/i)).not.toBeInTheDocument();
  });

  test("should render modal with plan details when plan is provided", () => {
    renderWithProviders(
      <PlanDetailsModal isOpen={true} onClose={onCloseMock} plan={mockPlan} />
    );

    // Verificamos que el modal se muestra correctamente con los detalles del plan
    expect(
      screen.getByText(
        `${i18n.t("plans.details.title", "Detalles del Plan")}: ${
          mockPlan.name
        }`
      )
    ).toBeInTheDocument();
    expect(screen.getByText(mockPlan.name)).toBeInTheDocument();

    // Convertimos las características en un array, separándolas por comas si es un string
    const featuresArray = Array.isArray(mockPlan.features)
      ? mockPlan.features
      : mockPlan.features.split(", ");

    // Verificar que las características se muestren
    featuresArray.forEach((feature) => {
      expect(screen.getByText(`• ${feature}`)).toBeInTheDocument();
    });
  });

  test("should call onClose when close button is clicked", () => {
    renderWithProviders(
      <PlanDetailsModal isOpen={true} onClose={onCloseMock} plan={mockPlan} />
    );

    // Simulamos el clic en el botón de cierre
    fireEvent.click(
      screen.getByRole("button", {
        name: i18n.t("common.button.back", "Volver"),
      })
    );

    // Verificamos que la función onClose fue llamada
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test("should render correctly when there are no features", () => {
    const planWithoutFeatures: Plan = {
      ...mockPlan,
      features: [],
    };

    renderWithProviders(
      <PlanDetailsModal
        isOpen={true}
        onClose={onCloseMock}
        plan={planWithoutFeatures}
      />
    );

    // Verificar que el plan se renderiza sin características
    expect(
      screen.getByText(
        `${i18n.t("plans.details.title", "Detalles del Plan")}: ${
          mockPlan.name
        }`
      )
    ).toBeInTheDocument();
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument(); // No hay items en la lista
  });
});
