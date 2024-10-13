import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {HomeScreen} from '../../src/Presentation/Screens/Home/HomeScreen';
import {Alert} from 'react-native';

jest.spyOn(Alert, 'alert');

// Mockear los componentes Header y Footer
jest.mock('../../src/Presentation/Components/Header', () => 'Header');
jest.mock('../../src/Presentation/Components/Footer', () => 'Footer');

describe('HomeScreen', () => {
  it('renders correctly', () => {
    const {getByText} = render(<HomeScreen />);

    // Verificar que el texto "Mensajes predefinidos" esté en el componente
    expect(getByText('Mensajes predefinidos')).toBeTruthy();
  });

  it('renders pagination correctly', () => {
    const {getByText, getByRole} = render(<HomeScreen />);

    // Verificar que el texto "Show 10" esté presente
    expect(getByText('Show 10')).toBeTruthy();
    // Verificar que el texto "of 10" esté presente
    expect(getByText('of 10')).toBeTruthy();

    // Verificar que el botón con el título "1" esté presente
    const button = getByRole('button', {name: '1'});
    expect(button).toBeTruthy();

    // Simular un evento de pulsación en el botón
    fireEvent.press(button);

    // Verificar que se haya llamado la alerta (esto se puede hacer usando un mock de Alert)
    expect(Alert.alert).toHaveBeenCalledWith('Funcionalidad en construcción');
  });
});
