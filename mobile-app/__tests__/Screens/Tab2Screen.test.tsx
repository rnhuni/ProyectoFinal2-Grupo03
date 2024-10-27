import React from 'react';
import {render} from '@testing-library/react-native';
import {Tab2Screen} from '../../src/Presentation/Screens/Tabs/Tab2Screen';

describe('AboutScreen', () => {
  it('renders correctly', () => {
    const {getByText} = render(<Tab2Screen />);

    // Verificar que el texto "Tab2Screen" esté en el componente
    expect(getByText('Tab2Screen')).toBeTruthy();
  });
});
