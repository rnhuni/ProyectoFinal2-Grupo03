import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {HomeScreen} from '../../src/Presentation/Screens/Home/HomeScreen';
import {Alert} from 'react-native';
import {I18nextProvider} from 'react-i18next';
import i18n from '../../src/internalization/i18n';
import {NavigationContainer} from '@react-navigation/native';

jest.spyOn(Alert, 'alert');

jest.mock('../../src/Presentation/Components/Header', () => 'Header');
jest.mock('../../src/Presentation/Components/Footer', () => 'Footer');

describe('HomeScreen', () => {
  const renderWithI18n = (component: React.ReactNode) => {
    return render(
      <I18nextProvider i18n={i18n}>
        <NavigationContainer>{component}</NavigationContainer>
      </I18nextProvider>,
    );
  };

  it('renders correctly', () => {
    const {getByText} = renderWithI18n(<HomeScreen />);

    expect(getByText(i18n.t('homeScreen.title'))).toBeTruthy();
  });

  it('renders pagination correctly', () => {
    const {getByText, getByTestId} = renderWithI18n(<HomeScreen />);

    expect(getByText(i18n.t('homeScreen.subtitle'))).toBeTruthy();

    expect(getByText(i18n.t('homeScreen.features.viewTickets'))).toBeTruthy();

    fireEvent.press(getByTestId('viewTicketsButton'));
    fireEvent.press(getByTestId('createTicketButton'));
    fireEvent.press(getByTestId('chatSupportButton'));
    fireEvent.press(getByTestId('downloadReportButton'));
    fireEvent.press(getByTestId('configureNotificationsButton'));
  });
});
