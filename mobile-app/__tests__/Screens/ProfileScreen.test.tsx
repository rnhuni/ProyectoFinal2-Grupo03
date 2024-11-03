import React from 'react';
import {render} from '@testing-library/react-native';
import ProfileScreen from '../../src/Presentation/Screens/Profile/ProfileScreen';

describe('ProfileScren', () => {
  it('renders correctly', () => {
    const {getByText} = render(<ProfileScreen />);

    expect(getByText('ProfileScreen')).toBeTruthy();
  });
});
