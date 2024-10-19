import { renderHook, act, waitFor } from "@testing-library/react";
import usePermissions from "./usePermissions"; // Asegúrate de ajustar la ruta
import httpClient from "../../services/HttpClient";
import { CanceledError } from "axios";
import { Permission } from "../../interfaces/Permissions"; // Asegúrate de ajustar la ruta

// Simular el cliente HTTP
jest.mock("../../services/HttpClient", () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
}));

describe("usePermissions", () => {

    beforeEach(() => {
        jest.clearAllMocks(); // Limpiar mocks antes de cada prueba
    });


    it("debe cargar permisos al inicializar", async () => {
        const mockPermissions: Permission[] = [
            { id: "1", name: "Permission 1", resource: "documents", description: "Allows creating documents", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: "2", name: "Permission 2", resource: "users", description: "Allows managing users", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        ];

        (httpClient.get as jest.Mock).mockResolvedValueOnce({ data: mockPermissions });

        const { result } = renderHook(() => usePermissions());

        await waitFor(() => {
            expect(result.current.permissions).toEqual(mockPermissions);
            expect(result.current.error).toBe("");
        });
    });


    it("debe manejar errores al cargar permisos", async () => {
        const errorMessage = "Error al cargar permisos";
        (httpClient.get as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

        const { result } = renderHook(() => usePermissions());

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