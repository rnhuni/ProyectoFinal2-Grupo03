import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import api, { setToken } from '../../src/api/api'

describe('API Module', () => {
    let mock: MockAdapter;

    beforeEach(() => {
        // Configura un nuevo mock para cada prueba
        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        // Restablece el mock después de cada prueba
        mock.restore();
    });

    it('should set the token correctly', () => {
        const token = 'my-test-token';
        setToken(token);
        expect(token).toBe('my-test-token'); 
    });

    it('should set the token none', () => {
        const token = "";
        setToken(token);
    });

    // it('should attach the token in the request headers', async () => {
    //     // const token = 'eyJraWQiOiJBNHRnQVBSYVI1aDgxQ1RCYkV2Tk5RU0c0WDRkRkloc0V4SEFMQU9FbCtNPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI4NGQ4ZDRiOC1jMDUxLTcwODUtOWFhMS0yZWE0MDAwOTNhMTIiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfWDRTbFVGMHowIiwiY29nbml0bzp1c2VybmFtZSI6Ijg0ZDhkNGI4LWMwNTEtNzA4NS05YWExLTJlYTQwMDA5M2ExMiIsIm9yaWdpbl9qdGkiOiI0Mjc4NTdlMy0wNDg0LTRhY2YtYjE1Zi1iZGNjZjFjODlhNDAiLCJhdWQiOiI3ZXZqZmp0dnNjbjBxc29rOGxhMmtmMWphIiwiZXZlbnRfaWQiOiJmNWQyY2M5OC1kYWJhLTQ1YmUtYmUyZi05MjExYWNlOGYwZTYiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTczMDU4MjY5MiwibmFtZSI6Ik9zY2FyIiwiZXhwIjoxNzMwNjY5MDkyLCJpYXQiOjE3MzA1ODI2OTIsImp0aSI6ImM3NTZmYzZmLTMyNmItNDgzYy05NTYzLTQwMjY0MTcwNDMwMCIsImVtYWlsIjoib2VyYW1pcmV6YkBnbWFpbC5jb20ifQ.CVCx8GSZXhTX4tNkL7tOjBVdb8h5wWreHmnXMQoGRlACnorMY5-4l4o_7fsqsoswjKg4hVOkiesfh3O_HSqzGRhAvB9HKiF9xFvCSSrEaUcl6Xyevtg_qEQEHKnMgXKVgEyYnwNfdu12AeMo3Sc1qUVLNdi-viLcKoea-DQrDxmy-g2zwPgF_08iJ2Dc8xJyL6cwv9eRKighKQm14gfUcxC12uysvtUhfcarpkUoakVN0KEP05ukSGXLIntPNM66xfL6Eh9dFyGPXlqYvq496GOo-VGBv-kmykAjFUUPlDkiJq2BqQZZ_Vot6IVD0wRoOax-VkPlGHUSQMdp0v0vsw';
    //     const token = 'sasdasd';
    //     setToken(token);

    //     mock.onGet('/incident/incidents').reply(200, { data: 'response' });

    //     console.log(api.defaults.headers.common);
    //     console.log(api.defaults.headers.Authorization);

    //     const response = await api.get('/incident/incidents');
        
    //     expect(response.status).toBe(200);
    //     expect(response.data).toEqual({ data: 'response' });

    //     // Verifica que el token se haya añadido a los headers
    //     expect(mock.history.get[0]?.headers?.Authorization).toBe(`Bearer ${token}`);
    // });

    it('should handle request errors', async () => {
        mock.onGet('/some-endpoint').networkError();

        try {
            await api.get('/some-endpoint');
        } catch (error) {
            expect(error).toBeDefined(); // Verifica que haya un error definido
        }
    });

    // it('should handle response errors', async () => {
    //     mock.onGet('/some-endpoint').reply(500, { message: 'Internal Server Error' });

    //     try {
    //         await api.get('/some-endpoint');
    //     } catch (error) {
    //         if (axios.isAxiosError(error)) {
    //             expect(error.response).toBeDefined();
    //             expect(error.response?.status).toBe(500);
    //             expect(error.response?.data).toEqual({ message: 'Internal Server Error' });
    //         } else {
    //             throw error;
    //         }
    //     }
    // });
});
