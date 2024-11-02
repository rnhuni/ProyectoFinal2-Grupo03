import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import useIncidents from '../../../hooks/incidents/useIncidents';
import {Contact, Incident} from '../../../interfaces/Indicents';

export const IncidentReportScreen = () => {
  const {t} = useTranslation(); // Usamos el hook para acceder a las traducciones
  const [incidentType, setIncidentType] = useState<string>(
    t('incidentReportScreen.incidentType.placeholder'),
  );
  const [phoneNumber, setPhoneNumber] = useState('3007072375');
  const [description, setDescription] = useState('Oscar Incident Created');
  const {incidents, loading, error, createIncident} = useIncidents();

  const handleRegisterIncident = async () => {
    try {
      const incidentContact: Contact = {
        phone: phoneNumber,
      };
      const incidentData: Incident = {
        type: incidentType,
        description: description,
        contact: incidentContact,
      };
      console.log(incidentData);
      const result = await createIncident(incidentData);
      console.log(result);
      // Maneja la respuesta exitosa aquí
      alert('Incidente registrado con éxito');
    } catch (error) {
      // Maneja el error aquí
      alert('Error al registrar el incidente');
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      {/* Contenido */}
      <View style={styles.content}>
        {/* Pestañas */}
        <View style={styles.tabs}>
          {/* <TouchableOpacity>
            <Text style={styles.activeTab}>
              {t('incidentReportScreen.tabs.summary')}
            </Text>
          </TouchableOpacity> */}
          <TouchableOpacity>
            <Text testID="register-text" style={styles.tab}>
              {t('incidentReportScreen.tabs.register')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tipo de incidente usando Picker */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            {t('incidentReportScreen.incidentType.label')}
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={incidentType}
              onValueChange={itemValue => setIncidentType(itemValue)}
              style={styles.picker}
              testID="incident-type-picker">
              <Picker.Item
                label={t('incidentReportScreen.incidentType.placeholder')}
                value=""
              />
              <Picker.Item
                label={t(
                  'incidentReportScreen.incidentType.incidents.incident1',
                )}
                value="Incidente 1"
              />
              <Picker.Item
                label={t(
                  'incidentReportScreen.incidentType.incidents.incident2',
                )}
                value="Incidente 2"
              />
              <Picker.Item
                label={t(
                  'incidentReportScreen.incidentType.incidents.incident3',
                )}
                value="Incidente 3"
              />
            </Picker>
          </View>
          <Text testID="selected-incident-type">{incidentType}</Text>
        </View>

        {/* Número de teléfono */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            {t('incidentReportScreen.phoneNumber.label')}
          </Text>
          <TextInput
            placeholder={t('incidentReportScreen.phoneNumber.placeholder')}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            style={styles.input}
            testID="phone-number-input"
          />
        </View>

        {/* Descripción */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            {t('incidentReportScreen.description.label')}
          </Text>
          <TextInput
            placeholder={t('incidentReportScreen.description.placeholder')}
            multiline
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
            style={[styles.input, {minHeight: 100}]}
            testID="description-input"
          />
        </View>

        {/* Subir archivo */}
        <View style={styles.fileUpload}>
          <TouchableOpacity style={styles.uploadButton}>
            <Icon name="file-upload" size={20} style={styles.uploadIcon} />
            <Text style={styles.uploadText}>
              {t('incidentReportScreen.fileUpload.buttonText')}
            </Text>
          </TouchableOpacity>
          <Button
            title={t('incidentReportScreen.fileUpload.addFileButton')}
            onPress={() => {}}
          />
        </View>

        {/* Botón para registrar incidente */}
        <TouchableOpacity
          style={styles.registerButton}
          testID="register-button"
          onPress={handleRegisterIncident}>
          <Text style={styles.registerButtonText}>
            {t('incidentReportScreen.registerButton')}
          </Text>
        </TouchableOpacity>
      </View>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  activeTab: {
    color: '#3366FF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  tab: {
    color: 'black',
    fontSize: 18,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    color: '#8F9BB3',
    fontSize: 16,
  },
  input: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderColor: '#E4E9F2',
    borderWidth: 1,
    backgroundColor: '#fff',
    color: '#000',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E4E9F2',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  picker: {
    width: '100%',
    height: 50,
  },
  fileUpload: {
    borderWidth: 1,
    borderColor: '#E4E9F2',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadIcon: {
    fontSize: 24,
    marginRight: 10,
    color: '#3366FF',
  },
  uploadText: {
    color: '#8F9BB3',
  },
  registerButton: {
    backgroundColor: '#3366FF',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
