import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Footer = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('IncidentReportScreen')}>
          <View style={styles.iconWrapper}>
            <Icon name="plus" style={styles.icon} />
          </View>
        </TouchableOpacity>
        <Text style={styles.label}>Registrar incidente</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('ResumeScreen')}>
          <View style={styles.iconWrapper}>
            <Icon name="view-dashboard" style={styles.icon} />
          </View>
        </TouchableOpacity>
        <Text style={styles.label}>Resumen</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('SettingsScreen')}>
          <View style={styles.iconWrapper}>
            <Icon name="cog" style={styles.icon} />
          </View>
        </TouchableOpacity>
        <Text style={styles.label}>Configuración</Text>
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
    width: 50, // Tamaño del círculo
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
    color: '#fff', // Texto en blanco
    fontSize: 12,
  },
});

export default Footer;
