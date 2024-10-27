import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {LoginScreen} from '../../src/Presentation/Screens/Auth/LoginScreen';
import {Alert} from 'react-native';
import {I18nextProvider} from 'react-i18next';
import i18n from '../../src/internalization/i18n';

describe('LoginScreen', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithI18n = (component: React.ReactNode) => {
    return render(<I18nextProvider i18n={i18n}>{component}</I18nextProvider>);
  };

  it('renders correctly', () => {
    const {getByText} = renderWithI18n(
      <LoginScreen navigation={{navigate: mockNavigate}} />,
    );
    // Cambia 'welcome' a 'loginScreen.welcome'
    expect(getByText(i18n.t('loginScreen.welcome'))).toBeTruthy();
  });

  it('displays success alert and navigates to HomeScreen on successful login', async () => {
    const {getByPlaceholderText, getByText} = renderWithI18n(
      <LoginScreen navigation={{navigate: mockNavigate}} />,
    );

    fireEvent.changeText(
      getByPlaceholderText(i18n.t('loginScreen.username')),
      'admin',
    );
    fireEvent.changeText(
      getByPlaceholderText(i18n.t('loginScreen.password')),
      '123',
    );

    jest.spyOn(Alert, 'alert');
    fireEvent.press(getByText(i18n.t('loginScreen.login')));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        i18n.t('loginScreen.loginSuccess'),
        i18n.t('loginScreen.welcomeMessage'),
      );
      expect(mockNavigate).toHaveBeenCalledWith('HomeScreen');
    });
  });

  it('displays failure alert on invalid login', async () => {
    const {getByPlaceholderText, getByText} = renderWithI18n(
      <LoginScreen navigation={{navigate: mockNavigate}} />,
    );

    fireEvent.changeText(
      getByPlaceholderText(i18n.t('loginScreen.username')),
      'wrongUser',
    );
    fireEvent.changeText(
      getByPlaceholderText(i18n.t('loginScreen.password')),
      'wrongPass',
    );

    jest.spyOn(Alert, 'alert');
    fireEvent.press(getByText(i18n.t('loginScreen.login')));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        i18n.t('loginScreen.loginFailed'),
        i18n.t('loginScreen.invalidCredentials'),
      );
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('toggles rememberMe checkbox', () => {
    const {getByText} = renderWithI18n(
      <LoginScreen navigation={{navigate: mockNavigate}} />,
    );
    const checkbox = getByText('☐');

    fireEvent.press(checkbox);
    expect(getByText('☑')).toBeTruthy(); // Verify that it toggles to checked state

    fireEvent.press(checkbox);
    expect(getByText('☐')).toBeTruthy(); // Verify that it toggles back to unchecked state
  });

  it('displays alert on "Forgot Password" press', async () => {
    const {getByText} = renderWithI18n(
      <LoginScreen navigation={{navigate: mockNavigate}} />,
    );

    jest.spyOn(Alert, 'alert');
    fireEvent.press(getByText(i18n.t('loginScreen.forgotPassword')));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        i18n.t('loginScreen.forgotPassword'),
        i18n.t('loginScreen.navigateToForgotPassword'),
      );
    });
  });

  it('navigates to "RegisterScreen" on "Regístrate" press', async () => {
    const {getByText} = renderWithI18n(
      <LoginScreen navigation={{navigate: mockNavigate}} />,
    );

    fireEvent.press(getByText(i18n.t('loginScreen.register')));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('RegisterScreen');
    });
  });
});
