// Plans.test.tsx

import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import Plans from "../Plans";
import usePlans from "../../hooks/plans/usePlans";

// Mockeamos los hooks y componentes necesarios
jest.mock("../../hooks/plans/usePlans");
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue || key,
  }),
}));

jest.mock("../../components/Plans/PlanFilterDrawer", () => ({
  __esModule: true,
  default: jest.fn(({ applyFilters }: any) => (
    <div data-testid="plan-filter-drawer">
      <button
        onClick={() => applyFilters({ field: "name", searchValue: "Plan A" })}
      >
        Aplicar Filtro
      </button>
    </div>
  )),
}));

jest.mock("../../components/Plans/PlanFormModal", () => ({
  __esModule: true,
  default: jest.fn(({ isOpen, onSave, plan, mode }: any) => {
    return isOpen ? (
      <div data-testid="plan-form-modal">
        <div>{`Modo: ${mode}`}</div>
        <div>{`Nombre del Plan: ${plan ? plan.name : ""}`}</div>
        <button
          onClick={() =>
            onSave(
              mode === "edit"
                ? { ...plan, name: "Plan Actualizado" }
                : {
                    id: "3",
                    name: "Plan Nuevo",
                    description: "Descripción Nueva",
                    status: "Activo",
                    price: 29.99,
                    features: ["Característica Nueva"],
                  }
            )
          }
        >
          Guardar Plan
        </button>
      </div>
    ) : null;
  }),
}));

jest.mock("../../components/Plans/PlanDetailsModal", () => ({
  __esModule: true,
  default: jest.fn(({ isOpen, onClose, plan }: any) => {
    return isOpen ? (
      <div data-testid="plan-details-modal">
        <div>{`Nombre del Plan: ${plan ? plan.name : ""}`}</div>
        <button onClick={onClose}>Cerrar Detalles</button>
      </div>
    ) : null;
  }),
}));

jest.mock("../../components/DeleteConfirmationModal", () => ({
  __esModule: true,
  default: jest.fn(({ isOpen, onClose, onConfirm, itemName }: any) => {
    return isOpen ? (
      <div data-testid="delete-confirmation-modal">
        <div>{`Nombre del Item: ${itemName}`}</div>
        <button onClick={onConfirm}>Confirmar Eliminación</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    ) : null;
  }),
}));

