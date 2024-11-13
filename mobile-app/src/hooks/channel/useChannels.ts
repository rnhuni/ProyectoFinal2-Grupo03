import { useState } from 'react';
import api from '../../api/api';
import { AxiosError, CanceledError } from 'axios';
import { Message } from '../../interfaces/Messages';

const useChannels = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const service = '/channel/channels/:channel_id/sessions/:session_id/messages';

  const reloadMessages = async (): Promise<Message[]> => {
    setLoading(true);
    setError('');

    const convertedMessages: Message[] = [
      { id: 'msg-1', text: 'Hola, ¿cómo estás?', sender: 'agent' },
      { id: 'msg-2', text: 'Bien, gracias. ¿Y tú?', sender: 'user', name: 'John' },
      { id: 'msg-3', text: 'Estoy aquí para ayudarte con tus preguntas.', sender: 'agent' },
      { id: 'msg-4', text: 'Gracias, tengo una duda sobre mi cuenta.', sender: 'user', name: 'John' },
      { id: 'msg-5', text: 'Claro, ¿en qué puedo ayudarte?', sender: 'agent' },
      { id: 'msg-6', text: 'Necesito saber el estado de mi pedido.', sender: 'user', name: 'John' },
      { id: 'msg-7', text: 'Tu pedido está en camino.', sender: 'agent' },
      { id: 'msg-8', text: '¿Cuándo llegará?', sender: 'user' },
      { id: 'msg-9', text: 'Llegará mañana por la tarde.', sender: 'agent', name: 'John' }
    ];

    await setMessages(convertedMessages);
    setLoading(false)

    return convertedMessages;
  };


  return {
    messages,
    loading,
    error,
    reloadMessages,
  };
};

export default useChannels;
