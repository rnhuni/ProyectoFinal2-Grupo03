import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next'; // Importamos el hook para la traducción

const Header = () => {
  const navigation = useNavigation();
  const {i18n} = useTranslation(); // Hook para usar la función de cambio de idioma

  // Función para alternar entre idiomas (español e inglés en este caso)
  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLanguage);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="keyboard-backspace" style={styles.icon} />
      </TouchableOpacity>
      <Text style={styles.title}>ABCcall</Text>
      <View style={styles.iconContainer}>
        <Icon name="magnify" style={styles.icon} />
        <Icon name="bell-outline" style={styles.icon} />
        <Icon name="account-outline" style={styles.icon} />

        {/* Botón para cambiar el idioma */}
        <TouchableOpacity onPress={toggleLanguage}>
          <Icon name="web" style={styles.icon} />
        </TouchableOpacity>
      </View>
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
    fontSize: 30,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 30,
    marginHorizontal: 5,
  },
});

export default Header;
