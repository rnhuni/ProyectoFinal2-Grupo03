import 'react-native';
import React from 'react';
import {render} from '@testing-library/react-native';
import {App} from '../src/App'; // Asegúrate de que esta ruta sea correcta

// Mock de StackNavigator sin usar variables externas
jest.mock('../src/Presentation/Routes/StackNavigator', () => ({
  StackNavigator: () => <></>, // Devuelve un componente vacío
}));

describe('App', () => {
  it('renders correctly', () => {
    const {toJSON} = render(<App />);

    // Verificar que el componente se renderiza sin errores
    expect(toJSON()).toBeNull();
  });
});
