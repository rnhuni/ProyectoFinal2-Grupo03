import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import Chat from '../../src/Presentation/Components/Chat/Chat';
import useNotificationsGraphql from '../../src/hooks/user/useNotificationsGraphql';
import useChannels from '../../src/hooks/channel/useChannels';
import { I18nextProvider } from 'react-i18next';
import { NavigationContainer } from '@react-navigation/native';
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

jest.mock('../../src/hooks/user/useNotificationsGraphql', () => {
  return jest.fn(() => ({
    notifications: [],
    data: null,
    received: null,
  }));
});

jest.mock('../../src/hooks/channel/useChannels', () => {
  const originalModule = jest.requireActual('../../src/hooks/channel/useChannels');
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(),
  };
});

const renderWithI18n = (component: React.ReactNode) => {
  return render(
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>{component}</NavigationContainer>
    </I18nextProvider>,
  );
};

describe('Chat Component', () => {

  it('should load notifications and set messagesLocal state', async () => {
    const mockMessages = [
      { text: 'Hola', sender: 'user' },
      { text: '¿Cómo estás?', sender: 'agent' },
    ];

    (useChannels as jest.Mock).mockReturnValue({
      messages: mockMessages,
      loading: false,
      error: null,
      reloadMessages: jest.fn().mockResolvedValue(mockMessages), 
    });

    (useNotificationsGraphql as jest.Mock).mockReturnValue({
      notifications: [],
      data: null,
      received: null,
    });

    const { getByText } = renderWithI18n(<Chat id="123" />);

    await waitFor(() => expect(useChannels().reloadMessages).toHaveBeenCalled());

    expect(getByText('Hola')).toBeTruthy();
    expect(getByText('¿Cómo estás?')).toBeTruthy();
  });

  test('debería agregar un mensaje cuando se recibe una notificación', () => {
    const mockMessages = [
      { text: 'Hola', sender: 'user' },
      { text: '¿Cómo estás?', sender: 'agent' },
    ];

    (useChannels as jest.Mock).mockReturnValue({
      messages: mockMessages,
      loading: false,
      error: null,
      reloadMessages: jest.fn().mockResolvedValue(mockMessages), 
    });

    (useNotificationsGraphql as jest.Mock).mockReturnValueOnce({
      notifications: [],
      data: '',
      received: 'Mensaje recibido del agente',
    });

    const { rerender } = renderWithI18n(<Chat id="test-id" />);

    expect(screen.getByText('Mensaje recibido del agente')).toBeTruthy();
  });

  test('debería agregar un mensaje cuando el usuario envía un mensaje', () => {

    const mockMessages = [
      { text: 'Hola', sender: 'user' },
      { text: '¿Cómo estás?', sender: 'agent' },
    ];

    (useChannels as jest.Mock).mockReturnValue({
      messages: mockMessages,
      loading: false,
      error: null,
      reloadMessages: jest.fn().mockResolvedValue(mockMessages), 
    });

    renderWithI18n(<Chat id="test-id" />);
    
    fireEvent.changeText(screen.getByPlaceholderText('Escribe un mensaje...'), 'Hola, soy el usuario');
    fireEvent.press(screen.getByText('Enviar'));

    expect(screen.getByText('Hola, soy el usuario')).toBeTruthy();
  });

  it('adds a new message when send button is pressed', () => {
    const mockMessages = [
      { text: 'Hola', sender: 'user' },
      { text: '¿Cómo estás?', sender: 'agent' },
    ];

    (useChannels as jest.Mock).mockReturnValue({
      messages: mockMessages,
      loading: false,
      error: null,
      reloadMessages: jest.fn().mockResolvedValue(mockMessages),
    });

    const { getByPlaceholderText, getByText } = renderWithI18n(<Chat id={''} />);
    const input = getByPlaceholderText('Escribe un mensaje...');
    const sendButton = getByText('Enviar');

    fireEvent.changeText(input, 'Nuevo mensaje');
    fireEvent.press(sendButton);

    expect(getByText('Nuevo mensaje')).toBeTruthy();
  });

  it('should scroll to end on content size change', () => {
    const { getByPlaceholderText, getByText } = renderWithI18n(<Chat id={''} />);

    const input = getByPlaceholderText('Escribe un mensaje...');
    const sendButton = getByText('Enviar');

    for (let i = 0; i < 5; i++) {
      fireEvent.changeText(input, `Mensaje número ${i + 1}`);
      fireEvent.press(sendButton);
    }

    expect(getByText('Mensaje número 5')).toBeTruthy();
  });
});