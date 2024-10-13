import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Header = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="keyboard-backspace" style={styles.icon} />
        {/* Corrige el nombre del icono */}
      </TouchableOpacity>
      <Text style={styles.title}>ABCcall</Text>
      <View style={styles.iconContainer}>
        <Icon name="magnify" style={styles.icon} />
        {/* Corrige el nombre del icono */}
        <Icon name="bell-outline" style={styles.icon} />
        <Icon name="account-outline" style={styles.icon} />
        {/* Corrige el nombre del icono */}
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
