import React from 'react';
import {render} from '@testing-library/react-native';
import {SettingsIncidentScreen} from '../../src/Presentation/Screens/Incidents/SettingsIncidentScreen';
import {NavigationContainer} from '@react-navigation/native';
import {I18nextProvider} from 'react-i18next';
import i18n from '../../src/internalization/i18n';

jest.mock('../../src/Presentation/Components/Header.tsx', () => 'Header');
jest.mock('../../src/Presentation/Components/Footer.tsx', () => 'Footer');

// Función auxiliar para renderizar con i18n y NavigationContainer
const renderWithI18n = (component: React.ReactNode) => {
  return render(
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>{component}</NavigationContainer>
    </I18nextProvider>,
  );
};

describe('SettingsIncidentScreen', () => {
  it('renders correctly with translated text', () => {
    const {getByText} = renderWithI18n(<SettingsIncidentScreen />);

    // Verificar que el texto traducido de "Habilitar notificaciones" esté presente
    expect(
      getByText(i18n.t('settingsIncidentScreen.enableNotifications')),
    ).toBeTruthy();
  });
});
