import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  Alert,
  ScrollView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useTranslation} from 'react-i18next';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import {Contact, Incident, Attachment} from '../../../interfaces/Incidents';
import useIncidents from '../../../hooks/incidents/useIncidents';
import useFileUpload from '../../../hooks/uploadFile/useFileUpload';
import {useNavigation} from '@react-navigation/native';
import useChannels from '../../../hooks/channel/useChannels';

export const IncidentReportScreen = () => {
  const {t} = useTranslation();
  const [incidentType, setIncidentType] = useState<string>(
    "t('incidentReportScreen.incidentType.placeholder')",
  );
  const [phoneNumber, setPhoneNumber] = useState('');
  const [description, setDescription] = useState('');
  const {createIncident} = useIncidents();
  const {createIncidentSession} = useChannels();

  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showProgressBox, setShowProgressBox] = useState(false);
  const navigation = useNavigation<any>();

  const {
    getUploadUrl,
    uploadFile,
    uploadProgress,
    loading: fileLoading,
  } = useFileUpload();

  const handleRegisterIncident = async () => {
    const uploadedAttachments = [];

    try {
      for (const attachment of attachments) {
        if (attachment.fileObject && attachment.file_uri) {
          //console.log("5. enviando de veritas");
          const file = new File([attachment.file_uri], attachment.file_name, {
            type: attachment.content_type,
          });

          //console.log("5.1. el archivo en file", file );
          const success = await uploadFile(file, attachment.file_uri);
          //console.log("6. a ver q paso >", success);
          if (success) {
            uploadedAttachments.push({
              id: attachment.id,
              file_name: attachment.file_name,
              content_type: attachment.content_type,
              file_uri: attachment.file_uri,
            });
          }
        }
      }

      const incidentContact: Contact = {
        phone: phoneNumber,
      };
      const incidentData: Incident = {
        type: incidentType,
        description: description,
        contact: incidentContact,
      };
      incidentData.attachments = uploadedAttachments;
      //console.log(incidentData);
      const result = await createIncident(incidentData);
      //console.log(result);
      // crer la suscripcion
      const id = result?.id;
      if (id) {
        // console.log('creando la sesion para el chat !!!!!!!!!!!!!!!!');
        await createIncidentSession(id);
      }
      alert('Incidente registrado con éxito');
      navigation.navigate('ResumeIncidentScreen');
    } catch (error) {
      // console.error('Error al registrar el incidente:', error); // Registrar el error en la consola
      alert('Error al registrar el incidente');
    }
  };

  const handleFilePick = async () => {
    //console.log("1. cargando archivo");
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      handleFileUpload(result); // Procesa el archivo cargado
    } catch (err) {
      // console.error(err);
    }
  };

  const handleFileUpload = async (result: DocumentPickerResponse[]) => {
    //console.log("2. procesando el archivo");
    if (result && result.length > 0) {
      const newAttachments: Attachment[] = [];
      for (const file of Array.from(result)) {
        // const isAcceptedType = [
        //   "text/csv",
        //   "application/vnd.ms-excel",
        //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        // ].includes(file.type ?? '');

        // if (!isAcceptedType) {
        //   Alert.alert("Formato de archivo incorrecto");

        //   continue;
        // }
        //console.log("3. archivo aceptado archivo");
        //console.log(file.name);
        //console.log(file.type);
        if (file.name && file.type) {
          const uploadData = await getUploadUrl(file.name, file.type);
          if (uploadData) {
            newAttachments.push({
              id: uploadData.media_id,
              file_name: uploadData.media_name,
              content_type: uploadData.content_type,
              file_uri: uploadData.upload_url,
              fileObject: file,
            });
          } // Guarda el archivo seleccionado en el estado
          //console.log("4. digamos que esta en cache, hay que darle guardar para enviarlo de veritas");
          // Alert.alert("Archivo cargado", `Archivo: ${file.name}`); // Mostrar una alerta con el nombre del archivo
        }
      }

      setAttachments(prev => [...prev, ...newAttachments]);
      setShowProgressBox(true);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      {/* Contenido */}
      <View style={styles.content}>
        {/* Pestañas */}
        <Text testID="register-text" style={styles.title}>
          {t('incidentReportScreen.tabs.register')}
        </Text>

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
                value="technical"
              />
              <Picker.Item
                label={t(
                  'incidentReportScreen.incidentType.incidents.incident2',
                )}
                value="billing"
              />
              <Picker.Item
                label={t(
                  'incidentReportScreen.incidentType.incidents.incident3',
                )}
                value="general"
              />
              <Picker.Item
                label={t(
                  'incidentReportScreen.incidentType.incidents.incident4',
                )}
                value="security"
              />
              <Picker.Item
                label={t(
                  'incidentReportScreen.incidentType.incidents.incident5',
                )}
                value="maintenance"
              />
            </Picker>
          </View>
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

        {attachments.length > 0 && (
          <View style={styles.attach_container}>
            <Text style={styles.attach_label}>Archivos Adjuntos Cargados</Text>
            <ScrollView horizontal style={styles.attach_scrollView}>
              {attachments.map(attachment => (
                <View key={attachment.id} style={styles.attach_badge}>
                  <Text style={styles.attach_badgeText}>
                    {attachment.file_name}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.attach_container}>
          <Text style={styles.attach_label}>
            {t('incidentReportScreen.fileUpload.buttonText')}
          </Text>
          <Button
            onPress={handleFilePick}
            title={t('incidentReportScreen.fileUpload.addFileButton')}
            color="#6C728F"
            testID="file-upload-button"
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
  attach_container: {
    marginBottom: 16,
  },
  attach_label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  attach_scrollView: {
    flexDirection: 'row',
  },
  attach_badge: {
    backgroundColor: '#purple', // Cambia por el color que prefieras
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  attach_badgeText: {
    color: '#000',
  },
  attach_button: {
    width: '65%',
    alignSelf: 'center',
  },
  title: {
    width: '100%',
    textAlign: 'center',
    fontSize: 20,
    paddingTop: 20,
    fontWeight: 'bold',
  },
});
