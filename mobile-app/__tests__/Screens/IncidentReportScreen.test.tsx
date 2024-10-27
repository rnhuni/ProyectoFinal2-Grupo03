import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {NavigationContainer} from '@react-navigation/native';
import {IncidentReportScreen} from '../../src/Presentation/Screens/Incidents/IncidentReportScreen';
import {I18nextProvider} from 'react-i18next';
import i18n from '../../src/internalization/i18n'; // Asegúrate de tener tu configuración de i18n correcta

jest.mock('../../src/Presentation/Components/Header', () => 'Header');
jest.mock('../../src/Presentation/Components/Footer', () => 'Footer');

// Helper para renderizar con internacionalización
const renderWithI18n = (component: React.ReactNode) => {
  return render(
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>{component}</NavigationContainer>
    </I18nextProvider>,
  );
};

describe('IncidentReportScreen', () => {
  it('renders correctly with translated texts', () => {
    const {getByText, getByPlaceholderText, getByTestId} = renderWithI18n(
      <IncidentReportScreen />,
    );

    // Verificar que los textos internacionalizados aparezcan correctamente
    expect(getByText(i18n.t('incidentReportScreen.tabs.summary'))).toBeTruthy();
    expect(getByTestId('register-text')).toBeTruthy();
    expect(
      getByText(i18n.t('incidentReportScreen.incidentType.label')),
    ).toBeTruthy();
    expect(
      getByPlaceholderText(
        i18n.t('incidentReportScreen.phoneNumber.placeholder'),
      ),
    ).toBeTruthy();
    expect(
      getByPlaceholderText(
        i18n.t('incidentReportScreen.description.placeholder'),
      ),
    ).toBeTruthy();
    expect(
      getByText(i18n.t('incidentReportScreen.fileUpload.buttonText')),
    ).toBeTruthy();
    expect(
      getByText(i18n.t('incidentReportScreen.fileUpload.addFileButton')),
    ).toBeTruthy();
  });

  it('handles input changes', () => {
    const {getByPlaceholderText} = renderWithI18n(<IncidentReportScreen />);

    // Cambiar el texto del input de teléfono
    const phoneNumberInput = getByPlaceholderText(
      i18n.t('incidentReportScreen.phoneNumber.placeholder'),
    );
    fireEvent.changeText(phoneNumberInput, '1234567890');
    expect(phoneNumberInput.props.value).toBe('1234567890');

    // Cambiar el texto del input de descripción
    const descriptionInput = getByPlaceholderText(
      i18n.t('incidentReportScreen.description.placeholder'),
    );
    fireEvent.changeText(descriptionInput, 'Descripción del incidente');
    expect(descriptionInput.props.value).toBe('Descripción del incidente');
  });

  // it('handles picker selection', () => {
  //   const {getByTestId} = renderWithI18n(<IncidentReportScreen />);

  //   // Simular selección del Picker
  //   const picker = getByTestId('incident-type-picker');
  //   fireEvent(picker, 'valueChange', 'Incidente 1'); // Simula la selección del Picker
  //   expect(picker.props.selectedValue).toBe('Incidente 1');
  // });

  it('handles register button press', () => {
    const {getByTestId} = renderWithI18n(<IncidentReportScreen />);

    // Verificar que se pueda presionar el botón de registro
    const registerButton = getByTestId('register-button');
    fireEvent.press(registerButton);

    // Aquí puedes añadir alguna expectativa si hay algún comportamiento posterior a la pulsación
    // Por ejemplo, una alerta, navegación, etc.
  });
});
