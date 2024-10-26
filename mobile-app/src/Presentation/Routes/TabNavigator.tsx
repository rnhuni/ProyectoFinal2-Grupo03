import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {IncidentReportScreen} from '../Screens/Incidents/IncidentReportScreen';
import {ResumeIncidentScreen} from '../Screens/Incidents/ResumeIncidentScreen';

const Tab = createBottomTabNavigator();

import {RouteProp} from '@react-navigation/native';
import {SettingsIncidentScreen} from '../Screens/Incidents/SettingsIncidentScreen';

const TabBarIcon = ({
  route,
  color,
  size,
}: {
  route: RouteProp<Record<string, object | undefined>, string>;
  color: string;
  size: number;
}) => {
  let iconName: string;

  switch (route.name) {
    case 'IncidentReportScreen':
      iconName = 'plus';
      break;
    case 'ResumeIncidentScreen':
      iconName = 'view-dashboard';
      break;
    case 'SettingsIncidentScreen':
      iconName = 'cog';
      break;
    default:
      iconName = 'question';
      break;
  }

  return <Icon name={iconName} size={size} color={color} />;
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: props => <TabBarIcon route={route} {...props} />,
        tabBarActiveTintColor: '#3366FF',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen
        name="IncidentReportScreen"
        component={IncidentReportScreen}
        options={{title: 'Registrar incidente'}}
      />
      <Tab.Screen
        name="ResumeIncidentScreen"
        component={ResumeIncidentScreen}
        options={{title: 'ResumeIncidentScreen'}}
      />
      <Tab.Screen
        name="SettingsIncidentScreen"
        component={SettingsIncidentScreen}
        options={{title: 'SettingsIncidentScreen'}}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
