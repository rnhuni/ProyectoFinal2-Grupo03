import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Footer from '../../Components/Footer';
import Header from '../../Components/Header';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next'; // Importar hook de traducción

export const ResumeIncidentScreen = () => {
  const {t} = useTranslation(); // Usar hook de traducción
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [ticketNumber, setTicketNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const data = [
    {id: 1, ticket: '1', tipo: t('resumeIncidentScreen.table.data.row1')},
    {id: 2, ticket: '2', tipo: t('resumeIncidentScreen.table.data.row2')},
    {id: 3, ticket: '3', tipo: t('resumeIncidentScreen.table.data.row3')},
  ];

  const renderRow = (item: any) => (
    <View style={styles.tableRow} key={item.id}>
      <Text style={styles.tableCell}>{item.ticket}</Text>
      <Text style={styles.tableCell}>{item.tipo}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.content}>
        {/* Inputs */}
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

        {/* Tabla */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>
              {t('resumeIncidentScreen.table.ticket')}
            </Text>
            <Text style={styles.tableHeaderCell}>
              {t('resumeIncidentScreen.table.incidentType')}
            </Text>
          </View>
          {data.map(renderRow)}
        </View>

        {/* Paginación usando Picker */}
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

        {/* Botón de descargar */}
        <TouchableOpacity style={styles.downloadButton}>
          <Text style={styles.downloadButtonText}>
            {t('resumeIncidentScreen.downloadButton')}
          </Text>
        </TouchableOpacity>

        {/* Sección de ayuda */}
        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>
            {t('resumeIncidentScreen.help.title')}
          </Text>
          <TouchableOpacity style={styles.helpButton}>
            <Text style={styles.helpButtonText}>
              {t('resumeIncidentScreen.help.button')}
            </Text>
          </TouchableOpacity>
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
    fontSize: 16,
  },
  downloadButton: {
    backgroundColor: '#3366FF',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  helpSection: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#F7F9FC',
    borderRadius: 10,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  helpButton: {
    marginTop: 10,
    backgroundColor: '#3366FF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  helpButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
