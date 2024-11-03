import React from 'react';
import {render} from '@testing-library/react-native';
import {ProductScreen} from '../../src/Presentation/Screens/Products/ProductScreen';

describe('AboutScreen', () => {
  it('renders correctly', () => {
    const {getByText} = render(<ProductScreen />);

    expect(getByText('ProductScreen')).toBeTruthy();
  });
});
