import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import {SettingsIncidentScreen} from '../../src/Presentation/Screens/Incidents/SettingsIncidentScreen';
import {NavigationContainer} from '@react-navigation/native';
import {I18nextProvider} from 'react-i18next';
import i18n from '../../src/internalization/i18n';

jest.mock('../../src/Presentation/Components/Header.tsx', () => 'Header');
jest.mock('../../src/Presentation/Components/Footer.tsx', () => 'Footer');

const renderWithI18n = (component: React.ReactNode) => {
  return render(
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>{component}</NavigationContainer>
    </I18nextProvider>,
  );
};

describe('SettingsIncidentScreen', () => {
  it('renders correctly with translated text', () => {
    const {getByText} = renderWithI18n(<SettingsIncidentScreen />);

    expect(
      getByText(i18n.t('settingsIncidentScreen.enableNotifications')),
    ).toBeTruthy();
  });

  it('renders the notifications switch and it starts as off', () => {
    const {getByTestId} = renderWithI18n(<SettingsIncidentScreen />);

    const notificationsSwitch = getByTestId('enable-notifications-switch');
    expect(notificationsSwitch.props.value).toBe(false);
  });

  it('toggles the notifications switch on and off', () => {
    const {getByTestId} = renderWithI18n(<SettingsIncidentScreen />);

    const notificationsSwitch = getByTestId('enable-notifications-switch');

    fireEvent(notificationsSwitch, 'valueChange', true);
    expect(notificationsSwitch.props.value).toBe(true);

    fireEvent(notificationsSwitch, 'valueChange', false);
    expect(notificationsSwitch.props.value).toBe(false);
  });

  // -------------------- state-changes
  it('enables state-changes changes switch when notifications are enabled', () => {
    const {getByTestId, getByText} = renderWithI18n(<SettingsIncidentScreen />);

    const notificationsSwitch = getByTestId('enable-notifications-switch');

    fireEvent(notificationsSwitch, 'valueChange', true);
    expect(notificationsSwitch.props.value).toBe(true);

    const stateChangesSwitch = getByTestId(
      'enable-notifications-switch-state-changes',
    );
    expect(stateChangesSwitch).toBeTruthy();

    expect(stateChangesSwitch.props.value).toBe(false);

    fireEvent(stateChangesSwitch, 'valueChange', true);
    expect(stateChangesSwitch.props.value).toBe(true);
  });

  it('renders the state-changes changes switch and it starts as off when notifications are disabled', () => {
    const {getByTestId} = renderWithI18n(<SettingsIncidentScreen />);

    const notificationsSwitch = getByTestId('enable-notifications-switch');
    expect(notificationsSwitch.props.value).toBe(false);

    expect(() =>
      getByTestId('enable-notifications-switch-state-changes'),
    ).toThrow();
  });

  // -------------------- task-reminder
  it('enables task-reminder changes switch when notifications are enabled', () => {
    const {getByTestId, getByText} = renderWithI18n(<SettingsIncidentScreen />);

    const notificationsSwitch = getByTestId('enable-notifications-switch');

    fireEvent(notificationsSwitch, 'valueChange', true);
    expect(notificationsSwitch.props.value).toBe(true);

    const stateChangesSwitch = getByTestId(
      'enable-notifications-switch-task-reminder',
    );
    expect(stateChangesSwitch).toBeTruthy();

    expect(stateChangesSwitch.props.value).toBe(false);

    fireEvent(stateChangesSwitch, 'valueChange', true);
    expect(stateChangesSwitch.props.value).toBe(true);
  });

  it('renders the task-reminder changes switch and it starts as off when notifications are disabled', () => {
    const {getByTestId} = renderWithI18n(<SettingsIncidentScreen />);

    const notificationsSwitch = getByTestId('enable-notifications-switch');
    expect(notificationsSwitch.props.value).toBe(false);

    expect(() =>
      getByTestId('enable-notifications-switch-task-reminder'),
    ).toThrow();
  });

  // -------------------- support-messages
  it('enables support-messages changes switch when notifications are enabled', () => {
    const {getByTestId, getByText} = renderWithI18n(<SettingsIncidentScreen />);

    const notificationsSwitch = getByTestId('enable-notifications-switch');

    fireEvent(notificationsSwitch, 'valueChange', true);
    expect(notificationsSwitch.props.value).toBe(true);

    const stateChangesSwitch = getByTestId(
      'enable-notifications-switch-support-messages',
    );
    expect(stateChangesSwitch).toBeTruthy();

    expect(stateChangesSwitch.props.value).toBe(false);

    fireEvent(stateChangesSwitch, 'valueChange', true);
    expect(stateChangesSwitch.props.value).toBe(true);
  });

  it('renders the support-messages changes switch and it starts as off when notifications are disabled', () => {
    const {getByTestId} = renderWithI18n(<SettingsIncidentScreen />);

    const notificationsSwitch = getByTestId('enable-notifications-switch');
    expect(notificationsSwitch.props.value).toBe(false);

    expect(() =>
      getByTestId('enable-notifications-switch-support-messages'),
    ).toThrow();
  });
});
