import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import DetailModal from '../../src/Presentation/Components/Incidents/DetailModal'; // Ajusta la ruta según corresponda
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import useProfile from '../../src/hooks/user/useProfile';
import {Profile} from '../../src/interfaces/Profile';

jest.mock('aws-amplify', () => ({
  Amplify: {
    configure: jest.fn(),
  },
  API: {
    graphql: jest.fn(),
  },
  graphqlOperation: jest.fn(),
}));

jest.mock('react-native-config', () => ({
  API_URL: 'https://mock-api.example.com',
  OTHER_CONFIG: 'mock-value',

  AWS_APPSYNC_GRAPHQLENDPOINT: 'https://mock-api.example.com',
  AWS_APPSYNC_REGION: 'pepe',
  AWS_APPSYNC_AUTHENTICATIONTYPE: 'API_KEY',
  AWS_APPSYNC_APIKEY: 'da2-key',
}));

// Mock de las dependencias
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('../../src/hooks/user/useProfile', () => ({
  __esModule: true, // Esto indica que es un módulo ES6
  default: jest.fn(), // Simula el export default como una función
}));

describe('DetailModal', () => {
  const mockProfile: Profile = {
    features: ['frt-characteristics-soporte-técnico-24/7'],
    user: {
      client: 'cli-test',
      email: 'agent@abcall.com',
      id: '3428e418-80e1-709e-0012-d47ed10a3012',
      name: 'Agent Testing',
      role: 'role-agent-premium-plan',
      status: 'CONFIRMED',
    },
    views: [
      {
        actions: ['write', 'read'],
        id: 'incident',
        menu: 'incidents',
      },
    ],
  };

  const mockNavigation = {
    navigate: jest.fn(),
  };

  const mockTranslation = {
    t: (key: string) => key,
  };

  beforeEach(() => {
    // Inicializa los mocks
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
    (useTranslation as jest.Mock).mockReturnValue(mockTranslation);
    (useProfile as jest.Mock).mockReturnValue({
      reloadProfile: jest.fn().mockResolvedValue(mockProfile),
    });
  });

  it('renders correctly', () => {
    const data = {
      id: '1',
      description: 'Test Incident',
      type: 'Bug',
      created_at: '2024-11-01',
      updated_at: '2024-11-02',
      user_issuer_name: 'Agent Testing',
      contact: {phone: '123456789'},
      attachments: [],
    };

    const {getByTestId} = render(
      <DetailModal visible={true} onClose={jest.fn()} data={data} />,
    );

    // Verificar que el modal se está renderizando
    expect(getByTestId('detail-modal')).toBeTruthy();
    expect(getByTestId('close-button')).toBeTruthy();
    expect(getByTestId('survey-button')).toBeTruthy();
  });

  it('shows the correct data in the modal', () => {
    const data = {
      id: '1',
      description: 'Test Incident',
      type: 'Bug',
      created_at: '2024-11-01',
      updated_at: '2024-11-02',
      user_issuer_name: 'Agent Testing',
      contact: {phone: '123456789'},
      attachments: [],
    };

    const {getByText} = render(
      <DetailModal visible={true} onClose={jest.fn()} data={data} />,
    );

    // Verificar que se muestren los valores correctos
    expect(getByText('resumeIncidentScreen.detailModal.id')).toBeTruthy();
    expect(getByText(data.id)).toBeTruthy();
    expect(getByText(data.description)).toBeTruthy();
    expect(getByText(data.type)).toBeTruthy();
    expect(getByText(data.created_at)).toBeTruthy();
    expect(getByText(data.updated_at)).toBeTruthy();
    expect(getByText(data.user_issuer_name)).toBeTruthy();
    expect(getByText(data.contact.phone)).toBeTruthy();
  });

  it('calls onClose when close button is pressed', async () => {
    const onClose = jest.fn();
    const data = {
      id: '1',
      description: 'Test Incident',
      type: 'Bug',
      created_at: '2024-11-01',
      updated_at: '2024-11-02',
      user_issuer_name: 'Agent Testing',
      contact: {phone: '123456789'},
      attachments: [],
    };

    const {getByTestId} = render(
      <DetailModal visible={true} onClose={onClose} data={data} />,
    );

    fireEvent.press(getByTestId('close-button'));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });
});
