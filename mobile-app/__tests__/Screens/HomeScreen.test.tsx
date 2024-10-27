import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {HomeScreen} from '../../src/Presentation/Screens/Home/HomeScreen';
import {Alert} from 'react-native';
import {I18nextProvider} from 'react-i18next';
import i18n from '../../src/internalization/i18n';

jest.spyOn(Alert, 'alert');

// Mockear los componentes Header y Footer
jest.mock('../../src/Presentation/Components/Header', () => 'Header');
jest.mock('../../src/Presentation/Components/Footer', () => 'Footer');

describe('HomeScreen', () => {
  // Función auxiliar para envolver el componente con I18nextProvider
  const renderWithI18n = (component: React.ReactNode) => {
    return render(<I18nextProvider i18n={i18n}>{component}</I18nextProvider>);
  };

  it('renders correctly', () => {
    const {getByText} = renderWithI18n(<HomeScreen />);

    // Verificar que el texto "Mensajes predefinidos" esté en el componente usando i18n
    expect(getByText(i18n.t('homeScreen.sectionTitle'))).toBeTruthy();
  });

  it('renders pagination correctly', () => {
    const {getByText, getByRole} = renderWithI18n(<HomeScreen />);

    // Verificar que el texto "Show 10" esté presente
    expect(getByText(i18n.t('homeScreen.pagination.show'))).toBeTruthy();
    // Verificar que el texto "of 10" esté presente
    expect(getByText(i18n.t('homeScreen.pagination.page'))).toBeTruthy();

    // Verificar que el botón con el título "1" esté presente
    const button = getByRole('button', {name: '1'});
    expect(button).toBeTruthy();

    // Simular un evento de pulsación en el botón
    fireEvent.press(button);

    // Verificar que se haya llamado la alerta con el mensaje correcto
    expect(Alert.alert).toHaveBeenCalledWith(i18n.t('homeScreen.alert'));
  });
});
