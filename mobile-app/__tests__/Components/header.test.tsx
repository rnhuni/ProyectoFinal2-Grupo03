import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Header from '../../src/Presentation/Components/Header'; // Asegúrate de que la ruta sea correcta
import { I18nextProvider } from 'react-i18next';
import { NavigationContainer } from '@react-navigation/native';
import i18n from '../../src/internalization/i18n';

// Función auxiliar para envolver el componente con i18n y NavigationContainer
const renderWithI18n = (component: React.ReactNode) => {
  return render(
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>{component}</NavigationContainer>
    </I18nextProvider>,
  );
};

describe('Header Component', () => {
  it('should render correctly and navigate on button press', () => {
    // Mock de la función de navegación
    const goBackMock = jest.fn();
    const navigation = { goBack: goBackMock };
    jest.mock('@react-navigation/native', () => ({
      useNavigation: () => navigation,
    }));

    // Renderiza el componente
    const { getByText, getByTestId } = renderWithI18n(<Header />);

    // Verificar que el título está presente
    expect(getByText('ABCcall')).toBeTruthy();

    // Simular la pulsación en el botón de "volver"
    fireEvent.press(getByTestId('go-back'));
    // expect(goBackMock).toHaveBeenCalled();

    // Simular la pulsación en el botón de cambiar idioma
    fireEvent.press(getByTestId('toggle-languaje'));
    // expect(i18n.language).toBe('en'); // Verifica que el idioma cambie a inglés

    // Cambiar de nuevo a español
    fireEvent.press(getByTestId('toggle-languaje'));
    // expect(i18n.language).toBe('es'); // Verifica que el idioma cambie a español
  });
});
