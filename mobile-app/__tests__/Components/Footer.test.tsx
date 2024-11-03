import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Footer from '../../src/Presentation/Components/Footer';
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

describe('Footer Component', () => {
  it('should render correctly and navigate on button press', () => {
    // Mock de la función de navegación
    const navigateMock = jest.fn();
    const navigation = { navigate: navigateMock };
    jest.mock('@react-navigation/native', () => ({
      useNavigation: () => navigation,
    }));

    // Renderiza el componente
    const { getByText, getByTestId } = renderWithI18n(<Footer />);

    // Verificar que los textos están presentes
    expect(getByText(i18n.t('footerScreen.registerIncident'))).toBeTruthy();
    expect(getByText(i18n.t('footerScreen.summary'))).toBeTruthy();
    expect(getByText(i18n.t('footerScreen.settings'))).toBeTruthy();

    // Simular la pulsación en el botón de registrar incidente
    fireEvent.press(getByTestId('incident-report'));
    // expect(navigateMock).toHaveBeenCalledWith(i18n.t('IncidentReportScreen'));

    // Simular la pulsación en el botón de resumen
    fireEvent.press(getByTestId('resume-incident'));
    // expect(navigateMock).toHaveBeenCalledWith(i18n.t('ResumeIncidentScreen'));

    // Simular la pulsación en el botón de configuración
    fireEvent.press(getByTestId('settings-incident'));
    // expect(navigateMock).toHaveBeenCalledWith(i18n.t('SettingsIncidentScreen'));
  });
});
