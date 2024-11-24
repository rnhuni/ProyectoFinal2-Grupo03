import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
  Keyboard,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';
import SlideUpModal from './notifications/SlideUpModal';
import useProfile from '../../hooks/user/useProfile';

const Footer = () => {
  const navigation = useNavigation<any>();
  const {t} = useTranslation();

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  // const {reloadProfile} = useProfile();
  const [idUser, setIdUser] = useState('');

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleIncidentReportScreen = () => {
    navigation.navigate('IncidentReportScreen');
  };

  const handleResumeIncidentScreen = () => {
    navigation.navigate('ResumeIncidentScreen');
  };

  const handleSettingsIncidentScreen = () => {
    navigation.navigate('SettingsIncidentScreen');
  };

  if (isKeyboardVisible) {
    // Oculta el footer si el teclado está visible
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Botón para registrar incidente */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleIncidentReportScreen}
          testID="incident-report">
          <View style={styles.iconWrapper}>
            <Icon name="plus" style={styles.icon} />
          </View>
        </TouchableOpacity>
        <Text style={styles.label}>{t('footerScreen.registerIncident')}</Text>
      </View>

      {/* Botón para resumen */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleResumeIncidentScreen}
          testID="resume-incident">
          <View style={styles.iconWrapper}>
            <Icon name="view-dashboard" style={styles.icon} />
          </View>
        </TouchableOpacity>
        <Text style={styles.label}>{t('footerScreen.summary')}</Text>
      </View>

      {/* Botón para configuración */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleSettingsIncidentScreen}
          testID="settings-incident">
          <View style={styles.iconWrapper}>
            <Icon name="cog" style={styles.icon} />
          </View>
        </TouchableOpacity>
        <Text style={styles.label}>{t('footerScreen.settings')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 7,
    backgroundColor: '#3366FF',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  iconWrapper: {
    width: 50,
    height: 27,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    marginBottom: 5,
  },
  icon: {
    fontSize: 25,
    color: '#fff',
  },
  label: {
    color: '#fff',
    fontSize: 12,
  },
});

export default Footer;
