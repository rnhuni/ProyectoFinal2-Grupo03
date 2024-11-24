interface NotificationMessage {
    type: string; // Tipo del mensaje, en este caso "notification"
    payload: {
        id: string; // ID único de la notificación
        message: string; // Mensaje descriptivo de la notificación
    };
}