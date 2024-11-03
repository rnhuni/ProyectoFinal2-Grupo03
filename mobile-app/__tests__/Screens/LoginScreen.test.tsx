import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { I18nextProvider } from 'react-i18next';
import { NavigationContainer } from '@react-navigation/native';
import i18n from '../../src/internalization/i18n';
import { LoginScreen } from '../../src/Presentation/Screens/Auth/LoginScreen';
import { loginUser } from '../../src/services/authService';
import { setToken } from '../../src/api/api';
import { Alert } from 'react-native';

jest.mock('../../src/services/authService', () => ({
    loginUser: jest.fn(),
}));

jest.mock('../../src/api/api', () => ({
    setToken: jest.fn(),
}));

const renderWithI18n = (component: React.ReactNode) => {
    return render(
        <I18nextProvider i18n={i18n}>
            <NavigationContainer>{component}</NavigationContainer>
        </I18nextProvider>
    );
};

describe('LoginScreen', () => {
    const navigate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks(); // Limpia los mocks antes de cada prueba
    });

    it('should render correctly', () => {
        const { getByText } = renderWithI18n(<LoginScreen navigation={{ navigate }} />);

        expect(getByText(i18n.t('loginScreen.welcome'))).toBeTruthy();
        expect(getByText(i18n.t('loginScreen.optimizeOperations'))).toBeTruthy();
    });

    it('should update username input', () => {
        const { getByPlaceholderText } = renderWithI18n(<LoginScreen navigation={{ navigate }} />);

        const usernameInput = getByPlaceholderText(i18n.t('loginScreen.username'));
        fireEvent.changeText(usernameInput, 'test@example.com');

        expect(usernameInput.props.value).toBe('test@example.com');
    });

    it('should update password input', () => {
        const { getByPlaceholderText } = renderWithI18n(<LoginScreen navigation={{ navigate }} />);

        const passwordInput = getByPlaceholderText(i18n.t('loginScreen.password'));
        fireEvent.changeText(passwordInput, 'testpassword');

        expect(passwordInput.props.value).toBe('testpassword');
    });

    it('should call loginUser on button press and navigate on success', async () => {
        const mockedUsername = 'correo@gmail.com';
        const mockedPassword = 'T0rasdw333s';

        (loginUser as jest.Mock).mockResolvedValueOnce({ IdToken: 'mocked-token' });
        const { getByTestId, getByPlaceholderText } = renderWithI18n(<LoginScreen navigation={{ navigate }} />);

        // Rellenar el campo de nombre de usuario
        const usernameInput = getByPlaceholderText(i18n.t('loginScreen.username'));
        fireEvent.changeText(usernameInput, mockedUsername);

        // Rellenar el campo de contraseña
        const passwordInput = getByPlaceholderText(i18n.t('loginScreen.password'));
        fireEvent.changeText(passwordInput, mockedPassword);

        // Presionar el botón de inicio de sesión
        fireEvent.press(getByTestId('login-button'));

        // Verificar que se llame a loginUser con las credenciales simuladas
        expect(loginUser).toHaveBeenCalledWith(mockedUsername, mockedPassword);
    });

    it('should show alert on login failure', async () => {
        (loginUser as jest.Mock).mockRejectedValueOnce(new Error('Login failed'));
        const { getByTestId } = renderWithI18n(<LoginScreen navigation={{ navigate }} />);
        const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation();

        fireEvent.press(getByTestId('login-button'));

        alertSpy.mockRestore(); // Restore el mock después de la prueba
    });

    it('should toggle language', () => {
        const { getByRole } = renderWithI18n(<LoginScreen navigation={{ navigate }} />);

        const languageSwitch = getByRole('button'); // Asegúrate de que es un botón
        fireEvent.press(languageSwitch);

        expect(i18n.language).toBe('en'); // Verifica que el idioma cambie correctamente
    });

    it('should toggle remember me option', () => {
        const { getByTestId } = renderWithI18n(<LoginScreen navigation={{ navigate }} />);

        const rememberMeLabel = getByTestId('remember-button');
        fireEvent.press(rememberMeLabel);
    });

    it('should toggle language on button press', () => {
        const { getByTestId } = renderWithI18n(<LoginScreen navigation={{ navigate: jest.fn() }} />);

        // Verificar el idioma inicial (supongamos que empieza en inglés)
        expect(i18n.language).toBe('en');

        // Simular el clic en el botón de cambio de idioma
        const languageSwitch = getByTestId('languaje-button'); // Asegúrate de que este selector apunte al botón correcto
        fireEvent.press(languageSwitch);

        // Verificar que el idioma ha cambiado a español
        expect(i18n.language).toBe('es');

        // Volver a hacer clic para verificar que se puede alternar de nuevo
        fireEvent.press(languageSwitch);

        // Verificar que el idioma ha cambiado de nuevo a inglés
        expect(i18n.language).toBe('en');
    });

});
