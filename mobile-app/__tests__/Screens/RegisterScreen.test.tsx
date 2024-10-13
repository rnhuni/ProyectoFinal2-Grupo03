import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {RegisterScreen} from '../../src/Presentation/Screens/Auth/RegisterScreen';
import {Alert} from 'react-native';

jest.spyOn(Alert, 'alert');

describe('RegisterScreen', () => {
  it('renders correctly', () => {
    const {getByText} = render(<RegisterScreen />);

    // Verificar que el texto "HomeScreen" esté en el componente
    expect(getByText('Vamos a empezar')).toBeTruthy();
  });

  it('muestra error cuando el país no está seleccionado', async () => {
    const {getByText, getByPlaceholderText, getByRole} = render(
      <RegisterScreen />,
    );

    // Simular ingreso de datos en los campos obligatorios excepto el país
    fireEvent.changeText(getByPlaceholderText('Escribe tu nombre'), 'Juan');
    fireEvent.changeText(getByPlaceholderText('Escribe tu apellido'), 'Pérez');
    fireEvent.changeText(
      getByPlaceholderText('tucorreo@dominio.com'),
      'juan@example.com',
    );
    fireEvent.changeText(getByPlaceholderText('Escribe tu ciudad'), 'Bogotá');
    fireEvent.changeText(getByPlaceholderText('Número de teléfono'), '1234567');
    fireEvent.changeText(
      getByPlaceholderText('Escribe tu contraseña'),
      'contraseña123',
    );

    // Intentar enviar el formulario sin seleccionar un país
    fireEvent.press(getByRole('button', {name: 'Empezar'}));

    // Verificar que se muestre el mensaje de error para el campo "País"
    await waitFor(() => {
      expect(getByText('País es requerido')).toBeTruthy();
    });
  });

  it('muestra mensaje de éxito cuando el formulario es enviado correctamente', async () => {
    const {getByPlaceholderText, getByText, getByRole, getByTestId} = render(
      <RegisterScreen />,
    );

    // Simular ingreso de datos en todos los campos
    fireEvent.changeText(getByPlaceholderText('Escribe tu nombre'), 'Juan');
    fireEvent.changeText(getByPlaceholderText('Escribe tu apellido'), 'Pérez');
    fireEvent.changeText(
      getByPlaceholderText('tucorreo@dominio.com'),
      'juan@example.com',
    );
    fireEvent.changeText(getByPlaceholderText('Escribe tu ciudad'), 'Bogotá');
    fireEvent.changeText(getByPlaceholderText('Número de teléfono'), '1234567');
    fireEvent.changeText(
      getByPlaceholderText('Escribe tu contraseña'),
      'contraseña123',
    );

    // Simular selección del país en el Picker
    const picker = getByTestId('country-picker'); // Asegúrate de que el Picker tenga un testID
    fireEvent(picker, 'onValueChange', 'Colombia');

    // Intentar enviar el formulario
    fireEvent.press(getByRole('button', {name: 'Empezar'}));

    // Verificar que se haya llamado a Alert con el mensaje de éxito
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Registro exitoso',
        '¡Te has registrado correctamente!',
      );
    });
  });

  it('muestra un mensaje de error cuando el nombre está vacío', async () => {
    const {getByPlaceholderText, getByRole, getByText} = render(
      <RegisterScreen />,
    );

    // Intentar enviar el formulario sin completar el campo "nombre"
    fireEvent.press(getByRole('button', {name: 'Empezar'}));

    // Esperar que aparezca el mensaje de error
    await waitFor(() => {
      expect(getByText('Nombre es requerido')).toBeTruthy();
    });
  });
  it('muestra mensaje de éxito cuando el formulario es enviado correctamente', async () => {
    const {getByPlaceholderText, getByRole} = render(<RegisterScreen />);

    // Completar todos los campos
    fireEvent.changeText(getByPlaceholderText('Escribe tu nombre'), 'Juan');
    fireEvent.press(getByRole('button', {name: 'Empezar'}));

    // Verificar que se haya llamado a Alert con el mensaje de éxito
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Registro exitoso',
        '¡Te has registrado correctamente!',
      );
    });
  });
});
