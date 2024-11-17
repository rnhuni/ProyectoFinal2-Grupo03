// DetailModal.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Chat from '../Chat/Chat';

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
  console.log('data DetailModalProps : ', data);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      testID="detail-modal">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Incident Details</Text>
          <ScrollView>
            <View style={styles.detailRow}>
              <Text style={styles.label}>ID:</Text>
              <Text style={styles.value}>{data.id}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Description:</Text>
              <Text style={styles.value}>{data.description}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Type:</Text>
              <Text style={styles.value}>{data.type}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Created At:</Text>
              <Text style={styles.value}>{data.created_at}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Updated At:</Text>
              <Text style={styles.value}>{data.updated_at}</Text>
            </View>
            {/* <View style={styles.detailRow}>
              <Text style={styles.label}>User Issuer ID:</Text>
              <Text style={styles.value}>{data.user_issuer_id}</Text>
            </View> */}
            <View style={styles.detailRow}>
              <Text style={styles.label}>User Issuer Name:</Text>
              <Text style={styles.value}>{data.user_issuer_name}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Contact Phone:</Text>
              <Text style={styles.value}>{data.contact.phone}</Text>
            </View>
            {/* Render attachments if needed */}
            {/* Añadir el componente Chat al final */}
            <View style={styles.chatContainer}>
              <Chat id={data.id} />
            </View>
          </ScrollView>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
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
