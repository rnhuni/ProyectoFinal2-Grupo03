import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const SurveyScreen = () => {
  const [rating, setRating] = useState('');
  const [resolutionTime, setResolutionTime] = useState('');
  const [contactEase, setContactEase] = useState('');
  const [staffAttitude, setStaffAttitude] = useState('');
  const [additionalComments, setAdditionalComments] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Calificación general del soporte recibido</Text>
      <Picker
        selectedValue={rating}
        style={styles.picker}
        onValueChange={(itemValue) => setRating(itemValue)}
      >
        <Picker.Item label="Escala de 1 a 5" value="" />
        {[1, 2, 3, 4, 5].map((item) => (
          <Picker.Item key={item} label={item.toString()} value={item} />
        ))}
      </Picker>

      <Text style={styles.label}>Tiempo de resolución</Text>
      <Picker
        selectedValue={resolutionTime}
        style={styles.picker}
        onValueChange={(itemValue) => setResolutionTime(itemValue)}
      >
        <Picker.Item label="Escala de 1 a 5" value="" />
        {[1, 2, 3, 4, 5].map((item) => (
          <Picker.Item key={item} label={item.toString()} value={item} />
        ))}
      </Picker>

      <Text style={styles.label}>Facilidad para contactar con el soporte</Text>
      <Picker
        selectedValue={contactEase}
        style={styles.picker}
        onValueChange={(itemValue) => setContactEase(itemValue)}
      >
        <Picker.Item label="Escala de 1 a 5" value="" />
        {[1, 2, 3, 4, 5].map((item) => (
          <Picker.Item key={item} label={item.toString()} value={item} />
        ))}
      </Picker>

      <Text style={styles.label}>Actitud del personal de soporte</Text>
      <Picker
        selectedValue={staffAttitude}
        style={styles.picker}
        onValueChange={(itemValue) => setStaffAttitude(itemValue)}
      >
        <Picker.Item label="Escala de 1 a 5" value="" />
        {[1, 2, 3, 4, 5].map((item) => (
          <Picker.Item key={item} label={item.toString()} value={item} />
        ))}
      </Picker>

      <Text style={styles.label}>Comentarios adicionales</Text>
      <TextInput
        style={styles.input}
        placeholder="Enviar un mensaje"
        value={additionalComments}
        onChangeText={(text) => setAdditionalComments(text)}
        multiline
      />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Enviar encuesta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  picker: {
    height: 50,
    backgroundColor: '#f5f5f5',
    marginBottom: 20,
  },
  input: {
    height: 80,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#3366ff',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SurveyScreen;
