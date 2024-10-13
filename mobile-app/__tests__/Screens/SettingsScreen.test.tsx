import React from 'react';
import {render} from '@testing-library/react-native';
import {SettingsScreen} from '../../src/Presentation/Screens/Settings/SettingsScreen';

describe('AboutScreen', () => {
  it('renders correctly', () => {
    const {getByText} = render(<SettingsScreen />);

    // Verificar que el texto "SettingsScreen" esté en el componente
    expect(getByText('SettingsScreen')).toBeTruthy();
  });
});
