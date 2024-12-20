import React, {useState, useCallback, useEffect} from 'react';
import {StyleSheet, View, Text, Switch, FlatList} from 'react-native';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import {useTranslation} from 'react-i18next';
import useNotificationConfig from '../../../hooks/user/useNotificationsConfig';
import {useFocusEffect} from '@react-navigation/native';
import {NotificationConfig} from '../../../interfaces/NotificationConfig';
import eventEmitter from '../../../events/eventEmitter';

export const SettingsIncidentScreen = () => {
  const {t} = useTranslation(); // Usamos el hook para acceder a las traducciones
  const {
    notificationsConfig,
    loading,
    error,
    reloadNotificationConfig,
    updateNotificationConfig,
  } = useNotificationConfig();

  const [notifications, setNotifications] = useState<NotificationConfig[]>([]);

  useEffect(() => {
    // console.log('useEffect Incidents: reload');
    const loadNotifications = async () => {
      const data = await reloadNotificationConfig();
      // console.log('data:', data);
      setNotifications(data);
      // console.log('Notifications:', notifications);
    };
    loadNotifications();
  }, []);

  // useFocusEffect(
  //     useCallback(() => {
  //       const loadNotifications = async () => {
  //         const data = await reloadNotificationConfig();
  //         setNotifications(data);
  //       };
  //       loadNotifications();
  //     }, []),
  //   );

  const toggleNotifications = async (id: string) => {
    const allNotifications = (
      prevNotifications: NotificationConfig[],
    ): NotificationConfig[] =>
      prevNotifications.map((notification: NotificationConfig) =>
        notification.id === id
          ? {...notification, show_by_default: !notification.show_by_default}
          : notification,
      );
    // console.log('allNotifications:', allNotifications);
    setNotifications(allNotifications);
    const notification = notificationsConfig.find(
      notification => notification.id === id,
    );
    if (notification) {
      await updateNotificationConfig({
        ...notification,
        show_by_default: !notification.show_by_default,
      });
      eventEmitter.emit('notificationsUpdated', allNotifications);
    }
  };
  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>{t('settingsIncidentScreen.title')}</Text>
      <View style={styles.content}>
        <View style={styles.container}>
          <FlatList
            data={notifications}
            keyExtractor={(item: NotificationConfig) => item.id}
            renderItem={({item}: {item: NotificationConfig}) => (
              <View style={styles.settingItem}>
                <Text style={styles.settingText}>{item.name}</Text>
                <Switch
                  testID={`switch-${item.id}`}
                  value={item.show_by_default}
                  onValueChange={() => toggleNotifications(item.id)}
                />
              </View>
            )}
          />
        </View>
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
    paddingVertical: 30,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingText: {
    fontSize: 16,
    // fontWeight: 'bold',
  },
  title: {
    width: '100%',
    textAlign: 'center',
    fontSize: 20,
    paddingTop: 20,
    fontWeight: 'bold',
  },
});
