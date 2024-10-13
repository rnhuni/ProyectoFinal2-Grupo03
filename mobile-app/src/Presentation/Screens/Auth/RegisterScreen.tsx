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
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Controller, useForm} from 'react-hook-form';

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

  const onSubmit = (data: FormData) => {
    if (!selectedCountry) {
      setError('pais', {type: 'manual', message: 'País es requerido'});
      return;
    }
    console.log('Datos del formulario:', data);
    Alert.alert('Registro exitoso', '¡Te has registrado correctamente!');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../Assets/Logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Título */}
      <Text style={styles.title}>Vamos a empezar</Text>

      {/* Inputs */}
      <View style={styles.containerInputs}>
        {/* Nombre */}
        <Controller
          control={control}
          name="nombre"
          rules={{required: 'Nombre es requerido'}}
          render={({field: {onChange, onBlur, value = ''}}) => (
            <View style={styles.inputContainer}>
              <Text>Nombre</Text>
              <TextInput
                placeholder="Escribe tu nombre"
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
          rules={{required: 'Apellido es requerido'}}
          render={({field: {onChange, onBlur, value = ''}}) => (
            <View style={styles.inputContainer}>
              <Text>Apellido</Text>
              <TextInput
                placeholder="Escribe tu apellido"
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
            required: 'Correo electrónico es requerido',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Correo electrónico no es válido',
            },
          }}
          render={({field: {onChange, onBlur, value = ''}}) => (
            <View style={styles.inputContainer}>
              <Text>Correo electrónico</Text>
              <TextInput
                placeholder="tucorreo@dominio.com"
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
          <Text>País</Text>
          <Picker
            testID="country-picker"
            selectedValue={selectedCountry}
            onValueChange={itemValue => setSelectedCountry(itemValue)}
            style={styles.picker}>
            <Picker.Item label="Selecciona un país" value="" />
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
          rules={{required: 'Ciudad es requerida'}}
          render={({field: {onChange, onBlur, value = ''}}) => (
            <View style={styles.inputContainer}>
              <Text>Ciudad</Text>
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
            required: 'Número de teléfono es requerido',
            minLength: {value: 7, message: 'Debe tener al menos 7 caracteres'},
          }}
          render={({field: {onChange, onBlur, value = ''}}) => (
            <View style={styles.inputContainer}>
              <Text>Número de teléfono</Text>
              <TextInput
                placeholder="Número de teléfono"
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
            required: 'La contraseña es requerida',
            minLength: {
              value: 6,
              message: 'La contraseña debe tener al menos 6 caracteres',
            },
          }}
          render={({field: {onChange, onBlur, value = ''}}) => (
            <View style={styles.inputContainer}>
              <Text>Contraseña</Text>
              <TextInput
                placeholder="Escribe tu contraseña"
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
        title="Empezar"
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
});
