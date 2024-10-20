import { act, renderHook, waitFor } from "@testing-library/react";

import httpClient from "../../services/HttpClient";
import { AxiosError, CanceledError } from "axios";
import { User, UserTableData } from "../../interfaces/User";
import useUsers from "./useUser";

// Mock de httpClient
jest.mock("../../services/HttpClient", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

describe("useUsers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debe cargar usuarios al inicializar", async () => {
    const mockUsers: UserTableData[] = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        role_id: "1",
        client_id: "client1",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        role_id: "2",
        client_id: "client2",
        status: "inactive",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    (httpClient.get as jest.Mock).mockResolvedValueOnce({ data: mockUsers });

    const { result } = renderHook(() => useUsers());

    act(() => {
      result.current.reloadUsers();
    });

    await waitFor(() => {
      expect(result.current.users).toEqual(mockUsers);
      expect(result.current.error).toBe("");
    });
  });

  it("debe manejar errores al cargar usuarios", async () => {
    const errorMessage = "Error al cargar usuarios";
    (httpClient.get as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    const { result } = renderHook(() => useUsers());

    act(() => {
      result.current.reloadUsers();
    });

    await waitFor(() => {
      expect(result.current.users).toEqual([]);
      expect(result.current.error).toBe(errorMessage);
    });
  });

  it("debe manejar errores de cancelación al cargar usuarios", async () => {
    (httpClient.get as jest.Mock).mockRejectedValueOnce(new CanceledError());

    const { result } = renderHook(() => useUsers());

    act(() => {
      result.current.reloadUsers();
    });

    await waitFor(() => {
      expect(result.current.users).toEqual([]);
      expect(result.current.error).toBe("");
    });
  });
});

describe("useUsers - createUser", () => {
  it("debe crear un nuevo usuario", async () => {
    const mockUser: User = {
      name: "John Doe",
      email: "john@example.com",
      role_id: "1",
      client_id: "client1",
    };

    (httpClient.post as jest.Mock).mockResolvedValueOnce({ data: mockUser });

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const newUser = await result.current.createUser(mockUser);
      expect(newUser).toEqual(mockUser);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe("");
    });
  });

  it("debe manejar errores de Axios al crear un usuario", async () => {
    const errorMessage = "Error al crear usuario";
    (httpClient.post as jest.Mock).mockRejectedValueOnce(
      new AxiosError(errorMessage)
    );

    const { result } = renderHook(() => useUsers());

    const mockUser: User = {
      name: "John Doe",
      email: "john@example.com",
      role_id: "1",
      client_id: "client1",
    };

    await act(async () => {
      await result.current.createUser(mockUser);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
    });
  });

  it("debe manejar errores de cancelación al crear un usuario", async () => {
    (httpClient.post as jest.Mock).mockRejectedValueOnce(new CanceledError());

    const { result } = renderHook(() => useUsers());

    const mockUser: User = {
      name: "John Doe",
      email: "john@example.com",
      role_id: "1",
      client_id: "client1",
    };

    await act(async () => {
      await result.current.createUser(mockUser);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe("");
    });
  });
});

describe("useUsers - updateUser", () => {
  it("debe actualizar un usuario correctamente", async () => {
    const mockUser: UserTableData = {
      id: "1",
      name: "John Updated",
      email: "john.updated@example.com",
      role_id: "1",
      client_id: "client1",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    (httpClient.put as jest.Mock).mockResolvedValueOnce({ data: mockUser });

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const updatedUser = await result.current.updateUser(mockUser);
      expect(updatedUser).toEqual(mockUser);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe("");
    });
  });

  it("debe manejar errores de Axios al actualizar un usuario", async () => {
    const errorMessage = "Error al actualizar usuario";
    (httpClient.put as jest.Mock).mockRejectedValueOnce(
      new AxiosError(errorMessage)
    );

    const mockUser: UserTableData = {
      id: "1",
      name: "John Updated",
      email: "john.updated@example.com",
      role_id: "1",
      client_id: "client1",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      await result.current.updateUser(mockUser);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
    });
  });

  it("debe manejar errores de cancelación al actualizar un usuario", async () => {
    (httpClient.put as jest.Mock).mockRejectedValueOnce(new CanceledError());

    const mockUser: UserTableData = {
      id: "1",
      name: "John Updated",
      email: "john.updated@example.com",
      role_id: "1",
      client_id: "client1",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      await result.current.updateUser(mockUser);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe("");
    });
  });
});

describe("useUsers - deleteUser", () => {
  it("debe eliminar un usuario correctamente", async () => {
    const mockResponse = { data: {} };

    (httpClient.delete as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const deleteResponse = await result.current.deleteUser("1");
      expect(deleteResponse).toEqual(mockResponse.data);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe("");
    });
  });

  it("debe manejar errores de Axios al eliminar un usuario", async () => {
    const errorMessage = "Error al eliminar usuario";
    (httpClient.delete as jest.Mock).mockRejectedValueOnce(
      new AxiosError(errorMessage)
    );

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      await result.current.deleteUser("1");
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
    });
  });

  it("debe manejar errores de cancelación al eliminar un usuario", async () => {
    (httpClient.delete as jest.Mock).mockRejectedValueOnce(new CanceledError());

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      await result.current.deleteUser("1");
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe("");
    });
  });
});
