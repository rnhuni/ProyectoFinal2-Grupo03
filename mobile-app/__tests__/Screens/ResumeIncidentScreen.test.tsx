import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import ResumeIncidentScreen from '../../src/Presentation/Screens/Incidents/ResumeIncidentScreen';
import useIncidents from '../../src/hooks/incidents/useIncidents';
import {I18nextProvider} from 'react-i18next';
import {NavigationContainer} from '@react-navigation/native';
import i18n from '../../src/internalization/i18n';

jest.mock('../../src/hooks/incidents/useIncidents');

const mockReloadIncidents = jest.fn();

const mockIncidents = [
  {
    id: '1',
    type: 'Incident Type 1',
    contact: {phone: '1234567890'},
    description: 'Test Incident 1',
  },
  {
    id: '2',
    type: 'Incident Type 2',
    contact: {phone: '0987654321'},
    description: 'Test Incident 2',
  },
];

(useIncidents as jest.Mock).mockReturnValue({
  incidents: mockIncidents,
  loading: false,
  error: '',
  reloadIncidents: mockReloadIncidents,
});

const renderWithI18n = (component: React.ReactNode) => {
  return render(
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>{component}</NavigationContainer>
    </I18nextProvider>,
  );
};

describe('ResumeIncidentScreen', () => {
  it('should render correctly and display incidents', () => {
    const {getByText} = renderWithI18n(<ResumeIncidentScreen />);

    expect(getByText('Incident Type 1')).toBeTruthy();
    expect(getByText('Incident Type 2')).toBeTruthy();
  });

  it('should open modal when an incident row is pressed', async () => {
    const {getByText, getByTestId} = renderWithI18n(<ResumeIncidentScreen />);
    fireEvent.press(getByText('1'));

    await waitFor(() => {
      expect(getByTestId('detail-modal')).toBeTruthy();
    });

    fireEvent.press(getByText('Close'));
  });

  it('should handle search input change', () => {
    const {getByPlaceholderText} = renderWithI18n(<ResumeIncidentScreen />);

    const searchInput = getByPlaceholderText('Ticket Number');
    fireEvent.changeText(searchInput, 'Incident');

    expect(searchInput.props.value).toBe('Incident');
  });

  it('should display loading indicator when loading is true', () => {
    (useIncidents as jest.Mock).mockReturnValue({
      incidents: [],
      loading: true,
      error: '',
      reloadIncidents: mockReloadIncidents,
    });

    const {getByText} = renderWithI18n(<ResumeIncidentScreen />);

    expect(getByText('Loading...')).toBeTruthy();
  });
});
