import { act, renderHook, waitFor } from "@testing-library/react";
import usePermissions from "./usePermissions";
import httpClient from "../../services/HttpClient";
import { CanceledError } from "axios";
import { Permission } from "../../interfaces/Permissions";



jest.mock("../../services/HttpClient", () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
}));

describe("usePermissions", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });


    it("debe cargar permisos al inicializar", async () => {
        const mockPermissions: Permission[] = [
            { id: "1", name: "Permission 1", resource: "documents", description: "Allows creating documents", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { id: "2", name: "Permission 2", resource: "users", description: "Allows managing users", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        ];

        (httpClient.get as jest.Mock).mockResolvedValueOnce({ data: mockPermissions });

        const { result } = renderHook(() => usePermissions());

        act(() => {
            result.current.reloadPermissions();
        });

        await waitFor(() => {
            expect(result.current.permissions).toEqual(mockPermissions);
            expect(result.current.error).toBe("");
        });
    });


    it("debe manejar errores al cargar permisos", async () => {
        const errorMessage = "Error al cargar permisos";
        (httpClient.get as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

        const { result } = renderHook(() => usePermissions());

        act(() => {
            result.current.reloadPermissions();
        });

        await waitFor(() => {
            expect(result.current.permissions).toEqual([]);
            expect(result.current.error).toBe(errorMessage);
        });
    });

    it("debe manejar errores de cancelación al cargar permisos", async () => {
        (httpClient.get as jest.Mock).mockRejectedValueOnce(new CanceledError());

        const { result } = renderHook(() => usePermissions());

        await waitFor(() => {
            expect(result.current.permissions).toEqual([]);
            expect(result.current.error).toBe("");
        });
    });

});

describe("useCreatePermission", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("debe crear un nuevo permiso", async () => {
        const mockPermission: Permission = {
            id: "1",
            name: "New Permission",
            resource: "documents",
            description: "Allows creating new documents",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        (httpClient.post as jest.Mock).mockResolvedValueOnce({ data: mockPermission });

        const { result } = renderHook(() => usePermissions());

        act(() => {
            result.current.createPermission(mockPermission);
        });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
            expect(result.current.error).toBe("");
        });
    });

    it("debe manejar errores de Axios", async () => {
        const errorMessage = "Error al crear el permiso";
        (httpClient.post as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

        const { result } = renderHook(() => usePermissions());

        act(() => {
            result.current.createPermission({ id: "1", name: "New Permission", resource: "documents", description: "Allows creating new documents" });
        });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
            expect(result.current.error).toBe(errorMessage);
        });
    });

    it("debe manejar errores de cancelación", async () => {
        (httpClient.post as jest.Mock).mockRejectedValueOnce(new CanceledError());

        const { result } = renderHook(() => usePermissions());

        act(() => {
            result.current.createPermission({ id: "1", name: "New Permission", resource: "documents", description: "Allows creating new documents" });
        });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
            expect(result.current.error).toBe("");
        });
    });

    it("debe establecer loading en true mientras se crea el permiso", async () => {
        (httpClient.post as jest.Mock).mockImplementation(() => new Promise(() => { }));

        const { result } = renderHook(() => usePermissions());

        act(() => {
            result.current.createPermission({ id: "1", name: "New Permission", resource: "documents", description: "Allows creating new documents" });
        });

        expect(result.current.loading).toBe(true);
    });
});

describe("useUpdatePermission", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("debe actualizar un nuevo permiso", async () => {
        const mockPermission: Permission = {
            id: "1",
            name: "New Permission",
            resource: "documents",
            description: "Allows creating new documents",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        (httpClient.put as jest.Mock).mockResolvedValueOnce({ data: mockPermission });

        const { result } = renderHook(() => usePermissions());

        act(() => {
            result.current.updatePermission(mockPermission);
        });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
            expect(result.current.error).toBe("");
        });
    });

    it("debe manejar errores de Axios", async () => {
        const errorMessage = "Error al crear el permiso";
        (httpClient.put as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

        const { result } = renderHook(() => usePermissions());

        act(() => {
            result.current.updatePermission({ id: "1", name: "New Permission", resource: "documents", description: "Allows creating new documents" });
        });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
            expect(result.current.error).toBe(errorMessage);
        });
    });

    it("debe manejar errores de cancelación", async () => {
        (httpClient.put as jest.Mock).mockRejectedValueOnce(new CanceledError());

        const { result } = renderHook(() => usePermissions());

        act(() => {
            result.current.updatePermission({ id: "1", name: "New Permission", resource: "documents", description: "Allows creating new documents" });
        });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
            expect(result.current.error).toBe("");
        });
    });

    it("debe establecer loading en true mientras se crea el permiso", async () => {
        (httpClient.put as jest.Mock).mockImplementation(() => new Promise(() => { }));

        const { result } = renderHook(() => usePermissions());

        act(() => {
            result.current.updatePermission({ id: "1", name: "New Permission", resource: "documents", description: "Allows creating new documents" });
        });

        expect(result.current.loading).toBe(true);
    });
});

describe("cancelations", () => {

    it("debe manejar cancelación de permisos al recargar", async () => {
        (httpClient.get as jest.Mock).mockRejectedValueOnce(new CanceledError());

        const { result } = renderHook(() => usePermissions());

        act(() => {
            result.current.reloadPermissions();
        });

        await waitFor(() => {
            expect(result.current.permissions).toEqual([]);
            expect(result.current.error).toBe("");
        });
    });

    it("debe manejar cancelación al crear un permiso", async () => {
        (httpClient.post as jest.Mock).mockRejectedValueOnce(new CanceledError());

        const { result } = renderHook(() => usePermissions());

        act(() => {
            result.current.createPermission({
                id: "1",
                name: "Permission 1",
                resource: "documents",
                description: "Allows creating new documents",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            });
        });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
            expect(result.current.error).toBe("");
        });
    });

    it("debe manejar cancelación al actualizar un permiso", async () => {
        (httpClient.put as jest.Mock).mockRejectedValueOnce(new CanceledError());

        const { result } = renderHook(() => usePermissions());

        act(() => {
            result.current.updatePermission({
                id: "1",
                name: "Permission 1",
                resource: "documents",
                description: "Allows creating new documents",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            });
        });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
            expect(result.current.error).toBe("");
        });
    });

});