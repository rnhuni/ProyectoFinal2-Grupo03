import { renderHook, act, waitFor } from "@testing-library/react";
import useOperationsPermission from "./useOperationsPermissions";
import httpClient from "../../services/HttpClient";
import { CanceledError } from "axios";
import { Permission } from "../../interfaces/Permissions"; // Asegúrate de ajustar la ruta

// Simular el cliente HTTP
jest.mock("../../services/HttpClient");

describe("useCreatePermission", () => {
    it("debe crear un nuevo permiso", async () => {
        const mockPermission: Permission = {
            id: "1",
            name: "New Permission",
            resource: "documents",
            description: "Allows creating new documents",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        (httpClient.post as jest.Mock).mockResolvedValueOnce({ data: mockPermission });

        const { result } = renderHook(() => useOperationsPermission());

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

        const { result } = renderHook(() => useOperationsPermission());

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

        const { result } = renderHook(() => useOperationsPermission());

        act(() => {
            result.current.createPermission({ id: "1", name: "New Permission", resource: "documents", description: "Allows creating new documents" });
        });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
            expect(result.current.error).toBe("");
        });
    });

    it("debe establecer loading en true mientras se crea el permiso", async () => {
        (httpClient.post as jest.Mock).mockImplementation(() => new Promise(() => { })); // Simula una petición que nunca se resuelve

        const { result } = renderHook(() => useOperationsPermission());

        act(() => {
            result.current.createPermission({ id: "1", name: "New Permission", resource: "documents", description: "Allows creating new documents" });
        });

        expect(result.current.loading).toBe(true); // Verifica que loading sea true
    });
});
