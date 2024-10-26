import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next'; // Importar hook de traducción

const Footer = () => {
  const navigation = useNavigation<any>();
  const {t} = useTranslation(); // Usar el hook de traducción

  return (
    <View style={styles.container}>
      {/* Botón para registrar incidente */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('IncidentReportScreen')}>
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
          onPress={() => navigation.navigate('ResumeIncidentScreen')}>
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
          onPress={() => navigation.navigate('SettingsIncidentScreen')}>
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
    paddingVertical: 10,
    backgroundColor: '#3366FF',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    marginBottom: 5,
  },
  icon: {
    fontSize: 40,
    color: '#fff',
  },
  label: {
    color: '#fff',
    fontSize: 12,
  },
});

export default Footer;
