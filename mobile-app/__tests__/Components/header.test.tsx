import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import Header from '../../src/Presentation/Components/Header';
import {I18nextProvider} from 'react-i18next';
import {NavigationContainer} from '@react-navigation/native';
import i18n from '../../src/internalization/i18n';

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

const renderWithI18n = (component: React.ReactNode) => {
  return render(
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>{component}</NavigationContainer>
    </I18nextProvider>,
  );
};

describe('Header Component', () => {
  it('should render correctly and navigate on button press', () => {
    const goBackMock = jest.fn();
    const navigation = {goBack: goBackMock};
    jest.mock('@react-navigation/native', () => ({
      useNavigation: () => navigation,
    }));

    const {getByText, getByTestId} = renderWithI18n(<Header />);

    expect(getByText('ABCall')).toBeTruthy();

    fireEvent.press(getByTestId('go-back'));

    fireEvent.press(getByTestId('toggle-languaje'));

    fireEvent.press(getByTestId('toggle-languaje'));
  });
});
