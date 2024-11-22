// DetailModal.tsx
import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Chat from '../Chat/Chat';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import useProfile from '../../../hooks/user/useProfile';

interface DetailModalProps {
  visible: boolean;
  onClose: () => void;
  data: {
    id: string;
    description: string;
    type: string;
    created_at: string;
    updated_at: string;
    user_issuer_id?: string;
    user_issuer_name: string;
    contact: {
      phone: string;
    };
    attachments: object[];
  };
}

const DetailModal: React.FC<DetailModalProps> = ({visible, onClose, data}) => {
  const navigation = useNavigation<any>();
  const {t} = useTranslation();

  const {reloadProfile} = useProfile();
  const [roleUser, setRoleUser] = useState<string>('user');
  const [nameUser, setNameUser] = useState<string>('');

  const surveyLaunch = () => {
    // console.log('Survey Launch', data.id);
    navigation.navigate('SurveyScreen', {ticketId: data.id});
  };

  useEffect(() => {
    const loadProfile = async () => {
      const profile = await reloadProfile();
      if (profile) {
        const parts = (profile.user.role as string).split('-');
        const rol = parts.length > 2 ? parts[1] : '';
        const nam = profile.user.name as string;
        setRoleUser(rol);
        setNameUser(nam);
      }
    };
    loadProfile();
  }, []);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      testID="detail-modal">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>
            {t('resumeIncidentScreen.detailModal.title')}
          </Text>
          <ScrollView>
            <View style={styles.detailRow}>
              <Text style={styles.label}>
                {t('resumeIncidentScreen.detailModal.id')}
              </Text>
              <Text style={styles.value}>{data.id}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>
                {t('resumeIncidentScreen.detailModal.description')}
              </Text>
              <Text style={styles.value}>{data.description}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>
                {t('resumeIncidentScreen.detailModal.type')}
              </Text>
              <Text style={styles.value}>{data.type}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>
                {t('resumeIncidentScreen.detailModal.createdAt')}
              </Text>
              <Text style={styles.value}>{data.created_at}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>
                {t('resumeIncidentScreen.detailModal.updatedAt')}
              </Text>
              <Text style={styles.value}>{data.updated_at}</Text>
            </View>
            {/* <View style={styles.detailRow}>
              <Text style={styles.label}>User Issuer ID:</Text>
              <Text style={styles.value}>{data.user_issuer_id}</Text>
            </View> */}
            <View style={styles.detailRow}>
              <Text style={styles.label}>
                {t('resumeIncidentScreen.detailModal.user_name')}
              </Text>
              <Text style={styles.value}>{data.user_issuer_name}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>
                {t('resumeIncidentScreen.detailModal.contact_phone')}
              </Text>
              <Text style={styles.value}>{data.contact.phone}</Text>
            </View>
            {/* Render attachments if needed */}
            {/* Añadir el componente Chat al final */}
            <View style={styles.chatContainer}>
              <Chat id={data.id} />
            </View>
          </ScrollView>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            testID="close-button">
            <Text style={styles.closeButtonText}>
              {t('resumeIncidentScreen.detailModal.close_button')}
            </Text>
          </TouchableOpacity>

          {roleUser === 'user' && (
            <TouchableOpacity
              onPress={surveyLaunch}
              style={styles.closeButton}
              testID="survey-button">
              <Text style={styles.closeButtonText}>
                {t('resumeIncidentScreen.detailModal.survey_button')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    color: '#666',
    flexShrink: 1,
    textAlign: 'right',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#3366FF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  chatContainer: {
    marginTop: 10,
    maxHeight: 200,
    minHeight: 200,
  },
});

export default DetailModal;
