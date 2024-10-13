import React from 'react';
import {render} from '@testing-library/react-native';
import {ProductsScreen} from '../../src/Presentation/Screens/Products/ProductsScreen';

describe('AboutScreen', () => {
  it('renders correctly', () => {
    const {getByText} = render(<ProductsScreen />);

    // Verificar que el texto "ProductsScreen" esté en el componente
    expect(getByText('ProductsScreen')).toBeTruthy();
  });
});
