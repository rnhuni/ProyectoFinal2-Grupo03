import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {RegisterScreen} from '../../src/Presentation/Screens/Auth/RegisterScreen';
import {Alert} from 'react-native';
import {I18nextProvider} from 'react-i18next';
import i18n from '../../src/internalization/i18n';
jest.spyOn(Alert, 'alert');

describe('RegisterScreen', () => {
  const renderWithI18n = (component: React.ReactNode) => {
    return render(<I18nextProvider i18n={i18n}>{component}</I18nextProvider>);
  };

  it('renders correctly', () => {
    const {getByText} = renderWithI18n(<RegisterScreen />);
    // Cambia 'title' a 'registerScreen.title'
    expect(getByText(i18n.t('registerScreen.title'))).toBeTruthy();
  });

  it('muestra error cuando el país no está seleccionado', async () => {
    const {getByText, getByPlaceholderText, getByRole} = renderWithI18n(
      <RegisterScreen />,
    );

    // Simular ingreso de datos en los campos obligatorios excepto el país
    fireEvent.changeText(
      getByPlaceholderText(i18n.t('registerScreen.firstNamePlaceholder')),
      'Juan',
    );
    fireEvent.changeText(
      getByPlaceholderText(i18n.t('registerScreen.lastNamePlaceholder')),
      'Pérez',
    );
    fireEvent.changeText(
      getByPlaceholderText('mail@dominio.com'),
      'juan@example.com',
    );
    fireEvent.changeText(
      getByPlaceholderText(i18n.t('registerScreen.ciudadPlaceholder')),
      'Bogotá',
    );
    fireEvent.changeText(
      getByPlaceholderText(i18n.t('registerScreen.telefonoPlaceholder')),
      '1234567',
    );
    fireEvent.changeText(
      getByPlaceholderText(i18n.t('registerScreen.contrasenaPlaceholder')),
      'contraseña123',
    );

    // Intentar enviar el formulario sin seleccionar un país
    fireEvent.press(
      getByRole('button', {name: i18n.t('registerScreen.submitButton')}),
    );

    // Verificar que se muestre el mensaje de error para el campo "País"
    await waitFor(() => {
      expect(getByText(i18n.t('registerScreen.countryRequired'))).toBeTruthy();
    });
  });

  it('muestra mensaje de éxito cuando el formulario es enviado correctamente', async () => {
    const {getByPlaceholderText, getByText, getByRole, getByTestId} =
      renderWithI18n(<RegisterScreen />);

    // Simular ingreso de datos en todos los campos
    fireEvent.changeText(
      getByPlaceholderText(i18n.t('registerScreen.firstNamePlaceholder')),
      'Juan',
    );
    fireEvent.changeText(
      getByPlaceholderText(i18n.t('registerScreen.lastNamePlaceholder')),
      'Pérez',
    );
    fireEvent.changeText(
      getByPlaceholderText('mail@dominio.com'),
      'juan@example.com',
    );
    fireEvent.changeText(
      getByPlaceholderText(i18n.t('registerScreen.ciudadPlaceholder')),
      'Bogotá',
    );
    fireEvent.changeText(
      getByPlaceholderText(i18n.t('registerScreen.telefonoPlaceholder')),
      '1234567',
    );
    fireEvent.changeText(
      getByPlaceholderText(i18n.t('registerScreen.contrasenaPlaceholder')),
      'contraseña123',
    );

    // Simular selección del país en el Picker
    const picker = getByTestId('country-picker');
    fireEvent(picker, 'onValueChange', 'Colombia');

    // Intentar enviar el formulario
    fireEvent.press(
      getByRole('button', {name: i18n.t('registerScreen.submitButton')}),
    );

    // Verificar que se haya llamado a Alert con el mensaje de éxito
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        i18n.t('registerScreen.registrationSuccess'),
        i18n.t('registerScreen.registrationMessage'),
      );
    });
  });

  it('muestra un mensaje de error cuando el nombre está vacío', async () => {
    const {getByRole, getByText} = renderWithI18n(<RegisterScreen />);

    // Intentar enviar el formulario sin completar el campo "nombre"
    fireEvent.press(
      getByRole('button', {name: i18n.t('registerScreen.submitButton')}),
    );

    // Esperar que aparezca el mensaje de error
    await waitFor(() => {
      expect(
        getByText(i18n.t('registerScreen.firstNameRequired')),
      ).toBeTruthy();
    });
  });
});
