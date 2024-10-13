import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {LoginScreen} from '../../src/Presentation/Screens/Auth/LoginScreen';
import {Alert} from 'react-native';

describe('LoginScreen', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const {getByText} = render(
      <LoginScreen navigation={{navigate: mockNavigate}} />,
    );
    expect(getByText('Bienvenido a ABCALL')).toBeTruthy();
  });

  it('renders correctly', () => {
    const {getByText} = render(<LoginScreen />);

    // Verificar que el texto "HomeScreen" esté en el componente
    expect(getByText('Bienvenido a ABCALL')).toBeTruthy();
  });

  it('displays success alert and navigates to HomeScreen on successful login', async () => {
    const {getByPlaceholderText, getByText} = render(
      <LoginScreen navigation={{navigate: mockNavigate}} />,
    );

    fireEvent.changeText(getByPlaceholderText('Usuario'), 'admin');
    fireEvent.changeText(getByPlaceholderText('Contraseña'), '123');

    jest.spyOn(Alert, 'alert');
    fireEvent.press(getByText('Iniciar Sesión'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Login Successful',
        'Welcome to the app!',
      );
      expect(mockNavigate).toHaveBeenCalledWith('HomeScreen');
    });
  });

  it('displays failure alert on invalid login', async () => {
    const {getByPlaceholderText, getByText} = render(
      <LoginScreen navigation={{navigate: mockNavigate}} />,
    );

    fireEvent.changeText(getByPlaceholderText('Usuario'), 'wrongUser');
    fireEvent.changeText(getByPlaceholderText('Contraseña'), 'wrongPass');

    jest.spyOn(Alert, 'alert');
    fireEvent.press(getByText('Iniciar Sesión'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Login Failed',
        'Invalid username or password',
      );
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('toggles rememberMe checkbox', () => {
    const {getByText} = render(
      <LoginScreen navigation={{navigate: mockNavigate}} />,
    );
    const checkbox = getByText('☐');

    fireEvent.press(checkbox);
    expect(getByText('☑')).toBeTruthy(); // Verify that it toggles to checked state

    fireEvent.press(checkbox);
    expect(getByText('☐')).toBeTruthy(); // Verify that it toggles back to unchecked state
  });

  it('displays alert on "Forgot Password" press', async () => {
    const {getByText} = render(
      <LoginScreen navigation={{navigate: mockNavigate}} />,
    );

    jest.spyOn(Alert, 'alert');
    fireEvent.press(getByText('¿Olvidaste tu contraseña?'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Forgot Password',
        'Navigate to Forgot Password Screen',
      );
    });
  });

  it('navigates to "RegisterScreen" on "Regístrate" press', async () => {
    const {getByText} = render(
      <LoginScreen navigation={{navigate: mockNavigate}} />,
    );

    fireEvent.press(getByText('Regístrate'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('RegisterScreen');
    });
  });
});
