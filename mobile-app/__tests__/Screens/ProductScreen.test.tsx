import React from 'react';
import {render} from '@testing-library/react-native';
import {ProductScreen} from '../../src/Presentation/Screens/Products/ProductScreen';

describe('AboutScreen', () => {
  it('renders correctly', () => {
    const {getByText} = render(<ProductScreen />);

    // Verificar que el texto "ProductScreen" esté en el componente
    expect(getByText('ProductScreen')).toBeTruthy();
  });
});
