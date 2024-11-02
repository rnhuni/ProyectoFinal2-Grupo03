import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useTranslation} from 'react-i18next';

interface Message {
  text: string;
  sender: 'user' | 'agent';
}

const Chat: React.FC = () => {
  const {t} = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {text: 'Hola, ¿cómo estás?', sender: 'agent'},
    {text: 'Bien, gracias. ¿Y tú?', sender: 'user'},
    {text: 'Estoy aquí para ayudarte con tus preguntas.', sender: 'agent'},
    {text: 'Gracias, tengo una duda sobre mi cuenta.', sender: 'user'},
    {text: 'Claro, ¿en qué puedo ayudarte?', sender: 'agent'},
    {text: 'Necesito saber el estado de mi pedido.', sender: 'user'},
    {text: 'Tu pedido está en camino.', sender: 'agent'},
    {text: '¿Cuándo llegará?', sender: 'user'},
    {text: 'Llegará mañana por la tarde.', sender: 'agent'},
  ]);
  const [input, setInput] = useState<string>('');
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, {text: input, sender: 'user'}]);
      setInput('');
      // Aquí puedes agregar la lógica para continuar la conversación
      // Por ejemplo, enviar el mensaje a un backend o usar un bot
    }
  };

  const getInitial = (sender: string) => {
    return sender.charAt(0).toUpperCase();
  };

  const getCircleStyle = (sender: string) => {
    return sender === 'user' ? styles.userCircle : styles.agentCircle;
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({animated: true});
  }, [messages]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.chatWindow}
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({animated: true})
        }>
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageContainer,
              msg.sender === 'agent' ? styles.agentMessage : styles.userMessage,
            ]}>
            {msg.sender === 'agent' ? (
              <>
                <View style={[styles.circle, getCircleStyle(msg.sender)]}>
                  <Text style={styles.initial}>{getInitial(msg.sender)}</Text>
                </View>
                <Text style={styles.message}>{msg.text}</Text>
              </>
            ) : (
              <>
                <Text style={styles.message}>{msg.text}</Text>
                <View style={[styles.circle, getCircleStyle(msg.sender)]}>
                  <Text style={styles.initial}>{getInitial(msg.sender)}</Text>
                </View>
              </>
            )}
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Escribe un mensaje..."
        />
        <Button title="Enviar" onPress={handleSend} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  chatWindow: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 0,
    marginBottom: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2, // Reducir el espacio entre mensajes
    marginBottom: 1,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  agentMessage: {
    justifyContent: 'flex-start',
  },
  circle: {
    width: 20, // Reducir el tamaño del círculo
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userCircle: {
    backgroundColor: '#59805D', // Color del círculo del usuario
  },
  agentCircle: {
    backgroundColor: '#3366FF', // Color del círculo del agente
  },
  initial: {
    fontSize: 12, // Reducir el tamaño de la fuente de la inicial
    color: '#fff',
  },
  message: {
    marginLeft: 5, // Reducir el margen entre el círculo y el mensaje
    maxWidth: '80%',
    fontSize: 14, // Reducir el tamaño de la fuente del mensaje
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginRight: 10,
  },
});

export default Chat;
