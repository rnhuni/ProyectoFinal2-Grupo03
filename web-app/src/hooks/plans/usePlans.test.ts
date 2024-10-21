import { act, renderHook, waitFor } from "@testing-library/react";
import usePlans from "./usePlans"; // Asegúrate de importar tu hook
import httpClient from "../../services/HttpClient"; // Importa el servicio HttpClient
import { CanceledError } from "axios"; // Importa el error de cancelación

jest.mock("../../services/HttpClient", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

describe("usePlans", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debe cargar los planes al inicializar", async () => {
    const mockPlans = [
      {
        id: "1",
        name: "Plan Básico",
        description: "Este es el plan básico",
        price: 100,
        features: "feature1, feature2",
        roles: [],
        status: "Active",
      },
      {
        id: "2",
        name: "Plan Avanzado",
        description: "Este es el plan avanzado",
        price: 200,
        features: "feature3, feature4",
        roles: [],
        status: "Active",
      },
    ];

    (httpClient.get as jest.Mock).mockResolvedValueOnce({ data: mockPlans });

    const { result } = renderHook(() => usePlans());

    act(() => {
      result.current.reloadPlans();
    });

    await waitFor(() => {
      expect(result.current.plans).toEqual(mockPlans);
      expect(result.current.error).toBe("");
    });
  });

  it("debe manejar errores al cargar planes", async () => {
    const errorMessage = "Error al cargar planes";
    (httpClient.get as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    const { result } = renderHook(() => usePlans());

    act(() => {
      result.current.reloadPlans();
    });

    await waitFor(() => {
      expect(result.current.plans).toEqual([]);
      expect(result.current.error).toBe(errorMessage);
    });
  });

  it("debe manejar errores de cancelación al cargar planes", async () => {
    (httpClient.get as jest.Mock).mockRejectedValueOnce(new CanceledError());

    const { result } = renderHook(() => usePlans());

    act(() => {
      result.current.reloadPlans();
    });

    await waitFor(() => {
      expect(result.current.plans).toEqual([]);
      expect(result.current.error).toBe("");
    });
  });
});

describe("createPlan", () => {
  it("debe crear un nuevo plan", async () => {
    const mockPlan = {
      id: "3",
      name: "Nuevo Plan",
      description: "Este es un nuevo plan",
      price: 300,
      features: "feature5, feature6",
      roles: [],
      status: "Active",
    };

    (httpClient.post as jest.Mock).mockResolvedValueOnce({ data: mockPlan });

    const { result } = renderHook(() => usePlans());

    act(() => {
      result.current.createPlan(mockPlan);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe("");
    });
  });

  it("debe manejar errores al crear el plan", async () => {
    const errorMessage = "Error al crear el plan";
    (httpClient.post as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    const { result } = renderHook(() => usePlans());

    act(() => {
      result.current.createPlan({
        id: "3",
        name: "Plan Error",
        description: "Error",
        price: 0,
        features: "",
        roles: [],
        status: "Inactive",
      });
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
    });
  });
});

describe("updatePlan", () => {
  it("debe actualizar un plan existente", async () => {
    const mockPlan = {
      id: "1",
      name: "Plan Actualizado",
      description: "Este es el plan actualizado",
      price: 150,
      features: "feature1, feature2",
      roles: [],
      status: "Active",
    };

    (httpClient.put as jest.Mock).mockResolvedValueOnce({ data: mockPlan });

    const { result } = renderHook(() => usePlans());

    act(() => {
      result.current.updatePlan(mockPlan);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe("");
    });
  });

  it("debe manejar errores al actualizar el plan", async () => {
    const errorMessage = "Error al actualizar el plan";
    (httpClient.put as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    const { result } = renderHook(() => usePlans());

    act(() => {
      result.current.updatePlan({
        id: "1",
        name: "Plan Error",
        description: "Error",
        price: 0,
        features: "",
        roles: [],
        status: "Inactive",
      });
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
    });
  });
});

describe("deletePlan", () => {
  it("debe eliminar un plan existente", async () => {
    (httpClient.delete as jest.Mock).mockResolvedValueOnce({});

    const { result } = renderHook(() => usePlans());

    act(() => {
      result.current.deletePlan("1");
    });

    await waitFor(() => {
      expect(result.current.plans).toEqual([]);
      expect(result.current.error).toBe("");
    });
  });

  it("debe manejar errores al eliminar el plan", async () => {
    const errorMessage = "Error al eliminar el plan";
    (httpClient.delete as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    const { result } = renderHook(() => usePlans());

    act(() => {
      result.current.deletePlan("1");
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
    });
  });
});
