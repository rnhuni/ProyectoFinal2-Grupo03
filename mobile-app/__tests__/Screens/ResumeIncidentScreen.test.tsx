import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {ResumeIncidentScreen} from '../../src/Presentation/Screens/Incidents/ResumeIncidentScreen';
import {NavigationContainer} from '@react-navigation/native';
import {I18nextProvider} from 'react-i18next';
import i18n from '../../src/internalization/i18n';

jest.mock('../../src/Presentation/Components/Header.tsx', () => 'Header');
jest.mock('../../src/Presentation/Components/Footer.tsx', () => 'Footer');

// Función auxiliar para envolver el componente con i18n y NavigationContainer
const renderWithI18n = (component: React.ReactNode) => {
  return render(
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>{component}</NavigationContainer>
    </I18nextProvider>,
  );
};

describe('ResumeIncidentScreen', () => {
  it('renders correctly with translated texts', () => {
    const {getByText} = renderWithI18n(<ResumeIncidentScreen />);

    // Verificar que el texto traducido "Número ticket" esté presente
    expect(getByText(i18n.t('resumeIncidentScreen.ticketNumber'))).toBeTruthy();
  });

  it('handles help button press', () => {
    const {getByText} = renderWithI18n(<ResumeIncidentScreen />);

    // Obtener el botón de ayuda con la traducción correcta
    const helpButton = getByText(i18n.t('resumeIncidentScreen.help.button'));
    fireEvent.press(helpButton);

    // Verificar que el botón exista y se pueda presionar
    expect(helpButton).toBeTruthy();
  });
});
