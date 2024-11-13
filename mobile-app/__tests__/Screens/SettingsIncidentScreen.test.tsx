import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import {SettingsIncidentScreen} from '../../src/Presentation/Screens/Incidents/SettingsIncidentScreen';
import {NavigationContainer} from '@react-navigation/native';
import {I18nextProvider} from 'react-i18next';
import i18n from '../../src/internalization/i18n';
import useNotificationConfig from '../../src/hooks/user/useNotificationsConfig';



jest.mock('../../src/hooks/user/useNotificationsConfig', () => ({
  __esModule: true,
  default: jest.fn(),
}));


jest.mock('../../src/Presentation/Components/Header.tsx', () => 'Header');
jest.mock('../../src/Presentation/Components/Footer.tsx', () => 'Footer');

const renderWithI18n = (component: React.ReactNode) => {
  return render(
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>{component}</NavigationContainer>
    </I18nextProvider>,
  );
};


describe('SettingsIncidentScreen', () => {
  it('should render the list of notifications and toggle switch', async () => {
    // Datos simulados para el hook
    const mockNotifications = [
      {
        id: 'faa26fbd-09ec-473d-b4b8-13e7d8733af7',
        name: 'Actualización de Estado de Ticket',
        service: 'servicio 1',
        show_by_default: true,
        updated_at: '2024-11-13T03:40:40.590566',
        created_at: '2024-11-08T21:53:50.768036',
      },
      {
        id: '46cd29b8-4d0a-4a1c-92e5-76e39ef74e5c',
        name: 'Cliente Transferido a Otro Agente',
        service: 'State Changes',
        show_by_default: false,
        updated_at: '2024-11-13T03:39:58.025947',
        created_at: '2024-11-10T13:37:17.656251',
      },
    ];

    // Mock para el hook
    (useNotificationConfig as jest.Mock).mockReturnValue({
      notificationsConfig: mockNotifications,
      loading: false,
      error: null,
      reloadNotificationConfig: jest.fn().mockResolvedValue(mockNotifications),
      updateNotificationConfig: jest.fn(),
    });

    // Renderizamos el componente
    const { getByText, getByTestId } = renderWithI18n(<SettingsIncidentScreen />);

    // Esperamos que los elementos estén disponibles
    await waitFor(() => {
      expect(getByText('Actualización de Estado de Ticket')).toBeTruthy();
      expect(getByText('Cliente Transferido a Otro Agente')).toBeTruthy();
    });

    // Verificamos si el estado inicial de los switches es correcto
    expect(getByTestId('switch-faa26fbd-09ec-473d-b4b8-13e7d8733af7')).toHaveProp('value', true);
    expect(getByTestId('switch-46cd29b8-4d0a-4a1c-92e5-76e39ef74e5c')).toHaveProp('value', false);

    // Simulamos el cambio de estado del switch
    fireEvent(getByTestId('switch-faa26fbd-09ec-473d-b4b8-13e7d8733af7'), 'valueChange', false);

    // Esperamos que la función de actualización sea llamada
    await waitFor(() => {
      expect(useNotificationConfig().updateNotificationConfig).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'faa26fbd-09ec-473d-b4b8-13e7d8733af7', show_by_default: false })
      );
    });
  });
});


