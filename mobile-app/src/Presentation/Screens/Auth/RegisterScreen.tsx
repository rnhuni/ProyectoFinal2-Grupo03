import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Controller, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface FormData {
  nombre: string;
  apellido: string;
  email: string;
  pais: string;
  ciudad: string;
  telefono: string;
  contrasena: string;
}

export const RegisterScreen: React.FC = () => {
  const {t, i18n} = useTranslation();
  const {
    control,
    handleSubmit,
    formState: {errors},
    setError,
  } = useForm<FormData>();
  const [selectedCountry, setSelectedCountry] = useState('');

  const countries = [
    {label: 'Colombia', value: 'Colombia'},
    {label: 'México', value: 'México'},
  ];

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  const onSubmit = (data: FormData) => {
    if (!selectedCountry) {
      setError('pais', {
        type: 'manual',
        message: t('registerScreen.countryRequired'),
      });
      return;
    }
    console.log('Datos del formulario:', data);
    Alert.alert(
      t('registerScreen.registrationSuccess'),
      t('registerScreen.registrationMessage'),
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      {/* Logo */}
      <View style={styles.languageSwitch}>
        <TouchableOpacity onPress={toggleLanguage}>
          <Icon name="web" size={25} />
        </TouchableOpacity>
      </View>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../Assets/Logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Título */}
      <Text style={styles.title}>{t('registerScreen.title')}</Text>

      {/* Inputs */}
      <View style={styles.containerInputs}>
        {/* Nombre */}
        <Controller
          control={control}
          name="nombre"
          rules={{required: t('registerScreen.firstNameRequired')}}
          render={({field: {onChange, onBlur, value = ''}}) => (
            <View style={styles.inputContainer}>
              <Text>{t('registerScreen.firstName')}</Text>
              <TextInput
                placeholder={t('registerScreen.firstNamePlaceholder')}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={[styles.input, errors.nombre && styles.inputError]}
              />
              {errors.nombre && (
                <Text style={styles.errorText}>{errors.nombre.message}</Text>
              )}
            </View>
          )}
        />

        {/* Apellido */}
        <Controller
          control={control}
          name="apellido"
          rules={{required: t('registerScreen.lastNameRequired')}}
          render={({field: {onChange, onBlur, value = ''}}) => (
            <View style={styles.inputContainer}>
              <Text>{t('registerScreen.lastName')}</Text>
              <TextInput
                placeholder={t('registerScreen.lastNamePlaceholder')}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={[styles.input, errors.apellido && styles.inputError]}
              />
              {errors.apellido && (
                <Text style={styles.errorText}>{errors.apellido.message}</Text>
              )}
            </View>
          )}
        />

        {/* Correo Electrónico */}
        <Controller
          control={control}
          name="email"
          rules={{
            required: t('registerScreen.emailRequired'),
            pattern: {
              value: /^\S+@\S+$/i,
              message: t('registerScreen.emailInvalid'),
            },
          }}
          render={({field: {onChange, onBlur, value = ''}}) => (
            <View style={styles.inputContainer}>
              <Text>{t('registerScreen.email')}</Text>
              <TextInput
                placeholder="mail@dominio.com"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="email-address"
                autoCapitalize="none"
                style={[styles.input, errors.email && styles.inputError]}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </View>
          )}
        />

        {/* País */}
        <View style={styles.inputContainer}>
          <Text>{t('registerScreen.country')}</Text>
          <Picker
            testID="country-picker"
            selectedValue={selectedCountry}
            onValueChange={itemValue => setSelectedCountry(itemValue)}
            style={styles.picker}>
            <Picker.Item label={t('registerScreen.paisPlaceholder')} value="" />
            {countries.map(country => (
              <Picker.Item
                key={country.value}
                label={country.label}
                value={country.value}
              />
            ))}
          </Picker>
          {errors.pais && (
            <Text style={styles.errorText}>{errors.pais.message}</Text>
          )}
        </View>

        {/* Ciudad */}
        <Controller
          control={control}
          name="ciudad"
          rules={{required: t('registerScreen.cityRequired')}}
          render={({field: {onChange, onBlur, value = ''}}) => (
            <View style={styles.inputContainer}>
              <Text>{t('registerScreen.city')}</Text>
              <TextInput
                placeholder="Escribe tu ciudad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={[styles.input, errors.ciudad && styles.inputError]}
              />
              {errors.ciudad && (
                <Text style={styles.errorText}>{errors.ciudad.message}</Text>
              )}
            </View>
          )}
        />

        {/* Teléfono */}
        <Controller
          control={control}
          name="telefono"
          rules={{
            required: t('registerScreen.phoneRequired'),
            minLength: {value: 7, message: t('registerScreen.phoneInvalid')},
          }}
          render={({field: {onChange, onBlur, value = ''}}) => (
            <View style={styles.inputContainer}>
              <Text>{t('registerScreen.phone')}</Text>
              <TextInput
                placeholder={t('registerScreen.telefonoPlaceholder')}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="phone-pad"
                style={[styles.input, errors.telefono && styles.inputError]}
              />
              {errors.telefono && (
                <Text style={styles.errorText}>{errors.telefono.message}</Text>
              )}
            </View>
          )}
        />

        {/* Contraseña */}
        <Controller
          control={control}
          name="contrasena"
          rules={{
            required: t('registerScreen.passwordRequired'),
            minLength: {
              value: 6,
              message: t('registerScreen.passwordInvalid'),
            },
          }}
          render={({field: {onChange, onBlur, value = ''}}) => (
            <View style={styles.inputContainer}>
              <Text>{t('registerScreen.password')}</Text>
              <TextInput
                placeholder={t('registerScreen.contrasenaPlaceholder')}
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={[styles.input, errors.contrasena && styles.inputError]}
              />
              {errors.contrasena && (
                <Text style={styles.errorText}>
                  {errors.contrasena.message}
                </Text>
              )}
            </View>
          )}
        />
      </View>

      {/* Botón de registro */}
      <Button
        title={t('registerScreen.submitButton')}
        onPress={handleSubmit(onSubmit)}
        color="#3366FF"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  containerInputs: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  picker: {
    height: 50,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  languageSwitch: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
});
