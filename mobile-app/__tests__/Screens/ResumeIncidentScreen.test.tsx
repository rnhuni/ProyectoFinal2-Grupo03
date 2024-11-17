import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import ResumeIncidentScreen from '../../src/Presentation/Screens/Incidents/ResumeIncidentScreen';
import useIncidents from '../../src/hooks/incidents/useIncidents';
import {I18nextProvider} from 'react-i18next';
import {NavigationContainer} from '@react-navigation/native';
import i18n from '../../src/internalization/i18n';
import useSuscribeGraphql from '../../src/hooks/user/useSuscribeGraphql';
// import subscribeChannelFunc from '../../src/api/notifications';

jest.mock('aws-amplify', () => ({
  Amplify: {
    configure: jest.fn(),
  },
  API: {
    graphql: jest.fn(),
  },
  graphqlOperation: jest.fn(),
}));

// Mock de la función `subscribeChannelFunc`
jest.mock('../../src/api/notifications', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mocks del hook useIncidents
jest.mock('../../src/hooks/incidents/useIncidents', () => ({
  __esModule: true,
  default: () => ({
    incidents: [
      {
        id: 'TKT-241026-130439408',
        description: 'Otra prueba con adjuntos',
        type: 'technical',
        created_at: '2024-10-26T13:04:39.408509',
        updated_at: '2024-10-26T13:04:39.408529',
        user_issuer_name: 'Nicolas Hug',
        contact: {phone: '1234567890x'},
        attachments: [
          {
            id: '1',
            content_type: 'image/jpeg',
            file_name: 'file1.jpg',
            file_uri: 'file_uri_1',
          },
          {
            id: '2',
            content_type: 'image/png',
            file_name: 'file2.png',
            file_uri: 'file_uri_2',
          },
        ],
      },
      {
        id: 'TKT-241106-142912365',
        description: 'Otra prueba con adjuntos',
        type: 'technical',
        created_at: '2024-11-06T14:29:12.365889',
        updated_at: '2024-11-06T14:29:12.365910',
        user_issuer_name: 'Nicolas Hug',
        contact: {phone: '1234567890'},
        attachments: [],
      },
      {
        id: 'TKT-241106-225252725',
        description: 'revisar nueva carga de archivos',
        type: 'technical',
        created_at: '2024-11-06T22:52:52.725316',
        updated_at: '2024-11-06T22:52:52.725338',
        user_issuer_name: 'Oscar',
        contact: {phone: '1234567890'},
        attachments: [
          {
            id: '3',
            content_type: 'image/jpeg',
            file_name: 'file3.jpg',
            file_uri: 'file_uri_3',
          },
        ],
      },
    ],
    loading: false,
    error: null,
    reloadIncidents: jest.fn(),
  }),
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

const renderWithI18n = (component: React.ReactNode) => {
  return render(
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>{component}</NavigationContainer>
    </I18nextProvider>,
  );
};

describe('ResumeIncidentScreen', () => {
  it('renders the incident list correctly', async () => {
    const {getByText} = renderWithI18n(<ResumeIncidentScreen />);
    expect(getByText('TKT-241026-130439408')).toBeTruthy();
    expect(getByText('TKT-241106-142912365')).toBeTruthy();
  });

  it('should open modal when an incident row is pressed', async () => {
    const {getByText, getByTestId} = renderWithI18n(<ResumeIncidentScreen />);
    fireEvent.press(getByText('TKT-241026-130439408'));

    await waitFor(() => {
      expect(getByTestId('detail-modal')).toBeTruthy();
    });

    fireEvent.press(getByTestId('close-button'));
  });

  it('should open modal when an incident row is pressed and survey fired', async () => {
    const {getByText, getByTestId} = renderWithI18n(<ResumeIncidentScreen />);
    fireEvent.press(getByText('TKT-241026-130439408'));

    await waitFor(() => {
      expect(getByTestId('detail-modal')).toBeTruthy();
    });

    fireEvent.press(getByTestId('survey-button'));
  });

  it('should handle search input change', () => {
    const {getByPlaceholderText} = renderWithI18n(<ResumeIncidentScreen />);

    const searchInput = getByPlaceholderText(
      i18n.t('resumeIncidentScreen.ticketNumber'),
    );
    fireEvent.changeText(searchInput, 'Incident');

    expect(searchInput.props.value).toBe('Incident');
  });
});
