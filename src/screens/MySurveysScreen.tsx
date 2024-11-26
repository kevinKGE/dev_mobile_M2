import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import for navigation
import { StackNavigationProp } from '@react-navigation/stack';
import Survey from '../models/Survey';
import { RootStackParamList } from '../../App'; // Adjust the path to RootStackParamList

type MySurveysScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MySurveys'>;

const MySurveysScreen: React.FC = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const participantId = 1; // Static participant ID (replace with dynamic management if needed)
  const navigation = useNavigation<MySurveysScreenNavigationProp>(); // Typed navigation hook

  useEffect(() => {
    fetchSurveys(); // Fetch surveys when the component mounts
  }, []);

  const fetchSurveys = () => {
    console.log('Fetching surveys...');
    fetch('http://localhost:8080/api/sondage/')
      .then((response) => response.json())
      .then((data: any[]) => {
        console.log('Surveys fetched:', data);
        const allSurveys = data.map((item) => Survey.fromJson(item));
        const userSurveys = allSurveys.filter((survey) => survey.createBy === participantId);
        setSurveys(userSurveys);
      })
      .catch((error) => console.error('Error loading surveys:', error));
  };

  const deleteSurvey = async (id: number) => {
    console.log(`Attempting to delete survey with ID: ${id}`);
    try {
      const response = await fetch(`http://localhost:8080/api/sondage/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log(`Survey with ID ${id} deleted successfully`);
        setSurveys((prevSurveys) => prevSurveys.filter((survey) => survey.sondageId !== id));
        closeModal(); // Close the modal after deletion
      } else {
        console.error(`Failed to delete survey with ID ${id}`);
      }
    } catch (error) {
      console.error('Error deleting survey:', error);
    }
  };

  const confirmDeleteSurvey = (survey: Survey) => {
    console.log('Opening confirmation modal for survey:', survey);
    setSelectedSurvey(survey);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedSurvey(null);
    setModalVisible(false);
  };

  const navigateToEditSurvey = (survey: Survey) => {
    console.log('Navigating to Edit Survey Screen for:', survey);
    navigation.navigate('EditSurvey', { survey }); // Navigate to EditSurveyScreen
  };

  const renderSurvey = ({ item }: { item: Survey }) => (
    <View style={styles.surveyCard}>
      <Text style={styles.surveyTitle}>{item.nom}</Text>
      <Text style={styles.surveyDescription}>{item.description}</Text>
      <Text style={styles.surveyDate}>End Date: {new Date(item.fin).toLocaleDateString()}</Text>
      <Text style={styles.surveyStatus}>
        Status: {item.cloture ? 'Closed' : 'Open'}
      </Text>
      <View style={styles.buttonGroup}>
        <Button
          title="Modify"
          color="#007AFF"
          onPress={() => navigateToEditSurvey(item)}
        />
        <Button
          title="Delete"
          color="#FF3B30"
          onPress={() => confirmDeleteSurvey(item)}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Surveys</Text>
      {surveys.length > 0 ? (
        <FlatList
          data={surveys}
          renderItem={renderSurvey}
          keyExtractor={(item) => item.sondageId?.toString() || ''}
        />
      ) : (
        <Text style={styles.noSurveys}>No surveys created.</Text>
      )}

      {/* Confirmation Modal */}
      {selectedSurvey && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Delete Survey</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to delete the survey "{selectedSurvey.nom}"?
              </Text>
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={closeModal}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.deleteButton]}
                  onPress={() => deleteSurvey(selectedSurvey.sondageId!)}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  surveyCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  surveyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  surveyDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  surveyDate: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  surveyStatus: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noSurveys: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
});


export default MySurveysScreen;
