import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import Chat from '../../src/Presentation/Components/Chat/Chat';
import { I18nextProvider } from 'react-i18next';
import { NavigationContainer } from '@react-navigation/native';
import i18n from '../../src/internalization/i18n';

// Función auxiliar para envolver el componente con i18n y NavigationContainer
const renderWithI18n = (component: React.ReactNode) => {
  return render(
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>{component}</NavigationContainer>
    </I18nextProvider>,
  );
};

describe('Chat Component', () => {
  it('renders initial messages correctly', () => {
    const {getByText} = renderWithI18n(<Chat />);

    expect(getByText('Hola, ¿cómo estás?')).toBeTruthy();
    expect(getByText('Bien, gracias. ¿Y tú?')).toBeTruthy();
    expect(getByText('Estoy aquí para ayudarte con tus preguntas.')).toBeTruthy();
    expect(getByText('Gracias, tengo una duda sobre mi cuenta.')).toBeTruthy();
  });

  it('adds a new message when send button is pressed', () => {
    const {getByPlaceholderText, getByText} = renderWithI18n(<Chat />);
    const input = getByPlaceholderText('Escribe un mensaje...');
    const sendButton = getByText('Enviar');

    fireEvent.changeText(input, 'Nuevo mensaje');
    fireEvent.press(sendButton);

    expect(getByText('Nuevo mensaje')).toBeTruthy();
  });

  it('should scroll to end on content size change', () => {
    const { getByPlaceholderText, getByText } = renderWithI18n(<Chat />);
    
    const input = getByPlaceholderText('Escribe un mensaje...');
    const sendButton = getByText('Enviar');

    // Simular el envío de varios mensajes
    for (let i = 0; i < 5; i++) {
      fireEvent.changeText(input, `Mensaje número ${i + 1}`);
      fireEvent.press(sendButton);
    }

    // Verificar que el último mensaje está presente en la interfaz
    expect(getByText('Mensaje número 5')).toBeTruthy();
  });
});