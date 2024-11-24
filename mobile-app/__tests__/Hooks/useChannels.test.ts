import { renderHook, act } from '@testing-library/react-native';
import axios, {
  AxiosError,
  AxiosRequestHeaders,
  AxiosResponse,
  CanceledError,
} from 'axios';
import MockAdapter from 'axios-mock-adapter';
import useChannels from '../../src/hooks/channel/useChannels';
import { LoadSession } from '../../src/interfaces/LoadSession';
import { Message } from '../../src/interfaces/Messages';
import api from '../../src/api/api';
import { CreateSession } from '../../src/interfaces/CreateSession';

// Mockear la API
jest.mock('../../src/api/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
}));

// Configurar mock para Axios
const mockAxios = new MockAdapter(axios);

const mockPut = api.put as jest.Mock<Promise<AxiosResponse>>;

const mockPostCreateSession = api.post as jest.Mock<Promise<String>>;

const mockPostCreateMessage = api.post as jest.Mock;

const mockGet = api.get as jest.Mock<Promise<AxiosResponse>>;

describe('useChannels', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it('loadIncidentSession carga una sesión correctamente', async () => {
    const mockSession: LoadSession[] = [{
      assigned_to_id: null,
      assigned_to_name: null,
      assigned_to_type: null,
      channel_id: 'chan-support-channel',
      id: 'session-id-123',
      opened_by_id: 'user-123',
      opened_by_name: 'Test User',
      status: 'open',
      topic: 'incident',
      topic_refid: 'incident-id-123',
    }];


    mockGet.mockResolvedValueOnce({
      data: mockSession,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: { 'Content-Type': 'application/json' } as AxiosRequestHeaders
      },
    });

    const { result } = renderHook(() => useChannels());

    await act(async () => {
      const session = await result.current.loadIncidentSession(
        'incident-id-123',
      );
      expect(mockSession[0]).toEqual(session);
    });

  });

  it('reloadMessages carga mensajes correctamente', async () => {
    const mockMessages: Message[] = [
      {
        id: '1',
        session_id: '123',
        source_id: 'user-1',
        source_name: 'Usuario',
        source_type: 'user',
        body: 'Hola',
        content_type: 'text/plain',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    mockGet.mockResolvedValueOnce({
      data: mockMessages,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: { 'Content-Type': 'application/json' } as AxiosRequestHeaders
      },
    });

    const { result } = renderHook(() => useChannels());

    await act(async () => {
      const messages = await result.current.reloadMessages('session-id-123');
      expect(messages).toEqual(mockMessages); // Verificar mensajes cargados
    });

    expect(result.current.messages).toEqual(mockMessages); // Comprobar estado
  });

  it('mockPost crear un mensaje correctamente', async () => {

    const { result: resultWithReload } = renderHook(() => useChannels());

    const mockMessage = {
      "content_type": "text/plain",
      "body": "Nuevo Mensaje"
    };

    mockPostCreateMessage.mockResolvedValueOnce(mockMessage);

    await act(async () => {
      await resultWithReload.current.createIncidentMessage("Nuevo Mensaje");
    });
  });


  it('mockPost crear una sesion correctamente', async () => {

    const { result: resultWithReload } = renderHook(() => useChannels());

    const mockMessage = {
      data: {
        "content_type": "text/plain",
        "id": "abcdefg"
      }
    };

    mockPostCreateMessage.mockResolvedValueOnce(mockMessage);

    await act(async () => {
      await resultWithReload.current.createIncidentSession("123123123");
    });
  });


  it('mockGet cargar los mensajes correctamente', async () => {
    const mockMessages = [
      {
        id: '1',
        session_id: '123',
        source_id: 'user-1',
        source_name: 'Usuario',
        source_type: 'user',
        body: 'Hola',
        content_type: 'text/plain',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    mockGet.mockResolvedValueOnce({
      data: mockMessages,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: { 'Content-Type': 'application/json' } as AxiosRequestHeaders,
      },
    });

    const mockReloadMessages = jest.fn();

    const { result: resultWithReload } = renderHook(() => useChannels());
  });

  it('mockGet manejar correctamente errores de API', async () => {
    const mockSetError = jest.fn();
    const mockSetLoading = jest.fn();
    const mockSetIncidents = jest.fn();

    const mockReloadIncidents = jest.fn();
    // Renderiza el hook
    const { result } = renderHook(() => useChannels());

    // Simulamos un error de Axios
    const axiosError = new AxiosError('Error de red', 'ERR_NETWORK');
    mockGet.mockRejectedValueOnce(axiosError);

    await act(async () => {
      await result.current.reloadMessages();
    });
  });


  it('mockGet manejar reload CanceledError correctamente', async () => {
    const canceledError = new CanceledError('Request canceled');
    mockGet.mockRejectedValueOnce(canceledError);
    const mockReloadIncidents = jest.fn();
    // Renderiza el hook
    const { result } = renderHook(() => useChannels());

    await act(async () => {
      await result.current.reloadMessages();
    });
  });


  it('mockGet manejar loadIncidentSession CanceledError correctamente', async () => {
    const canceledError = new CanceledError('Request canceled');
    mockGet.mockRejectedValueOnce(canceledError);
    const mockReloadIncidents = jest.fn();
    // Renderiza el hook
    const { result } = renderHook(() => useChannels());

    await act(async () => {
      await result.current.loadIncidentSession("123");
    });
  });

  it('mockPostCreateSession manejar createIncidentSession CanceledError correctamente', async () => {
    const canceledError = new CanceledError('Request canceled');
    mockPostCreateSession.mockRejectedValueOnce(canceledError);
    const mockReloadIncidents = jest.fn();
    // Renderiza el hook
    const { result } = renderHook(() => useChannels());

    await act(async () => {
      await result.current.createIncidentSession("123");
    });
  });

  it('mockPostCreateMessage manejar createIncidentMessage CanceledError correctamente', async () => {
    const canceledError = new CanceledError('Request canceled');
    mockPostCreateMessage.mockRejectedValueOnce(canceledError);
    const mockReloadIncidents = jest.fn();
    // Renderiza el hook
    const { result } = renderHook(() => useChannels());

    await act(async () => {
      await result.current.createIncidentMessage("123");
    });
  });
});
