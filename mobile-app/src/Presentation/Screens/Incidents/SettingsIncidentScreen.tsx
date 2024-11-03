import React, {useState} from 'react';
import {StyleSheet, View, Text, Switch} from 'react-native';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import {useTranslation} from 'react-i18next';

export const SettingsIncidentScreen = () => {
  const {t} = useTranslation(); // Usamos el hook para acceder a las traducciones

  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [isStateChangesEnabled, setIsStateChangesEnabled] = useState(false);
  const [isTaskReminderEnabled, setIsTaskReminderEnabled] = useState(false);
  const [isSupportMessagesEnabled, setIsSupportMessagesEnabled] =
    useState(false);

  const toggleNotifications = () =>
    setIsNotificationsEnabled(!isNotificationsEnabled);
  const toggleStateChanges = () =>
    setIsStateChangesEnabled(!isStateChangesEnabled);
  const toggleTaskReminder = () =>
    setIsTaskReminderEnabled(!isTaskReminderEnabled);
  const toggleSupportMessages = () =>
    setIsSupportMessagesEnabled(!isSupportMessagesEnabled);

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        {/* Habilitar notificaciones */}
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>
            {t('settingsIncidentScreen.enableNotifications')}
          </Text>
          <Switch
            value={isNotificationsEnabled}
            onValueChange={toggleNotifications}
            testID='enable-notifications-switch'
          />
        </View>

        {/* Cambios de estado */}
        {isNotificationsEnabled && (
          <>
            <View style={styles.settingItem}>
              <Text style={styles.settingText}>
                {t('settingsIncidentScreen.stateChanges')}
              </Text>
              <Switch
                value={isStateChangesEnabled}
                onValueChange={toggleStateChanges}
                testID='enable-notifications-switch-state-changes'
              />
            </View>

            {/* Recordatorio de tarea */}
            <View style={styles.settingItem}>
              <Text style={styles.settingText}>
                {t('settingsIncidentScreen.taskReminder')}
              </Text>
              <Switch
                value={isTaskReminderEnabled}
                onValueChange={toggleTaskReminder}
            testID='enable-notifications-switch-task-reminder'
              />
            </View>

            {/* Mensajes de soporte */}
            <View style={styles.settingItem}>
              <Text style={styles.settingText}>
                {t('settingsIncidentScreen.supportMessages')}
              </Text>
              <Switch
                value={isSupportMessagesEnabled}
                onValueChange={toggleSupportMessages}
            testID='enable-notifications-switch-support-messages'
              />
            </View>
          </>
        )}
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
    fontWeight: 'bold',
  },
});
