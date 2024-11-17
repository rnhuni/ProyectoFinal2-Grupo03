import { subscribeChannelFunc, publishChannelFunc } from '../../src/api/notifications'; // Ajusta la ruta según tu estructura
import { API, graphqlOperation } from 'aws-amplify';
import Config from 'react-native-config';

jest.mock('aws-amplify', () => ({
    Amplify: { configure: jest.fn() },
    API: {
        graphql: jest.fn(),
    },
    graphqlOperation: jest.fn(),
}));

jest.mock('react-native-config', () => ({
    AWS_APPSYNC_GRAPHQLENDPOINT: 'https://mock-endpoint.appsync-api.mock-region.amazonaws.com/graphql',
    AWS_APPSYNC_REGION: 'mock-region',
    AWS_APPSYNC_AUTHENTICATIONTYPE: 'API_KEY',
    AWS_APPSYNC_APIKEY: 'mock-api-key',
}));

describe('API Functions', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('subscribeChannelFunc should call API.graphql and return an observable', async () => {
        const mockObservable = { subscribe: jest.fn() };
        (API.graphql as jest.Mock).mockReturnValue(mockObservable);

        const id = 'test-id';
        const result = await subscribeChannelFunc(id);
        expect(graphqlOperation).toHaveBeenCalledWith(expect.any(String), { id });
        expect(result).toBe(mockObservable);
    });

    test('publishChannelFunc should call API.graphql and return data', async () => {
        const mockResponse = { data: { publish: { data: 'test-data', id: 'test-id' } } };
        (API.graphql as jest.Mock).mockResolvedValue(mockResponse);

        const data = JSON.stringify({ key: 'value' });
        const id = 'test-id';
        const result = await publishChannelFunc(data, id);

        expect(graphqlOperation).toHaveBeenCalledWith(expect.any(String), { data, id });
        expect(result).toBe(mockResponse);
    });

    test('subscribeChannelFunc should return null on error', async () => {
        (API.graphql as jest.Mock).mockRejectedValue(new Error('Test Error'));

        const id = 'test-id';
        const result = await subscribeChannelFunc(id);

        // Verifica que el resultado es null en caso de error
        expect(result).toBeNull();
    });

    test('publishChannelFunc should return null on error', async () => {
        (API.graphql as jest.Mock).mockRejectedValue(new Error('Test Error'));

        const data = JSON.stringify({ key: 'value' });
        const id = 'test-id';
        const result = await publishChannelFunc(data, id);

        // Verifica que el resultado es null en caso de error
        expect(result).toBeNull();
    });
});
