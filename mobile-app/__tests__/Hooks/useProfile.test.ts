// src/hooks/__tests__/useProfile.test.ts
import { renderHook, act, waitFor } from '@testing-library/react-native';
import useProfile from '../../src/hooks/user/useProfile';  // Ruta correcta según tu estructura
import api from '../../src/api/api'; // Asegúrate de que la ruta sea correcta
import { Profile } from '../../src/interfaces/Profile';

// Mock de la API
jest.mock('../../src/api/api');

// Crea un perfil de ejemplo para las pruebas
const mockProfile: Profile = {
    features: ['frt-characteristics-soporte-técnico-24/7'],
    user: {
        client: 'cli-test',
        email: 'agent@abcall.com',
        id: '3428e418-80e1-709e-0012-d47ed10a3012',
        name: 'Agent Testing',
        role: 'role-agent-premium-plan',
        status: 'CONFIRMED',
    },
    views: [
        {
            actions: ['write', 'read'],
            id: 'incident',
            menu: 'incidents',
        },
    ],
};

describe('useProfile', () => {
    it('should load profile successfully', async () => {
        // Simula la respuesta exitosa de la API
        (api.get as jest.Mock).mockResolvedValue({ data: mockProfile });

        // Usamos renderHook para renderizar el hook
        const { result } = renderHook(() => useProfile());

        // Ejecuta la llamada a reloadProfile
        await act(async () => {
            await result.current.reloadProfile();
            await waitFor(() => !result.current.loading);  // Espera a que el estado se actualice
        });

        expect(result.current.profile).toEqual(mockProfile);
        expect(result.current.error).toBe('');
    });


});
