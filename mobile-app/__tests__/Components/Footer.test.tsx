import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import Footer from '../../src/Presentation/Components/Footer';
import {I18nextProvider} from 'react-i18next';
import {NavigationContainer} from '@react-navigation/native';
import i18n from '../../src/internalization/i18n';

const renderWithI18n = (component: React.ReactNode) => {
  return render(
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>{component}</NavigationContainer>
    </I18nextProvider>,
  );
};

describe('Footer Component', () => {
  it('should render correctly and navigate on button press', () => {
    const navigateMock = jest.fn();
    const navigation = {navigate: navigateMock};
    jest.mock('@react-navigation/native', () => ({
      useNavigation: () => navigation,
    }));

    const {getByText, getByTestId} = renderWithI18n(<Footer />);

    expect(getByText(i18n.t('footerScreen.registerIncident'))).toBeTruthy();
    expect(getByText(i18n.t('footerScreen.summary'))).toBeTruthy();
    expect(getByText(i18n.t('footerScreen.settings'))).toBeTruthy();

    fireEvent.press(getByTestId('incident-report'));

    fireEvent.press(getByTestId('resume-incident'));

    fireEvent.press(getByTestId('settings-incident'));
  });
});
