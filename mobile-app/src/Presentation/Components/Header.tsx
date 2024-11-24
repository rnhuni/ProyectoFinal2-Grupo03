import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next'; // Importamos el hook para la traducción
import SlideUpModal from './notifications/SlideUpModal';

const Header = () => {
  const navigation = useNavigation();
  const {i18n} = useTranslation();
  const [isVisibleSlideUp, setIsVisibleSlideUp] = useState(false);

  const handleResumeIncidentScreen = () => {
    navigation.navigate('ResumeIncidentScreen' as never);
  };

  // Función para alternar entre idiomas (español e inglés en este caso)
  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLanguage);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleOnCloseSlideUp = () => {
    //console.log('handleOnCloseSlideUp CLOSE');
    setIsVisibleSlideUp(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleGoBack} testID="go-back">
        <Icon name="keyboard-backspace" style={styles.icon} />
      </TouchableOpacity>
      <Text style={styles.title}>ABCall</Text>
      <View style={styles.iconContainer}>
        <TouchableOpacity
          onPress={handleResumeIncidentScreen}
          testID="toggle-magnify">
          <Icon name="magnify" style={styles.icon} />
        </TouchableOpacity>
        <Icon name="bell-outline" style={styles.icon} />
        <Icon name="account-outline" style={styles.icon} />

        {/* Botón para cambiar el idioma */}
        <TouchableOpacity onPress={toggleLanguage} testID="toggle-languaje">
          <Icon name="web" style={styles.icon} />
        </TouchableOpacity>
      </View>
      {
        //isVisibleSlideUp && (
        <SlideUpModal visible={false} onClose={handleOnCloseSlideUp} />
        // )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  title: {
    fontSize: 25,
    paddingLeft: 15,
    textAlign: 'left',
    width: '50%',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 25,
    marginHorizontal: 5,
    paddingLeft: 5,
  },
});

export default Header;
