import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Footer from '../../Components/Footer';
import Header from '../../Components/Header';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import useIncidents from '../../../hooks/incidents/useIncidents';
import DetailModal from '../../Components/Incidents/DetailModal';
import Loading from '../../Components/Loading';
import { useFocusEffect } from '@react-navigation/native';

export const ResumeIncidentScreen = () => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [ticketNumber, setTicketNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const { incidents, loading, error, reloadIncidents } = useIncidents();

  useFocusEffect(
    useCallback(() => {
      console.log('Incidents: reload');
      reloadIncidents();
    }, []),
  );
  const handleRowPress = async (item: any) => {
    setModalLoading(true);
    setSelectedIncident(item);
    setModalVisible(true);
    setTimeout(() => {
      setModalLoading(false);
    }, 1000);
  };

  const renderRow = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={styles.tableRow}
      onPress={() => handleRowPress(item)}>
      <Text style={styles.tableCell}>{item.id}</Text>
      <Text style={styles.tableCell}>{item.type}</Text>
    </TouchableOpacity>
  );

  const handledetailModalClose = () => {
    reloadIncidents();
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.content}>
        {loading && <Loading message={t('resumeIncidentScreen.loading')} />}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            {t('resumeIncidentScreen.ticketNumber')}
          </Text>
          <TextInput
            placeholder={t('resumeIncidentScreen.ticketNumber')}
            value={ticketNumber}
            onChangeText={setTicketNumber}
            style={styles.input}
          />
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder={t('resumeIncidentScreen.searchPlaceholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.inputSearch}
          />
          <TouchableOpacity style={styles.searchIcon}>
            <Icon name="magnify" size={20} style={styles.icon} />
          </TouchableOpacity>
        </View>

        <ScrollView>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>
                {t('resumeIncidentScreen.table.ticket')}
              </Text>
              <Text style={styles.tableHeaderCell}>
                {t('resumeIncidentScreen.table.incidentType')}
              </Text>
            </View>
            {incidents.map(renderRow)}
          </View>
        </ScrollView>

        <View style={styles.pagination}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedOption}
              onValueChange={itemValue => setSelectedOption(itemValue)}
              style={styles.picker}>
              <Picker.Item label="10" value="10" />
              <Picker.Item label="20" value="20" />
              <Picker.Item label="30" value="30" />
            </Picker>
          </View>
          <Text style={styles.pageText}>
            {t('resumeIncidentScreen.pagination.label')}
          </Text>
        </View>

        <TouchableOpacity style={styles.downloadButton}>
          <Text style={styles.downloadButtonText}>
            {t('resumeIncidentScreen.downloadButton')}
          </Text>
        </TouchableOpacity>

        {selectedIncident && (
          <DetailModal
            visible={modalVisible}
            onClose={handledetailModalClose}
            data={selectedIncident}
          />
        )}

        {modalLoading && (
          <Loading message={t('resumeIncidentScreen.loading')} />
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
    paddingTop: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    color: '#8F9BB3',
    fontSize: 14,
  },
  input: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderColor: '#E4E9F2',
    borderWidth: 1,
    backgroundColor: '#fff',
    color: '#000',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  inputSearch: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderColor: '#E4E9F2',
    borderWidth: 1,
    backgroundColor: '#fff',
    color: '#000',
  },
  searchIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  icon: {
    color: '#3366FF',
  },
  table: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E4E9F2',
    borderRadius: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F7F9FC',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: '#E4E9F2',
  },
  tableCell: {
    flex: 1,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E4E9F2',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  picker: {
    width: 100,
    height: 50,
  },
  pageText: {
    fontSize: 14,
    color: '#8F9BB3',
  },
  downloadButton: {
    backgroundColor: '#3366FF',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ResumeIncidentScreen;
