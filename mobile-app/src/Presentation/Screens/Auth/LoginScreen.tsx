import {StackScreenProps} from '@react-navigation/stack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {RootStackParamList} from '../../Routes/StackNavigator';
import {loginUser} from '../../../services/authService';
import {setToken} from '../../../api/api';

interface LoginScreenProps
  extends StackScreenProps<RootStackParamList, 'LoginScreen'> {}

export const LoginScreen = ({navigation}: LoginScreenProps) => {
  const {t, i18n} = useTranslation();
  const [username, setUsername] = useState('oeramirezb@gmail.com');
  const [password, setPassword] = useState('T0rr3sd31nn0v0!');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    try {
      const authResult = await loginUser(username, password);
      setToken(authResult.IdToken);
      // console.log(authResult.IdToken);
      navigation.navigate('HomeScreen');
    } catch (error) {
      setToken('');
      Alert.alert(
        t('loginScreen.loginFailed'),
        t('loginScreen.invalidCredentials'),
      );
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  const handleremeberMe = () => {
    setRememberMe(!rememberMe);
  };

  return (
    <View style={styles.container}>
      <View style={styles.languageSwitch}>
        <TouchableOpacity onPress={toggleLanguage} testID="languaje-button">
          <Icon name="web" size={25} />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>{t('loginScreen.welcome')}</Text>
      <Text style={styles.subtitle}>{t('loginScreen.optimizeOperations')}</Text>

      <View style={styles.inputContainer}>
        <Icon name="account-outline" size={20} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder={t('loginScreen.username')}
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock-outline" size={20} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder={t('loginScreen.password')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <View style={styles.checkboxContainer}>
        <TouchableOpacity onPress={handleremeberMe} testID="remember-button">
          <Text style={styles.checkbox}>{rememberMe ? '☑' : '☐'}</Text>
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>{t('loginScreen.rememberMe')}</Text>
      </View>
      <Button
        title={t('loginScreen.login')}
        onPress={handleLogin}
        testID="login-button"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#8F9BB3',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    fontSize: 18,
  },
  checkboxLabel: {
    marginLeft: 8,
  },
  link: {
    color: '#3366FF',
    textAlign: 'center',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  languageSwitch: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
});
