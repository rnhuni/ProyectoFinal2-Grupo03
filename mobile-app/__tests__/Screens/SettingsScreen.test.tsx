import React from 'react';
import {render} from '@testing-library/react-native';
import {SettingsScreen} from '../../src/Presentation/Screens/Settings/SettingsScreen';

describe('AboutScreen', () => {
  it('renders correctly', () => {
    const {getByText} = render(<SettingsScreen />);

    expect(getByText('SettingsScreen')).toBeTruthy();
  });
});
