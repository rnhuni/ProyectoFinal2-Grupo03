import 'react-native';
import React from 'react';
import {render} from '@testing-library/react-native';
import {App} from '../src/App';

jest.mock('../src/Presentation/Routes/StackNavigator', () => ({
  StackNavigator: () => <></>,
}));

describe('App', () => {
  it('renders correctly', () => {
    const {toJSON} = render(<App />);

    expect(toJSON()).toBeNull();
  });
});
