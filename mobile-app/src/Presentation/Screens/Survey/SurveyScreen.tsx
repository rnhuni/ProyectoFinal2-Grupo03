import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import {useTranslation} from 'react-i18next';
import {RootStackParamList} from '../../Routes/StackNavigator';
import {StackScreenProps} from '@react-navigation/stack';
import useIncidents from '../../../hooks/incidents/useIncidents';
import {Feedback} from '../../../interfaces/Feedback';
import {useNavigation} from '@react-navigation/native';

export type SurveyScreenProps = StackScreenProps<
  RootStackParamList,
  'SurveyScreen'
>;

export const SurveyScreen = ({route}: SurveyScreenProps) => {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  // Estado para los valores de la encuesta
  const [rating, setRating] = useState('');
  const [resolutionTime, setResolutionTime] = useState('');
  const [contactEase, setContactEase] = useState('');
  const [staffAttitude, setStaffAttitude] = useState('');
  const [additionalComments, setAdditionalComments] = useState('');
  const [error, setError] = useState<string | null>(null);
  const {createFeedback} = useIncidents();

  // ID del tiquete pasado por la navegación (por ejemplo, a través de react-navigation)
  const ticketId = route?.params?.ticketId;
  // console.log('Ticket ID:', ticketId);

  const validateFields = (): boolean => {
    // Convertir los valores a números
    const ratingNum = Number(rating);
    const contactEaseNum = Number(contactEase);
    const resolutionTimeNum = Number(resolutionTime);
    const staffAttitudeNum = Number(staffAttitude);

    // Validar que los campos numéricos sean al menos 1
    if (
      ratingNum < 1 ||
      isNaN(ratingNum) ||
      contactEaseNum < 1 ||
      isNaN(contactEaseNum) ||
      resolutionTimeNum < 1 ||
      isNaN(resolutionTimeNum) ||
      staffAttitudeNum < 1 ||
      isNaN(staffAttitudeNum)
    ) {
      setError(t('surveyScreen.validations.number'));
      return false;
    }

    // Validar que additional_comments sea un texto no vacío
    if (
      !additionalComments ||
      typeof additionalComments !== 'string' ||
      additionalComments.trim() === ''
    ) {
      setError(t('surveyScreen.validations.string'));
      return false;
    }

    setError(null); // Restablecer el error si todo es válido
    return true;
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async () => {
    if (!validateFields()) {
      Alert.alert('Error', error || t('surveyScreen.validations.error'));
      return;
    }
    const feedbackData: Feedback = {
      support_rating: Number(rating),
      ease_of_contact: Number(contactEase),
      resolution_time: Number(resolutionTime),
      support_staff_attitude: Number(staffAttitude),
      additional_comments: additionalComments,
    };
    try {
      // console.log('Ticket ID:', ticketId);
      // console.log('Feedback Data:', feedbackData);
      const result = await createFeedback(ticketId, feedbackData);
      navigation.navigate('ResumeIncidentScreen');
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        {/* Título y Descripción */}
        <Text style={styles.title}>{t('surveyScreen.title')}</Text>
        <Text style={styles.description}>{t('surveyScreen.description')}</Text>

        {/* ID del tiquete */}
        {ticketId && (
          <Text style={styles.ticketId}>ID de Tiquete: {ticketId}</Text>
        )}

        {/* Preguntas de la encuesta */}
        <Text style={styles.label}>{t('surveyScreen.question1')}</Text>
        <Picker
          selectedValue={rating}
          style={styles.picker}
          onValueChange={itemValue => setRating(itemValue)}
          testID="rating-picker">
          <Picker.Item label={t('surveyScreen.escale')} value="" />
          {[1, 2, 3, 4, 5].map(item => (
            <Picker.Item key={item} label={item.toString()} value={item} />
          ))}
        </Picker>

        <Text style={styles.label}>{t('surveyScreen.question2')}</Text>
        <Picker
          selectedValue={resolutionTime}
          style={styles.picker}
          onValueChange={itemValue => setResolutionTime(itemValue)}
          testID="resolution-picker">
          <Picker.Item label={t('surveyScreen.escale')} value="" />
          {[1, 2, 3, 4, 5].map(item => (
            <Picker.Item key={item} label={item.toString()} value={item} />
          ))}
        </Picker>

        <Text style={styles.label}>{t('surveyScreen.question3')}</Text>
        <Picker
          selectedValue={contactEase}
          style={styles.picker}
          onValueChange={itemValue => setContactEase(itemValue)}
          testID="contact-picker">
          <Picker.Item label={t('surveyScreen.escale')} value="" />
          {[1, 2, 3, 4, 5].map(item => (
            <Picker.Item key={item} label={item.toString()} value={item} />
          ))}
        </Picker>

        <Text style={styles.label}>{t('surveyScreen.question4')}</Text>
        <Picker
          selectedValue={staffAttitude}
          style={styles.picker}
          onValueChange={itemValue => setStaffAttitude(itemValue)}
          testID="staff-picker">
          <Picker.Item label={t('surveyScreen.escale')} value="" />
          {[1, 2, 3, 4, 5].map(item => (
            <Picker.Item key={item} label={item.toString()} value={item} />
          ))}
        </Picker>

        <Text style={styles.label}>{t('surveyScreen.question5')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('surveyScreen.placeholder')}
          value={additionalComments}
          onChangeText={text => setAdditionalComments(text)}
          multiline
          testID="additional-comments-input"
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text testID="submit-button" style={styles.buttonText}>
            {t('surveyScreen.submitButton')}
          </Text>
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
  ticketId: {
    fontSize: 14,
    color: '#888',
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
