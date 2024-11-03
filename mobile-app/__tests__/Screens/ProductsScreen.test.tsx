import React from 'react';
import {render} from '@testing-library/react-native';
import {ProductsScreen} from '../../src/Presentation/Screens/Products/ProductsScreen';

describe('AboutScreen', () => {
  it('renders correctly', () => {
    const {getByText} = render(<ProductsScreen />);

    expect(getByText('ProductsScreen')).toBeTruthy();
  });
});
