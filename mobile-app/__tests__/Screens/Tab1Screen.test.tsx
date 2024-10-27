import React from 'react';
import {render} from '@testing-library/react-native';
import {Tab1Screen} from '../../src/Presentation/Screens/Tabs/Tab1Screen';

describe('AboutScreen', () => {
  it('renders correctly', () => {
    const {getByText} = render(<Tab1Screen />);

    // Verificar que el texto "Tab1Screen" esté en el componente
    expect(getByText('Tab1Screen')).toBeTruthy();
  });
});
