import React from 'react';
import {StyleSheet, View, Text, Button, Alert} from 'react-native';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';

export const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Header />
      {/* Contenido */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Mensajes predefinidos</Text>

        <View style={styles.tableContainer}>
          {/* Cabecera de la tabla */}
          <View style={styles.tableHeader}>
            <Text style={styles.headerText}>Id</Text>
            <Text style={styles.headerText}>Plantilla</Text>
            <Text style={styles.headerText}>Estado</Text>
          </View>

          {/* Filas de la tabla */}
          {[
            {id: 1, template: 'Bienvenida', status: 'Activo'},
            {id: 2, template: 'Información adicional', status: 'Activo'},
            {id: 3, template: 'Encuesta satisfacción', status: 'Activo'},
            {id: 4, template: 'Finalización chat', status: 'Activo'},
          ].map(row => (
            <View key={row.id} style={styles.tableRow}>
              <Text>{row.id}</Text>
              <Text>{row.template}</Text>
              <View style={styles.statusContainer}>
                <View style={styles.statusDot} />
                <Text style={styles.activeStatus}>{row.status}</Text>
              </View>
            </View>
          ))}

          {/* Paginación */}
          <View style={styles.pagination}>
            <Text>Show 10</Text>
            <View style={styles.pageControls}>
              <Button
                title="1"
                onPress={() => {
                  Alert.alert('Funcionalidad en construcción');
                }}
              />
              <Text>of 10</Text>
            </View>
          </View>
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
  subtitle: {
    marginBottom: 10,
  },
  sectionTitle: {
    marginBottom: 20,
    fontSize: 20,
  },
  tableContainer: {
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  headerText: {
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'green',
    marginRight: 5,
  },
  activeStatus: {
    color: 'green',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  pageControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
