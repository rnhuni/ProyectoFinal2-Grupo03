import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import { useTranslation } from 'react-i18next';

export const SurveyScreen = () => {
  const { t } = useTranslation();
  const [rating, setRating] = useState('');
  const [resolutionTime, setResolutionTime] = useState('');
  const [contactEase, setContactEase] = useState('');
  const [staffAttitude, setStaffAttitude] = useState('');
  const [additionalComments, setAdditionalComments] = useState('');

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Título y Descripción */}
        <Text style={styles.title}>{t('surveyScreen.title')}</Text>
        <Text style={styles.description}>{t('surveyScreen.description')}</Text>

        {/* Preguntas de la encuesta */}
        <Text style={styles.label}>{t('surveyScreen.question1')}</Text>
        <Picker
          selectedValue={rating}
          style={styles.picker}
          onValueChange={(itemValue) => setRating(itemValue)}
        >
          <Picker.Item label={t('surveyScreen.escale')} value="" />
          {[1, 2, 3, 4, 5].map((item) => (
            <Picker.Item key={item} label={item.toString()} value={item} />
          ))}
        </Picker>

        <Text style={styles.label}>{t('surveyScreen.question2')}</Text>
        <Picker
          selectedValue={resolutionTime}
          style={styles.picker}
          onValueChange={(itemValue) => setResolutionTime(itemValue)}
        >
          <Picker.Item label={t('surveyScreen.escale')} value="" />
          {[1, 2, 3, 4, 5].map((item) => (
            <Picker.Item key={item} label={item.toString()} value={item} />
          ))}
        </Picker>

        <Text style={styles.label}>{t('surveyScreen.question3')}</Text>
        <Picker
          selectedValue={contactEase}
          style={styles.picker}
          onValueChange={(itemValue) => setContactEase(itemValue)}
        >
          <Picker.Item label={t('surveyScreen.escale')} value="" />
          {[1, 2, 3, 4, 5].map((item) => (
            <Picker.Item key={item} label={item.toString()} value={item} />
          ))}
        </Picker>

        <Text style={styles.label}>{t('surveyScreen.question4')}</Text>
        <Picker
          selectedValue={staffAttitude}
          style={styles.picker}
          onValueChange={(itemValue) => setStaffAttitude(itemValue)}
        >
          <Picker.Item label={t('surveyScreen.escale')} value="" />
          {[1, 2, 3, 4, 5].map((item) => (
            <Picker.Item key={item} label={item.toString()} value={item} />
          ))}
        </Picker>

        <Text style={styles.label}>{t('surveyScreen.question5')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('surveyScreen.placeholder')}
          value={additionalComments}
          onChangeText={(text) => setAdditionalComments(text)}
          multiline
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>{t('surveyScreen.submitButton')}</Text>
        </TouchableOpacity>
      </ScrollView>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
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
    height: 100,
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
