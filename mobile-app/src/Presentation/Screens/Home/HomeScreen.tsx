import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, FlatList} from 'react-native';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

export const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const {t} = useTranslation();

  const features = [
    {
      id: '1',
      title: t('homeScreen.features.viewTickets'),
      action: () => navigation.navigate('ResumeIncidentScreen'),
      testID: 'viewTicketsButton',
    },
    {
      id: '2',
      title: t('homeScreen.features.createTicket'),
      action: () => navigation.navigate('IncidentReportScreen'),
      testID: 'createTicketButton',
    },
    {
      id: '3',
      title: t('homeScreen.features.chatSupport'),
      action: () => navigation.navigate('ResumeIncidentScreen'),
      testID: 'chatSupportButton',
    },
    {
      id: '4',
      title: t('homeScreen.features.downloadReport'),
      action: () => navigation.navigate('ResumeIncidentScreen'),
      testID: 'downloadReportButton',
    },
    {
      id: '5',
      title: t('homeScreen.features.configureNotifications'),
      action: () => navigation.navigate('SettingsIncidentScreen'),
      testID: 'configureNotificationsButton',
    },
  ];

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>{t('homeScreen.title')}</Text>
      <Text style={styles.subtitle}>{t('homeScreen.subtitle')}</Text>

      <FlatList
        data={features}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.featureCard}
            onPress={item.action}
            testID={item.testID}>
            <Text style={styles.featureText}>{item.title}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.featureList}
      />
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 16,
  },
  featureList: {
    marginTop: 16,
  },
  featureCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
  },
  createButton: {
    marginTop: 16,
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
