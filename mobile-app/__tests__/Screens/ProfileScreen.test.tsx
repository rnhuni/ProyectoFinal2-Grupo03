import React from 'react';
import {render} from '@testing-library/react-native';
import ProfileScreen from '../../src/Presentation/Screens/Profile/ProfileScreen';

describe('ProfileScren', () => {
  it('renders correctly', () => {
    const {getByText} = render(<ProfileScreen />);

    // Verificar que el texto "ProfileScren" esté en el componente
    expect(getByText('ProfileScreen')).toBeTruthy();
  });
});
