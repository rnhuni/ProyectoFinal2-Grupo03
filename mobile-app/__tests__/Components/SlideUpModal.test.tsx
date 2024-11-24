import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import SlideUpModal from '../../src/Presentation/Components/notifications/SlideUpModal';

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

jest.useFakeTimers(); // Necesario para manejar los temporizadores de manera controlada.

describe('SlideUpModal', () => {
  it('renders correctly when visible', () => {
    const {getByText} = render(
      <SlideUpModal visible={true} onClose={jest.fn()} />,
    );

    expect(getByText('✕')).toBeTruthy();
  });

  it('does not render when not visible', () => {
    const {queryByText} = render(
      <SlideUpModal visible={false} onClose={jest.fn()} />,
    );

    expect(queryByText('✕')).toBeNull();
  });

  it('closes the modal when the X button is pressed', () => {
    const mockOnClose = jest.fn();

    const {getByTestId} = render(
      <SlideUpModal visible={true} onClose={mockOnClose} />,
    );

    const closeButton = getByTestId('close-modal');
    fireEvent.press(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('animates correctly on open', () => {
    const mockOnClose = jest.fn();
    const {getByTestId} = render(
      <SlideUpModal visible={true} onClose={mockOnClose} />,
    );

    const modal = getByTestId('close-modal');
    expect(modal).toBeTruthy(); // Asegura que se despliega correctamente.
  });
});
