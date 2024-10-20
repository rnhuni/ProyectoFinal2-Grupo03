import { render, screen, fireEvent } from "@testing-library/react";
import PlanDetailsModal from "./PlanDetailsModal";
import { ChakraProvider } from "@chakra-ui/react";
import { Plan } from "../../interfaces/Plan";

describe("PlanDetailsModal", () => {
  const onCloseMock = jest.fn();

  const mockPlan: Plan = {
    id: "1",
    name: "Plan Premium",
    features: ["Feature 1", "Feature 2", "Feature 3"],
    price: 99.99,
    status: "Active",
    description: "",
  };

  test("should not render modal when plan is null", () => {
    render(
      <ChakraProvider>
        <PlanDetailsModal isOpen={true} onClose={onCloseMock} plan={null} />
      </ChakraProvider>
    );

    // No debe renderizarse nada si el plan es null
    expect(screen.queryByText(/Detalles del Plan/i)).not.toBeInTheDocument();
  });

  test("should render modal with plan details when plan is provided", () => {
    render(
      <ChakraProvider>
        <PlanDetailsModal isOpen={true} onClose={onCloseMock} plan={mockPlan} />
      </ChakraProvider>
    );

    // Verificamos que el modal se muestra correctamente con los detalles del plan
    expect(
      screen.getByText(`Detalles del Plan: ${mockPlan.name}`)
    ).toBeInTheDocument();
    expect(screen.getByText(mockPlan.name)).toBeInTheDocument();

    // Verificar que las características se muestren
    mockPlan.features.forEach((feature) => {
      expect(screen.getByText(`• ${feature}`)).toBeInTheDocument();
    });
  });

  test("should call onClose when close button is clicked", () => {
    render(
      <ChakraProvider>
        <PlanDetailsModal isOpen={true} onClose={onCloseMock} plan={mockPlan} />
      </ChakraProvider>
    );

    // Simulamos el clic en el botón de cierre
    fireEvent.click(screen.getByRole("button", { name: /Volver/i }));

    // Verificamos que la función onClose fue llamada
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test("should render correctly when there are no features", () => {
    const planWithoutFeatures: Plan = {
      ...mockPlan,
      features: [],
    };

    render(
      <ChakraProvider>
        <PlanDetailsModal
          isOpen={true}
          onClose={onCloseMock}
          plan={planWithoutFeatures}
        />
      </ChakraProvider>
    );

    // Verificar que el plan se renderiza sin características
    expect(
      screen.getByText(`Detalles del Plan: ${mockPlan.name}`)
    ).toBeInTheDocument();
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument(); // No hay items en la lista
  });
});
