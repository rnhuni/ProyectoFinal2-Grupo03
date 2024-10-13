import {StackScreenProps} from '@react-navigation/stack';
import React, {useState} from 'react';
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

interface LoginScreenProps
  extends StackScreenProps<RootStackParamList, 'LoginScreen'> {}

export const LoginScreen = ({navigation}: LoginScreenProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    if (username === 'admin' && password === '123') {
      Alert.alert('Login Successful', 'Welcome to the app!');
      navigation.navigate('HomeScreen');
    } else {
      Alert.alert('Login Failed', 'Invalid username or password');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a ABCALL</Text>
      <Text style={styles.subtitle}>
        Optimice sus operaciones y reduzca costos inesperados.
      </Text>

      <View style={styles.inputContainer}>
        <Icon name="account-outline" size={20} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Usuario"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock-outline" size={20} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <View style={styles.checkboxContainer}>
        <TouchableOpacity onPress={() => setRememberMe(!rememberMe)}>
          <Text style={styles.checkbox}>{rememberMe ? '☑' : '☐'}</Text>
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>Recordarme</Text>
      </View>

      <Button title="Iniciar Sesión" onPress={handleLogin} />

      <TouchableOpacity
        onPress={() =>
          Alert.alert('Forgot Password', 'Navigate to Forgot Password Screen')
        }>
        <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
        <Text style={styles.link}>Regístrate</Text>
      </TouchableOpacity>
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
});
