import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';

interface SlideUpModalProps {
  isVisible: boolean;
  text: string;
  onClose?: () => void;
}

const SlideUpModal: React.FC<SlideUpModalProps> = ({
  isVisible,
  text,
  onClose,
}) => {
  const [slideAnim] = useState(new Animated.Value(500)); // Inicia fuera de la pantalla (abajo)

  useEffect(() => {
    if (isVisible) {
      // Animar el modal hacia arriba
      Animated.timing(slideAnim, {
        toValue: 0, // Posición final (visible)
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();

      // Configura el cierre automático después de 2 segundos
      const timer = setTimeout(() => {
        handleClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleClose = () => {
    // Animar el modal hacia abajo
    Animated.timing(slideAnim, {
      toValue: 500, // Posición inicial (fuera de la pantalla)
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      if (onClose) onClose();
    });
  };

  if (!isVisible) return null;

  return (
    <Modal visible={isVisible} transparent animationType="none">
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {transform: [{translateY: slideAnim}]},
          ]}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            testID="close-modal">
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.modalText}>{text}</Text>
        </Animated.View>
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
