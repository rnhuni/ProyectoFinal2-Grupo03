import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {StackNavigator} from './Presentation/Routes/StackNavigator';
import {I18nextProvider} from 'react-i18next';
import i18n from './internalization/i18n';

export const App = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </I18nextProvider>
  );
};
