import React, {useEffect, useState} from 'react';
import {Modal, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import useSuscribeGraphql from '../../../hooks/user/useSuscribeGraphql';
import {Message} from '../../../interfaces/Messages';
import useProfile from '../../../hooks/user/useProfile';

interface SlideUpModalProps {
  visible: boolean;
  onClose: () => void;
}

const SlideUpModal: React.FC<SlideUpModalProps> = ({visible, onClose}) => {
  const {received, setIdSubscriptionFunc} = useSuscribeGraphql();
  const [textModal, setTextModal] = useState('Initial Text');
  const [isModalVisible, setIsModalVisible] = useState(visible);
  const {reloadProfile} = useProfile();

  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await reloadProfile();
      if (profile) {
        //console.log('profile.user.id: ', profile.user.id);
        setIdSubscriptionFunc(profile.user.id);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    //console.log('useEffect received: ', received);
    if (received) {
      // Agregar la notificación recibida al chat como un mensaje del agente
      // console.log('received: ', received);
      const message: Message = JSON.parse(received).data;
      // console.log('message received: ', message);

      setTextModal(message.body);
      setIsModalVisible(true);

      const timer = setTimeout(() => {
        handleClose();
      }, 3000);
    }
  }, [received]);

  const handleClose = () => {
    if (onClose) {
      onClose(); // Llama directamente a `onClose` antes de la animación.
    }
    setIsModalVisible(false);
    // Animated.timing(slideAnim, {
    //   toValue: 500, // Posición inicial (fuera de la pantalla)
    //   duration: 300,
    //   easing: Easing.in(Easing.ease),
    //   useNativeDriver: true,
    // }).start();
  };

  if (!isModalVisible) return null;

  return (
    <Modal visible={isModalVisible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* <Animated.View
          style={[
            styles.modalContainer,
            {transform: [{translateY: slideAnim}]},
          ]}> */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            testID="close-modal">
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.modalText}>{textModal}</Text>
        </View>
        {/* </Animated.View> */}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 15,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.25,
    shadowRadius: 40,
    elevation: 50,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 15,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: '#333',
    marginTop: 20,
  },
});

export default SlideUpModal;
