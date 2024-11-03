import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {HomeScreen} from '../../src/Presentation/Screens/Home/HomeScreen';
import {Alert} from 'react-native';
import {I18nextProvider} from 'react-i18next';
import i18n from '../../src/internalization/i18n';

jest.spyOn(Alert, 'alert');

jest.mock('../../src/Presentation/Components/Header', () => 'Header');
jest.mock('../../src/Presentation/Components/Footer', () => 'Footer');

describe('HomeScreen', () => {
  const renderWithI18n = (component: React.ReactNode) => {
    return render(<I18nextProvider i18n={i18n}>{component}</I18nextProvider>);
  };

  it('renders correctly', () => {
    const {getByText} = renderWithI18n(<HomeScreen />);

    expect(getByText(i18n.t('homeScreen.sectionTitle'))).toBeTruthy();
  });

  it('renders pagination correctly', () => {
    const {getByText, getByRole} = renderWithI18n(<HomeScreen />);

    expect(getByText(i18n.t('homeScreen.pagination.show'))).toBeTruthy();

    expect(getByText(i18n.t('homeScreen.pagination.page'))).toBeTruthy();

    const button = getByRole('button', {name: '1'});
    expect(button).toBeTruthy();

    fireEvent.press(button);

    expect(Alert.alert).toHaveBeenCalledWith(i18n.t('homeScreen.alert'));
  });
});
