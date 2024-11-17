import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react-native';
import {SurveyScreen} from '../../src/Presentation/Screens/Survey/SurveyScreen';
import {NavigationContainer} from '@react-navigation/native';
import {SurveyScreenProps} from '../../src/Presentation/Screens/Survey/SurveyScreen';
import {createStackNavigator} from '@react-navigation/stack';
import {I18nextProvider} from 'react-i18next';
import i18n from '../../src/internalization/i18n';
// Mock de la navegación
const Stack = createStackNavigator();

const MockNavigator = () => {
  const mockProps: SurveyScreenProps = {
    navigation: {navigate: jest.fn(), goBack: jest.fn()} as any,
    route: {params: {ticketId: '123'}} as any,
  };

  return (
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="SurveyScreen">
            {() => <SurveyScreen {...mockProps} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </I18nextProvider>
  );
};

describe('SurveyScreen', () => {
  it('should render SurveyScreen correctly', () => {
    render(<MockNavigator />);

    expect(screen.getByText(i18n.t('surveyScreen.title'))).toBeTruthy();
    expect(screen.getByText(i18n.t('surveyScreen.description'))).toBeTruthy();
  });

  it('should update state when user selects a rating', () => {
    const {getByTestId} = render(<MockNavigator />);
    const picker = getByTestId('rating-picker');
    fireEvent(picker, 'onValueChange', '4');
  });

  it('should submit the form and log the feedback data', () => {
    const {getByTestId} = render(<MockNavigator />);
    const ratingPicker = getByTestId('rating-picker');
    fireEvent(ratingPicker, 'onValueChange', '4');

    const resolutionPicker = getByTestId('resolution-picker');
    fireEvent(resolutionPicker, 'onValueChange', '4');

    const contactPicker = getByTestId('contact-picker');
    fireEvent(contactPicker, 'onValueChange', '4');

    const staffPicker = getByTestId('staff-picker');
    fireEvent(staffPicker, 'onValueChange', '4');

    const additional_comments = getByTestId('additional-comments-input');

    fireEvent.changeText(additional_comments, 'Comentario adicional');

    const submit_button = getByTestId('submit-button');

    fireEvent.press(submit_button);
  });

  it('should submit no data form', () => {
    const {getByTestId} = render(<MockNavigator />);
    const ratingPicker = getByTestId('rating-picker');
    fireEvent(ratingPicker, 'onValueChange', '0');

    const resolutionPicker = getByTestId('resolution-picker');
    fireEvent(resolutionPicker, 'onValueChange', '0');

    const contactPicker = getByTestId('contact-picker');
    fireEvent(contactPicker, 'onValueChange', '0');

    const staffPicker = getByTestId('staff-picker');
    fireEvent(staffPicker, 'onValueChange', '0');

    const additional_comments = getByTestId('additional-comments-input');

    fireEvent.changeText(additional_comments, '');

    const submit_button = getByTestId('submit-button');

    fireEvent.press(submit_button);
  });

  it('should submit no comment data form', () => {
    const {getByTestId} = render(<MockNavigator />);
    const ratingPicker = getByTestId('rating-picker');
    fireEvent(ratingPicker, 'onValueChange', '1');

    const resolutionPicker = getByTestId('resolution-picker');
    fireEvent(resolutionPicker, 'onValueChange', '1');

    const contactPicker = getByTestId('contact-picker');
    fireEvent(contactPicker, 'onValueChange', '1');

    const staffPicker = getByTestId('staff-picker');
    fireEvent(staffPicker, 'onValueChange', '1');

    const additional_comments = getByTestId('additional-comments-input');

    fireEvent.changeText(additional_comments, '');

    const submit_button = getByTestId('submit-button');

    fireEvent.press(submit_button);
  });
});
