import React from 'react';
import {render} from '@testing-library/react-native';
import {AboutScreen} from '../../src/Presentation/Screens/About/AboutScreen';

describe('AboutScreen', () => {
  it('renders correctly', () => {
    const {getByText} = render(<AboutScreen />);

    // Verificar que el texto "AboutScreen" esté en el componente
    expect(getByText('AboutScreen')).toBeTruthy();
  });
});
