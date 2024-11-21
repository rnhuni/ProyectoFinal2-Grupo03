import { renderHook, act, waitFor } from '@testing-library/react-native';
import useIncidents from '../../src/hooks/incidents/useIncidents';
import api from '../../src/api/api';
import MockAdapter from 'axios-mock-adapter';
import axios, { AxiosError, AxiosRequestHeaders, AxiosResponse, CanceledError } from 'axios';
import { Incident } from '../../src/interfaces/Incidents';
import { Feedback } from '../../src/interfaces/Feedback';
// Mockear la API
jest.mock('../../src/api/api', () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
}));

const mockPut = api.put as jest.Mock<Promise<AxiosResponse>>;

const mockPost = api.post as jest.Mock<Promise<AxiosResponse>>;

const mockGet = api.get as jest.Mock<Promise<AxiosResponse>>;

describe('useIncidents', () => {
    it('mockGet cargar los incidentes correctamente', async () => {
        const mockIncidents = [{
            id: 'TKT-241026-1',
            description: 'lore ipsum update',
            createdAt: 'Sat, 26 Oct 2024 13:04:39 GMT',
            user_issuer_name: 'Nicolas Hug',
            contact: { phone: '123456' },
            attachments: [],
            type: 'denuncia update',
            updatedAt: 'Sat, 26 Oct 2024 13:04:39 GMT',
        },
        {
            id: 'TKT-241026-2',
            description: 'lore ipsum update',
            createdAt: 'Sat, 26 Oct 2024 13:04:39 GMT',
            user_issuer_name: 'Nicolas Hug',
            contact: { phone: '123456' },
            attachments: [],
            type: 'denuncia update',
            updatedAt: 'Sat, 26 Oct 2024 13:04:39 GMT',
        },
        {
            id: 'TKT-241026-3',
            description: 'lore ipsum update',
            createdAt: 'Sat, 26 Oct 2024 13:04:39 GMT',
            user_issuer_name: 'Nicolas Hug',
            contact: { phone: '123456' },
            attachments: [],
            type: 'denuncia update',
            updatedAt: 'Sat, 26 Oct 2024 13:04:39 GMT',
        }];

        mockGet.mockResolvedValueOnce({
            data: mockIncidents,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {
                headers: new axios.AxiosHeaders({ 'Content-Type': 'application/json' })
            },
        });


        const mockReloadIncidents = jest.fn();


        const { result } = renderHook(() => useIncidents());

        await act(async () => {
            await result.current.reloadIncidents();
        });
    });

    it('mockGet manejar correctamente errores de API', async () => {
        const mockSetError = jest.fn();
        const mockSetLoading = jest.fn();
        const mockSetIncidents = jest.fn();

        const mockReloadIncidents = jest.fn();
        // Renderiza el hook
        const { result } = renderHook(() => useIncidents());

        // Simulamos un error de Axios
        const axiosError = new AxiosError('Error de red', 'ERR_NETWORK');
        mockGet.mockRejectedValueOnce(axiosError);

        // await act(async () => {
        //     await result.current.reloadIncidents();
        // });
    });

    it('mockGet manejar reload CanceledError correctamente', async () => {
        const canceledError = new CanceledError('Request canceled');
        mockGet.mockRejectedValueOnce(canceledError);
        const mockReloadIncidents = jest.fn();
        // Renderiza el hook
        const { result } = renderHook(() => useIncidents());

        // await act(async () => {
        //     await result.current.reloadIncidents();
        // });
    });

    it('mockPost crear un incidente correctamente', async () => {


        const mockIncidents = [{
            id: 'TKT-241026-130439408',
            description: 'lore ipsum update',
            createdAt: 'Sat, 26 Oct 2024 13:04:39 GMT',
            user_issuer_name: 'Nicolas Hug',
            contact: { phone: '123456' },
            attachments: [],
            type: 'denuncia update',
            updatedAt: 'Sat, 26 Oct 2024 13:04:39 GMT',
        },];

        mockGet.mockResolvedValueOnce({
            data: mockIncidents,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {
                headers: { 'Content-Type': 'application/json' } as AxiosRequestHeaders
            },
        });


        const mockReloadIncidents = jest.fn();

        const { result: resultWithReload } = renderHook(() => useIncidents());


        const newIncident: Incident = {
            id: 'TKT-241026-130439408',
            description: 'Nuevo incidente de prueba',
            created_at: new Date().toISOString(),
            user_issuer_name: 'Ana Ramirez',
            contact: { phone: '987654' },
            attachments: [],
            type: 'denuncia',
            updated_at: new Date().toISOString(),
        };

        // Mockear la respuesta de la API para la creación de incidentes
        mockPost.mockResolvedValueOnce({
            data: newIncident,
            status: 201,
            statusText: 'Created',
            headers: {},
            config: {
                headers: new axios.AxiosHeaders({ 'Content-Type': 'application/json' })
            },
        });

        await act(async () => {
            await resultWithReload.current.createIncident(newIncident);
        });
    });

    it('mockPost manejar errores de creación de incidentes correctamente', async () => {
        const mockSetError = jest.fn();
        const mockSetLoading = jest.fn();

        // Renderiza el hook
        const mockReloadIncidents = jest.fn();
        const { result } = renderHook(() => useIncidents());

        // Simulamos un error de Axios
        const axiosError = new AxiosError('Error de red', 'ERR_NETWORK');
        mockPost.mockRejectedValueOnce(axiosError);

        const newIncident: Incident = {
            id: 'TKT-241026-130439408',
            description: 'Nuevo incidente de prueba',
            created_at: new Date().toISOString(),
            user_issuer_name: 'Ana Ramirez',
            contact: { phone: '987654' },
            attachments: [],
            type: 'denuncia',
            updated_at: new Date().toISOString(),
        };

        await act(async () => {
            await result.current.createIncident(newIncident);
        });
    });

    it('mockPost manejar CanceledError correctamente', async () => {
        const canceledError = new CanceledError('Request canceled');
        mockPost.mockRejectedValueOnce(canceledError);

        const mockReloadIncidents = jest.fn();
        const { result } = renderHook(() => useIncidents());

        const newIncident: Incident = {
            id: 'TKT-241026-130439408',
            description: 'Nuevo incidente de prueba',
            created_at: new Date().toISOString(),
            user_issuer_name: 'Ana Ramirez',
            contact: { phone: '987654' },
            attachments: [],
            type: 'denuncia',
            updated_at: new Date().toISOString(),
        };

        await act(async () => {
            const incident = await result.current.createIncident(newIncident);
            expect(incident).toBeUndefined();
        });
    });


    it('mockPut actualizar un incidente correctamente', async () => {

        const mockIncident = {
            id: 'TKT-241026-130439408',
            description: 'lore ipsum update',
            createdAt: 'Sat, 26 Oct 2024 13:04:39 GMT',
            user_issuer_name: 'Nicolas Hug',
            contact: { phone: '123456' },
            attachments: [],
            type: 'denuncia update',
            updatedAt: 'Sat, 26 Oct 2024 13:04:39 GMT',
        };

        const mockResponse = {
            data: mockIncident,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {
                headers: { 'Content-Type': 'application/json' } as AxiosRequestHeaders
            }
        };

        mockPut.mockResolvedValueOnce(mockResponse);

        const mockReloadIncidents = jest.fn();

        const { result: resultWithReload } = renderHook(() => useIncidents());


        await act(async () => {
            const response = await resultWithReload.current.updateIncident(mockIncident);
        });
    });

    it('mockPut manejar errores al actualizar un incidente', async () => {
        const mockIncident = {
            id: 'TKT-241026-130439408',
            description: 'lore ipsum update',
            createdAt: 'Sat, 26 Oct 2024 13:04:39 GMT',
            user_issuer_name: 'Nicolas Hug',
            contact: { phone: '123456' },
            attachments: [],
            type: 'denuncia update',
            updatedAt: 'Sat, 26 Oct 2024 13:04:39 GMT',
        };

        const axiosError = new AxiosError('Error de actualización', 'ERR_UPDATE');
        mockPut.mockRejectedValueOnce(axiosError);

        const mockReloadIncidents = jest.fn();

        const { result: resultWithReload } = renderHook(() => useIncidents());

        await act(async () => {
            await resultWithReload.current.updateIncident(mockIncident);
        });

    });

    it('mockPut manejar CanceledError correctamente', async () => {
        const mockIncident = {
            id: 'TKT-241026-130439408',
            description: 'lore ipsum update',
            createdAt: 'Sat, 26 Oct 2024 13:04:39 GMT',
            user_issuer_name: 'Nicolas Hug',
            contact: { phone: '123456' },
            attachments: [],
            type: 'denuncia update',
            updatedAt: 'Sat, 26 Oct 2024 13:04:39 GMT',
        };

        const canceledError = new CanceledError('Request canceled');
        mockPut.mockRejectedValueOnce(canceledError);

        const mockReloadIncidents = jest.fn();

        const { result: resultWithReload } = renderHook(() => useIncidents());

        await act(async () => {
            await resultWithReload.current.updateIncident(mockIncident);
        });

    });


});




