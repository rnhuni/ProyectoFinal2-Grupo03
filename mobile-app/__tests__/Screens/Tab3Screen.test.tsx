import React from 'react';
import {render} from '@testing-library/react-native';
import {Tab3Screen} from '../../src/Presentation/Screens/Tabs/Tab3Screen';

describe('AboutScreen', () => {
  it('renders correctly', () => {
    const {getByText} = render(<Tab3Screen />);

    // Verificar que el texto "Tab3Screen" esté en el componente
    expect(getByText('Tab3Screen')).toBeTruthy();
  });
});