describe("Componente Plans", () => {
  const mockUsePlans = usePlans as jest.MockedFunction<typeof usePlans>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debe llamar a reloadPlans al montar el componente", () => {
    const mockReloadPlans = jest.fn();

    mockUsePlans.mockReturnValue({
      plans: [],
      loading: false,
      error: "",
      reloadPlans: mockReloadPlans,
      createPlan: jest.fn(),
      updatePlan: jest.fn(),
      deletePlan: jest.fn(),
      plan: null,
      assignPlanToClient: jest.fn(),
      getPlanById: jest.fn(),
    });

    render(<Plans />);

    expect(mockReloadPlans).toHaveBeenCalledTimes(1);
  });

  it("debe mostrar el spinner de carga cuando loading es true", () => {
    mockUsePlans.mockReturnValue({
      plans: [],
      loading: true,
      error: "",
      reloadPlans: jest.fn(),
      createPlan: jest.fn(),
      updatePlan: jest.fn(),
      deletePlan: jest.fn(),
      plan: null,
      assignPlanToClient: jest.fn(),
      getPlanById: jest.fn(),
    });

    render(<Plans />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("debe mostrar mensaje de error cuando hay un error", () => {
    mockUsePlans.mockReturnValue({
      plans: [],
      loading: false,
      error: "Error al cargar los planes",
      reloadPlans: jest.fn(),
      createPlan: jest.fn(),
      updatePlan: jest.fn(),
      deletePlan: jest.fn(),
      plan: null,
      assignPlanToClient: jest.fn(),
      getPlanById: jest.fn(),
    });

    render(<Plans />);

    expect(screen.getByText("Error al cargar los planes")).toBeInTheDocument();
  });

  it("debe renderizar la tabla de planes cuando hay planes disponibles", () => {
    const plans = [
      {
        id: "1",
        name: "Plan A",
        description: "Descripción A",
        status: "Activo",
        price: 9.99,
        features: ["Característica 1", "Característica 2"],
        roles: [],
      },
      {
        id: "2",
        name: "Plan B",
        description: "Descripción B",
        status: "Inactivo",
        price: 19.99,
        features: ["Característica 3", "Característica 4"],
        roles: [],
      },
    ];

    mockUsePlans.mockReturnValue({
      plans,
      loading: false,
      error: "",
      reloadPlans: jest.fn(),
      createPlan: jest.fn(),
      updatePlan: jest.fn(),
      deletePlan: jest.fn(),
      plan: null,
      assignPlanToClient: jest.fn(),
      getPlanById: jest.fn(),
    });

    render(<Plans />);

    expect(screen.getByText("Plan A")).toBeInTheDocument();
    expect(screen.getByText("Descripción A")).toBeInTheDocument();
    expect(screen.getByText("Plan B")).toBeInTheDocument();
    expect(screen.getByText("Descripción B")).toBeInTheDocument();
  });

  it('debe abrir el modal de creación de plan al hacer clic en el botón "Crear Plan"', () => {
    mockUsePlans.mockReturnValue({
      plans: [],
      loading: false,
      error: "",
      reloadPlans: jest.fn(),
      createPlan: jest.fn(),
      updatePlan: jest.fn(),
      deletePlan: jest.fn(),
      plan: null,
      assignPlanToClient: jest.fn(),
      getPlanById: jest.fn(),
    });

    render(<Plans />);

    const createButton = screen.getByText("Crear Plan");
    fireEvent.click(createButton);

    expect(screen.getByTestId("plan-form-modal")).toBeInTheDocument();
    expect(screen.getByText("Modo: create")).toBeInTheDocument();
  });

  it("debe abrir el modal en modo edición al hacer clic en el botón de editar", () => {
    const plans = [
      {
        id: "1",
        name: "Plan A",
        description: "Descripción A",
        status: "Activo",
        price: 9.99,
        features: ["Característica 1", "Característica 2"],
        roles: [],
      },
    ];

    mockUsePlans.mockReturnValue({
      plans,
      loading: false,
      error: "",
      reloadPlans: jest.fn(),
      createPlan: jest.fn(),
      updatePlan: jest.fn(),
      deletePlan: jest.fn(),
      plan: null,
      assignPlanToClient: jest.fn(),
      getPlanById: jest.fn(),
    });

    render(<Plans />);

    const editButton = screen.getByLabelText("Edit plan");
    fireEvent.click(editButton);

    expect(screen.getByTestId("plan-form-modal")).toBeInTheDocument();
    expect(screen.getByText("Modo: edit")).toBeInTheDocument();
    expect(screen.getByText("Nombre del Plan: Plan A")).toBeInTheDocument();
  });

  it("debe llamar a createPlan y reloadPlans al guardar un nuevo plan", async () => {
    const mockCreatePlan = jest.fn().mockResolvedValue(undefined);
    const mockReloadPlans = jest.fn();

    mockUsePlans.mockReturnValue({
      plans: [],
      loading: false,
      error: "",
      reloadPlans: mockReloadPlans,
      createPlan: mockCreatePlan,
      updatePlan: jest.fn(),
      deletePlan: jest.fn(),
      plan: null,
      assignPlanToClient: jest.fn(),
      getPlanById: jest.fn(),
    });

    render(<Plans />);

    const createButton = screen.getByText("Crear Plan");
    fireEvent.click(createButton);

    const saveButton = screen.getByText("Guardar Plan");
    await act(async () => {
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(mockCreatePlan).toHaveBeenCalledWith({
        id: "3",
        name: "Plan Nuevo",
        description: "Descripción Nueva",
        status: "Activo",
        price: 29.99,
        features: ["Característica Nueva"],
      });
      expect(mockReloadPlans).toHaveBeenCalled();
      expect(screen.queryByTestId("plan-form-modal")).not.toBeInTheDocument();
    });
  });

  it("debe llamar a updatePlan y reloadPlans al guardar un plan editado", async () => {
    const plans = [
      {
        id: "1",
        name: "Plan A",
        description: "Descripción A",
        status: "Activo",
        price: 9.99,
        features: ["Característica 1", "Característica 2"],
        roles: [],
      },
    ];

    const mockUpdatePlan = jest.fn().mockResolvedValue(undefined);
    const mockReloadPlans = jest.fn();

    mockUsePlans.mockReturnValue({
      plans,
      loading: false,
      error: "",
      reloadPlans: mockReloadPlans,
      createPlan: jest.fn(),
      updatePlan: mockUpdatePlan,
      deletePlan: jest.fn(),
      plan: null,
      assignPlanToClient: jest.fn(),
      getPlanById: jest.fn(),
    });

    render(<Plans />);

    const editButton = screen.getByLabelText("Edit plan");
    fireEvent.click(editButton);

    const saveButton = screen.getByText("Guardar Plan");
    await act(async () => {
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(mockUpdatePlan).toHaveBeenCalledWith({
        id: "1",
        name: "Plan Actualizado",
        description: "Descripción A",
        status: "Activo",
        price: 9.99,
        features: ["Característica 1", "Característica 2"],
      });
      expect(mockReloadPlans).toHaveBeenCalled();
      expect(screen.queryByTestId("plan-form-modal")).not.toBeInTheDocument();
    });
  });

  // Continúa actualizando el resto de las pruebas, asegurándote de incluir las propiedades faltantes en cada llamada a mockUsePlans.mockReturnValue
});
