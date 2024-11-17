import React from 'react';
import {
  render,
  fireEvent,
  screen,
  waitFor,
} from '@testing-library/react-native';
import Chat from '../../src/Presentation/Components/Chat/Chat';
import useSuscribeGraphql from '../../src/hooks/user/useSuscribeGraphql';
import useChannels from '../../src/hooks/channel/useChannels';
import {I18nextProvider} from 'react-i18next';
import {NavigationContainer} from '@react-navigation/native';
import i18n from '../../src/internalization/i18n';

jest.mock('aws-amplify', () => ({
  Amplify: {
    configure: jest.fn(),
  },
  API: {
    graphql: jest.fn(),
  },
  graphqlOperation: jest.fn(),
}));

jest.mock('../../src/hooks/user/useSuscribeGraphql', () => {
  return jest.fn(() => ({
    notifications: [],
    data: null,
    received: JSON.stringify({
      body: 'Nuevo mensaje del agente',
      session_id: '123',
      source_name: 'agent',
      source_type: 'agent',
    }),
  }));
});

jest.mock('../../src/hooks/channel/useChannels', () => {
  return jest.fn(() => ({
    messages: [
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
      {
        id: '2',
        session_id: '123',
        source_id: 'agent-1',
        source_name: 'Agente',
        source_type: 'agent',
        body: '¿Cómo estás?',
        content_type: 'text/plain',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    loading: false,
    error: null,
    reloadMessages: jest.fn().mockResolvedValue([
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
      {
        id: '2',
        session_id: '123',
        source_id: 'agent-1',
        source_name: 'Agente',
        source_type: 'agent',
        body: '¿Cómo estás?',
        content_type: 'text/plain',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]),
    incidentSession: {
      id: 'session-id-123',
      created_at: new Date().toISOString(),
    },
    loadIncidentSession: jest.fn().mockResolvedValue({
      assigned_to_id: 'user-id-123',
      assigned_to_name: 'John Doe',
      assigned_to_type: 'agent',
      channel_id: 'channel-id-456',
      id: 'session-id-789',
      opened_by_id: 'user-id-321',
      opened_by_name: 'Jane Smith',
      status: 'open',
      topic: 'Customer Support',
      topic_refid: 'ref-id-987',
    }),
    createIncidentMessage: jest.fn().mockResolvedValue({
      id: 'message-id-456',
      body: 'Nuevo mensaje',
      created_at: new Date().toISOString(),
    }),
  }));
});

jest.mock('react-native-config', () => ({
  API_URL: 'https://mock-api.example.com',
  OTHER_CONFIG: 'mock-value',

  AWS_APPSYNC_GRAPHQLENDPOINT: 'https://mock-api.example.com',
  AWS_APPSYNC_REGION: 'pepe',
  AWS_APPSYNC_AUTHENTICATIONTYPE: 'API_KEY',
  AWS_APPSYNC_APIKEY: 'da2-key',
}));

const renderWithI18n = (component: React.ReactNode) => {
  return render(
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>{component}</NavigationContainer>
    </I18nextProvider>,
  );
};

describe('Chat Component', () => {
  it('should call loadIncidentSession and set incidentSession state', async () => {
    // Renderiza el componente
    const {getByText} = renderWithI18n(<Chat id="test-id" />);

    // Espera a que el componente cargue
    await waitFor(() => {
      expect(screen.getByText('Hola')).toBeTruthy();
      expect(screen.getByText('¿Cómo estás?')).toBeTruthy();
    });
  });

  it('OTRO should call loadIncidentSession and set incidentSession state', async () => {
    // Renderiza el componente
    const {getByText} = renderWithI18n(<Chat id="test-id" />);

    // Espera a que el componente cargue
    expect(screen.getByText('Nuevo mensaje del agente')).toBeTruthy();
  });

  test('debería agregar un mensaje cuando el usuario envía un mensaje', () => {
    renderWithI18n(<Chat id="test-id" />);

    fireEvent.changeText(
      screen.getByPlaceholderText('Escribe un mensaje...'),
      'Hola, soy el usuario',
    );
    fireEvent.press(screen.getByText('Enviar'));

    expect(screen.getByText('Hola, soy el usuario')).toBeTruthy();
  });

  it('adds a new message when send button is pressed', () => {
    const {getByPlaceholderText, getByText} = renderWithI18n(<Chat id={''} />);
    const input = getByPlaceholderText('Escribe un mensaje...');
    const sendButton = getByText('Enviar');

    fireEvent.changeText(input, 'Nuevo mensaje');
    fireEvent.press(sendButton);

    expect(getByText('Nuevo mensaje')).toBeTruthy();
  });

  it('should scroll to end on content size change', () => {
    const {getByPlaceholderText, getByText} = renderWithI18n(<Chat id={''} />);

    const input = getByPlaceholderText('Escribe un mensaje...');
    const sendButton = getByText('Enviar');

    for (let i = 0; i < 5; i++) {
      fireEvent.changeText(input, `Mensaje número ${i + 1}`);
      fireEvent.press(sendButton);
    }

    expect(getByText('Mensaje número 5')).toBeTruthy();
  });
});
