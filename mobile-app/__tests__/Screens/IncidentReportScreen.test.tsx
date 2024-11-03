import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { IncidentReportScreen } from '../../src/Presentation/Screens/Incidents/IncidentReportScreen';
import useIncidents from '../../src/hooks/incidents/useIncidents';
import { Incident } from '../../src/interfaces/Indicents';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../src/internalization/i18n';
import { NavigationContainer } from '@react-navigation/native';

jest.mock('../../src/hooks/incidents/useIncidents');

const renderWithI18n = (component: React.ReactNode) => {
    return render(
      <I18nextProvider i18n={i18n}>
        <NavigationContainer>{component}</NavigationContainer>
      </I18nextProvider>,
    );
  };

describe('IncidentReportScreen', () => {
  const createIncidentMock = jest.fn();
  const reloadIncidentsMock = jest.fn();

  beforeAll(() => {
    global.alert = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (useIncidents as jest.Mock).mockReturnValue({
      incidents: [],
      loading: false,
      error: '',
      createIncident: createIncidentMock,
      reloadIncidents: reloadIncidentsMock,
    });
  });

  it('renders the screen with all elements', () => {
    const { getByTestId, getByText } = renderWithI18n(
        <IncidentReportScreen />,
      );
    expect(getByTestId('incident-type-picker')).toBeTruthy();
    expect(getByTestId('phone-number-input')).toBeTruthy();
    expect(getByTestId('description-input')).toBeTruthy();
    expect(getByTestId('register-button')).toBeTruthy();
  });

  it('allows selecting an incident type', () => {
    const { getByTestId, getByText } = renderWithI18n(
        <IncidentReportScreen />,
      );
    const picker = getByTestId('incident-type-picker');
  
    // Usa el evento onValueChange para cambiar el valor
    fireEvent(picker, 'onValueChange', 'Incidente 1');
  
    // Verifica que el texto visible haya cambiado al valor seleccionado
    expect(getByText('Incidente 1')).toBeTruthy();
  });

  it('updates the phone number input', () => {
    const { getByTestId } = renderWithI18n(
        <IncidentReportScreen />,
      );
    const phoneInput = getByTestId('phone-number-input');

    fireEvent.changeText(phoneInput, '1234567890');
    expect(phoneInput.props.value).toBe('1234567890');
  });

  it('updates the description input', () => {
    const { getByTestId } = renderWithI18n(
        <IncidentReportScreen />,
      );
    const descriptionInput = getByTestId('description-input');

    fireEvent.changeText(descriptionInput, 'This is a test incident description');
    expect(descriptionInput.props.value).toBe('This is a test incident description');
  });

  it('calls createIncident on register button press', async () => {
    const { getByTestId } = renderWithI18n(
        <IncidentReportScreen />,
      );
    const registerButton = getByTestId('register-button');

    fireEvent.press(registerButton);

    await waitFor(() => {
      expect(createIncidentMock).toHaveBeenCalledTimes(1);
    });
  });

  it('shows an error message when createIncident fails', async () => {
    const errorMessage = 'Error creating incident';
    createIncidentMock.mockRejectedValueOnce(new Error(errorMessage));
    const { getByTestId, findByText } = renderWithI18n(
        <IncidentReportScreen />,
      );
    
    const registerButton = getByTestId('register-button');
    fireEvent.press(registerButton);


  });
});
