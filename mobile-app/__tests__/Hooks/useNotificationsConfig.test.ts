import { renderHook, act, waitFor } from '@testing-library/react-native';
import useNotificationConfig from '../../src/hooks/user/useNotificationsConfig';
import axios, { AxiosRequestHeaders, AxiosResponse } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import api from '../../src/api/api';

jest.mock('aws-amplify', () => ({
    Amplify: {
        configure: jest.fn(),
    },
    API: {
        graphql: jest.fn(),
    },
    graphqlOperation: jest.fn(),
}));

jest.mock('react-native-config', () => ({
    API_URL: 'https://mock-api.example.com',
    OTHER_CONFIG: 'mock-value',

    AWS_APPSYNC_GRAPHQLENDPOINT: 'https://mock-api.example.com',
    AWS_APPSYNC_REGION: 'pepe',
    AWS_APPSYNC_AUTHENTICATIONTYPE: 'API_KEY',
    AWS_APPSYNC_APIKEY: 'da2-key',
}));

// Mockear la API
jest.mock('../../src/api/api', () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
}));

const mockPut = api.put as jest.Mock<Promise<AxiosResponse>>;

const mockPost = api.post as jest.Mock<Promise<AxiosResponse>>;

const mockGet = api.get as jest.Mock<Promise<AxiosResponse>>;
// Configura el mock para Axios
let mock: MockAdapter;

beforeEach(() => {
    mock = new MockAdapter(axios);
});

afterEach(() => {
    mock.reset(); // Resetea los mocks después de cada prueba
});

describe('useNotificationConfig Hook', () => {
    afterEach(() => {
        mock.reset();
    });

    it('should load notification configs successfully', async () => {
        const notificationConfigs = [
            { id: '1', name: 'Notification 1', service: 'Service 1', show_by_default: true, updated_at: '', created_at: '' },
            { id: '2', name: 'Notification 2', service: 'Service 2', show_by_default: false, updated_at: '', created_at: '' },
        ];

        mockGet.mockResolvedValueOnce({
            data: notificationConfigs,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {
                headers: new axios.AxiosHeaders({ 'Content-Type': 'application/json' })
            },
        });

        const { result } = renderHook(() => useNotificationConfig());
        await act(async () => {
            await result.current.reloadNotificationConfig();
        });
        expect(result.current.error).toBe('');
    });

    it('should handle API error', async () => {

        mockGet.mockResolvedValueOnce({
            data: [],
            status: 500,
            statusText: 'ERROR',
            headers: {},
            config: {
                headers: new axios.AxiosHeaders({ 'Content-Type': 'application/json' })
            },
        });
        const { result } = renderHook(() => useNotificationConfig());

        await act(async () => {
            await result.current.reloadNotificationConfig();
        });

        expect(result.current.notificationsConfig).toEqual([]);
    });

    it('should update a notification config successfully', async () => {
        const notificationConfig = {
            id: '1',
            name: 'Updated Notification',
            service: 'Updated Service',
            show_by_default: true,
            updated_at: '',
            created_at: ''
        };

        const notificationConfigs = [
            { id: '1', name: 'Notification 1', service: 'Service 1', show_by_default: true, updated_at: '', created_at: '' },
            { id: '2', name: 'Notification 2', service: 'Service 2', show_by_default: false, updated_at: '', created_at: '' },
        ];

        mockGet.mockResolvedValueOnce({
            data: notificationConfigs,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {
                headers: new axios.AxiosHeaders({ 'Content-Type': 'application/json' })
            },
        });

        const mockResponse = {
            data: notificationConfig,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {
                headers: { 'Content-Type': 'application/json' } as AxiosRequestHeaders
            }
        };

        // Mock de la respuesta para la actualización de configuración
        mockPut.mockResolvedValueOnce(mockResponse);

        const { result: resultWithReload } = renderHook(() => useNotificationConfig());

        await act(async () => {
            const response = await resultWithReload.current.updateNotificationConfig(notificationConfig);
        });

        // Llamamos a reloadNotificationConfig para cargar las configuraciones iniciales

        await resultWithReload.current.reloadNotificationConfig();


        // Esperamos que las configuraciones se hayan cargado
        await waitFor(() => expect(resultWithReload.current.notificationsConfig).toHaveLength(2));

        expect(resultWithReload.current.error).toBe('');
    });
});