describe('createFeedback', () => {
    it('should create feedback correctly', async () => {
        const mockReloadIncidents = jest.fn();
        const { result: resultWithReload } = renderHook(() => useIncidents());
        const feedbackData: Feedback = {
            support_rating: 5,
            ease_of_contact: 4,
            resolution_time: 3,
            support_staff_attitude: 5,
            additional_comments: 'Great support team, quick resolution.',
        };

        // Mockear la respuesta de la API para la creación de incidentes
        mockPost.mockResolvedValueOnce({
            data: feedbackData,
            status: 201,
            statusText: 'Created',
            headers: {},
            config: {
                headers: new axios.AxiosHeaders({ 'Content-Type': 'application/json' })
            },
        });

        await act(async () => {
            await resultWithReload.current.createFeedback("TKT-241026-130439408", feedbackData);
        });
    });

    it('should handle network error correctly', async () => {
        const mockReloadIncidents = jest.fn();
        const { result: resultWithReload } = renderHook(() => useIncidents());

        const feedbackData: Feedback = {
            support_rating: 5,
            ease_of_contact: 4,
            resolution_time: 3,
            support_staff_attitude: 5,
            additional_comments: 'Great support team, quick resolution.',
        };

        const axiosError = new AxiosError('Network Error', 'ERR_NETWORK');
        mockPost.mockRejectedValueOnce(axiosError);

        await act(async () => {
            await resultWithReload.current.createFeedback("TKT-241026-130439408", feedbackData);
        });
    });

    it('should handle CanceledError correctly', async () => {
        const mockReloadIncidents = jest.fn();
        const { result: resultWithReload } = renderHook(() => useIncidents());

        const feedbackData: Feedback = {
            support_rating: 5,
            ease_of_contact: 4,
            resolution_time: 3,
            support_staff_attitude: 5,
            additional_comments: 'Great support team, quick resolution.',
        };

        const canceledError = new CanceledError('Request canceled');
        mockPost.mockRejectedValueOnce(canceledError);

        await act(async () => {
            await resultWithReload.current.createFeedback("TKT-241026-130439408", feedbackData);
        });
    });
});