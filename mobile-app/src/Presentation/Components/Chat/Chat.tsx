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
import useSuscribeGraphql from '../../../hooks/user/useSuscribeGraphql';
import usePublishGraphql from '../../../hooks/user/usePublishGraphql';
import {message} from 'aws-sdk/clients/sns';
import useChannels from '../../../hooks/channel/useChannels';
import {Message} from '../../../interfaces/Messages';

interface ChatProps {
  id: string; // Nueva prop para el id
}

const Chat: React.FC<ChatProps> = ({id}) => {
  const {t} = useTranslation();
  const [messagesLocal, setMessagesLocal] = useState<Message[]>([]);

  const {
    messages,
    loading,
    error,
    reloadMessages,
    incidentSession,
    loadIncidentSession,
    createIncidentMessage,
  } = useChannels();
  const [input, setInput] = useState<string>('');
  const scrollViewRef = useRef<ScrollView>(null);
  const {received}: {received: string} = useSuscribeGraphql(id);

  // leer los mensajes actuales
  useEffect(() => {
    const loadNotifications = async () => {
      const sess = await loadIncidentSession(id);
      // console.log('sess: ', sess);
      const data = await reloadMessages(sess?.id);
      // console.log('data: ', data);
      setMessagesLocal(data);
    };
    loadNotifications();
  }, []);

  // crear la sesion de chat
  // aqui se deberia consultar el ID de la sesion de chat
  /*
  useEffect(() => {
    const createSession = async () => {
      const data = await createChannelSession(id);
    };
    createSession();
  }, []);
  */

  // useEffect(() => {
  //   console.log("received: ", received);
  //   console.log("notifications: ", notifications);
  //   console.log("data: ", data);
  // }, []);

  // leer los mensajes de chat que llegan
  useEffect(() => {
    // console.log('useEffect received: ', received);
    if (received) {
      // Agregar la notificación recibida al chat como un mensaje del agente
      const message: Message = JSON.parse(received);
      // console.log('message received: ', message);
      setMessagesLocal(prevMessages => [
        ...prevMessages,
        {
          body: message.body,
          source_name: message.source_name,
          source_type: message.source_type,
        },
      ]);
    }
  }, [received]);

  const handleSend = async () => {
    // console.log('000 handleSend: ', input);
    if (input.trim()) {
      setMessagesLocal([
        ...messagesLocal,
        {
          body: input,
          session_id: incidentSession?.id,
          source_name: 'Oscar',
          source_type: 'user',
        },
      ]);
      setInput('');
      // enviar al backend
      // enviarlo a graphql
      const dataToSend = {
        body: input,
        source_name: 'Oscar',
        source_type: 'user',
      };
      const jsonData = JSON.stringify({data: dataToSend});

      // console.log('dataToSend usePublishGraphql: ', jsonData);
      const resp = await usePublishGraphql(jsonData, id);
      // console.log('resp usePublishGraphql: ', resp);
      // console.log('createIncidentMessage: ', input);
      await createIncidentMessage(input);
    }
  };

  const getInitial = (message: Message | null) => {
    if (message && message.source_type) {
      return (
        message.source_name?.charAt(0).toUpperCase() ||
        message.source_type.charAt(0).toUpperCase()
      );
    } else {
      console.log('message error: ', message);
      return '';
    }
  };

  const getCircleStyle = (sender: string) => {
    return sender === 'user' ? styles.userCircle : styles.agentCircle;
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({animated: true});
  }, [messagesLocal]);

  const handleContentSizeChange = () => {
    scrollViewRef.current?.scrollToEnd({animated: true});
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.chatWindow}
        ref={scrollViewRef}
        onContentSizeChange={handleContentSizeChange}>
        {messagesLocal.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageContainer,
              msg.source_type === 'agent'
                ? styles.agentMessage
                : styles.userMessage,
            ]}>
            {msg.body ? (
              msg.source_type === 'agent' ? (
                <>
                  <View
                    style={[styles.circle, getCircleStyle(msg.source_type)]}>
                    <Text style={styles.initial}>{getInitial(msg)}</Text>
                  </View>
                  <Text style={styles.message}>{msg.body}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.message}>{msg.body}</Text>
                  <View
                    style={[styles.circle, getCircleStyle(msg.source_type)]}>
                    <Text style={styles.initial}>{getInitial(msg)}</Text>
                  </View>
                </>
              )
            ) : null}
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
