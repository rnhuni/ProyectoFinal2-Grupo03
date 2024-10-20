import { act, renderHook, waitFor } from "@testing-library/react";
import useRoles from "./useRoles";
import httpClient from "../../services/HttpClient";
import { AxiosError, CanceledError } from "axios";
import { Role, RolePermissions } from "../../interfaces/Role";

// Mock de httpClient
jest.mock("../../services/HttpClient", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
}));

describe("useRoles", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debe cargar roles al inicializar", async () => {
    const mockRolesPermissions: RolePermissions = {
      id: "1",
      actions: ["read", "write"],
    };
    const mockRoles: Role[] = [
      {
        id: "1",
        name: "Admin",
        permissions: [mockRolesPermissions],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "User",
        permissions: [mockRolesPermissions],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    (httpClient.get as jest.Mock).mockResolvedValueOnce({ data: mockRoles });

    const { result } = renderHook(() => useRoles());

    act(() => {
      result.current.reloadRoles();
    });

    await waitFor(() => {
      expect(result.current.roles).toEqual(mockRoles);
      expect(result.current.error).toBe("");
    });
  });

  it("debe manejar errores al cargar roles", async () => {
    const errorMessage = "Error al cargar roles";
    (httpClient.get as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    const { result } = renderHook(() => useRoles());

    act(() => {
      result.current.reloadRoles();
    });

    await waitFor(() => {
      expect(result.current.roles).toEqual([]);
      expect(result.current.error).toBe(errorMessage);
    });
  });

  it("debe manejar errores de cancelación al cargar roles", async () => {
    (httpClient.get as jest.Mock).mockRejectedValueOnce(new CanceledError());

    const { result } = renderHook(() => useRoles());

    act(() => {
      result.current.reloadRoles();
    });

    await waitFor(() => {
      expect(result.current.roles).toEqual([]);
      expect(result.current.error).toBe("");
    });
  });
});

describe("create", () => {
  it("debe crear un nuevo rol", async () => {
    const mockRolesPermissions: RolePermissions = {
      id: "1",
      actions: ["read", "write"],
    };
    const mockRole: Role = {
      id: "1",
      name: "Admin",
      permissions: [mockRolesPermissions],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    (httpClient.post as jest.Mock).mockResolvedValueOnce({ data: mockRole });

    const { result } = renderHook(() => useRoles());

    await act(async () => {
      const newRole = await result.current.createRole(mockRole);
      expect(newRole).toEqual(mockRole);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe("");
    });
  });

  it("debe manejar errores de Axios al crear un rol", async () => {
    const errorMessage = "Error al crear rol";
    (httpClient.post as jest.Mock).mockRejectedValueOnce(
      new AxiosError(errorMessage)
    );

    const { result } = renderHook(() => useRoles());

    await act(async () => {
      const mockRolesPermissions: RolePermissions = {
        id: "1",
        actions: ["read", "write"],
      };
      await result.current.createRole({
        id: "1",
        name: "Admin",
        permissions: [mockRolesPermissions],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
    });
  });

  it("debe manejar errores de cancelación al crear un rol", async () => {
    (httpClient.post as jest.Mock).mockRejectedValueOnce(new CanceledError());

    const { result } = renderHook(() => useRoles());

    await act(async () => {
      const mockRolesPermissions: RolePermissions = {
        id: "1",
        actions: ["read", "write"],
      };
      await result.current.createRole({
        id: "1",
        name: "Admin",
        permissions: [mockRolesPermissions],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe("");
    });
  });

  it("debe establecer loading en true mientras se crea un rol", async () => {
    (httpClient.post as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );

    const { result } = renderHook(() => useRoles());

    act(() => {
      const mockRolesPermissions: RolePermissions = {
        id: "1",
        actions: ["read", "write"],
      };
      result.current.createRole({
        id: "1",
        name: "Admin",
        permissions: [mockRolesPermissions],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });

    expect(result.current.loading).toBe(true);
  });
});

describe("useRoles - updateRole", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debe actualizar un rol correctamente", async () => {
    const mockRole: Role = {
      id: "1",
      name: "Admin",
      permissions: [{ id: "1", actions: ["read", "write"] }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    (httpClient.put as jest.Mock).mockResolvedValueOnce({ data: mockRole });

    const { result } = renderHook(() => useRoles());

    await act(async () => {
      const updatedRole = await result.current.updateRole(mockRole);
      expect(updatedRole).toEqual(mockRole);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe("");
    });
  });

  it("debe manejar errores de Axios al actualizar un rol", async () => {
    const errorMessage = "Error al actualizar rol";
    (httpClient.put as jest.Mock).mockRejectedValueOnce(
      new AxiosError(errorMessage)
    );

    const mockRole: Role = {
      id: "1",
      name: "Admin",
      permissions: [{ id: "1", actions: ["read", "write"] }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { result } = renderHook(() => useRoles());

    await act(async () => {
      await result.current.updateRole(mockRole);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
    });
  });

  it("debe manejar errores de cancelación al actualizar un rol", async () => {
    (httpClient.put as jest.Mock).mockRejectedValueOnce(new CanceledError());

    const mockRole: Role = {
      id: "1",
      name: "Admin",
      permissions: [{ id: "1", actions: ["read", "write"] }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { result } = renderHook(() => useRoles());

    await act(async () => {
      await result.current.updateRole(mockRole);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe("");
    });
  });

  it("debe establecer loading en true mientras se actualiza un rol", async () => {
    (httpClient.put as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );

    const mockRole: Role = {
      id: "1",
      name: "Admin",
      permissions: [{ id: "1", actions: ["read", "write"] }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { result } = renderHook(() => useRoles());

    act(() => {
      result.current.updateRole(mockRole);
    });

    expect(result.current.loading).toBe(true);
  });
});
