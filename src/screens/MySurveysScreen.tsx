import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import for navigation
import { StackNavigationProp } from '@react-navigation/stack';
import Survey from '../models/Survey';
import { RootStackParamList } from '../../App'; // Adjust the path to RootStackParamList
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ Import manquant


type MySurveysScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MySurveys'>;

const MySurveysScreen: React.FC = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const participantId = 1; // Static participant ID (replace with dynamic management if needed)
  const navigation = useNavigation<MySurveysScreenNavigationProp>(); // Typed navigation hook
  const [choicesStats, setChoicesStats] = useState<{ [key: number]: Record<string, number> }>({});

  useEffect(() => {
    fetchSurveys(); // Fetch surveys when the component mounts
  }, []);

  const fetchSurveys = async () => {
    console.log("🔍 Fetching surveys...");
  
    try {
      // Récupérer l'ID de l'utilisateur connecté
      const storedUserId = await AsyncStorage.getItem("user_id");
      if (!storedUserId) {
        console.error("❌ Erreur : Aucun ID utilisateur trouvé.");
        return;
      }
      console.log(`✅ ID utilisateur récupéré : ${storedUserId}`);
  
      // Récupérer tous les sondages depuis l'API
      const response = await fetch("http://localhost:8080/api/sondage/");
      const data: any[] = await response.json();
      console.log("📥 Sondages reçus depuis l'API :", data);
  
      // Filtrer les sondages créés par l'utilisateur connecté
      const userSurveys = data
        .map((item) => ({
          ...Survey.fromJson(item),
          photoBase64: item.photoBase64 || null, // Ajout du champ photo si disponible
        }))
        .filter((survey) => survey.createBy === parseInt(storedUserId));
  
      console.log("📊 Sondages filtrés (créés par l'utilisateur) :", userSurveys);
  
      setSurveys(userSurveys);
  
      // Charger les stats pour chaque sondage après récupération
      for (const survey of userSurveys) {
        fetchChoicesStats(survey.sondageId);
      }
    } catch (error) {
      console.error("❌ Erreur lors du chargement des sondages :", error);
    }
  };
  
  

  const deleteSurvey = async (id: number) => {
    console.log(`🗑 Tentative de suppression du sondage ID: ${id}`);
  
    try {
      const response = await fetch(`http://localhost:8080/api/sondage/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        console.log(`✅ Sondage ID ${id} supprimé avec succès.`);
        setSurveys((prevSurveys) => prevSurveys.filter((survey) => survey.sondageId !== id));
        closeModal();
      } else {
        console.error(`❌ Échec de la suppression du sondage ID ${id}`);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du sondage :', error);
    }
  };
  

  const fetchChoicesStats = async (surveyId: number) => {
    try {
      console.log(`🔍 Fetching dates for survey ID: ${surveyId}`);
      const response = await fetch(`http://localhost:8080/api/sondage/${surveyId}/dates`);
      const dates = await response.json();
      
      console.log(`📅 Dates received for survey ${surveyId}:`, dates);
  
      const stats: { [key: number]: { date: string; choices: Record<string, number> } } = {};
  
      for (const date of dates) {
        console.log(`🔄 Fetching choices for date ID: ${date.dateSondageId}`);
        const res = await fetch(`http://localhost:8080/api/date/${date.dateSondageId}/choices`);
        const data = await res.json();
        
        console.log(`📊 Raw choices data received for date ${date.date}:`, data);
  
        // Correction ici : on accède directement aux choix imbriqués
        stats[date.dateSondageId] = {
          date: date.date,
          choices: data.choices?.choices || {}, // Extraire les choix imbriqués
        };
      }
  
      console.log(`✅ Processed choices stats for survey ${surveyId}:`, stats);
  
      setChoicesStats((prevStats) => ({ ...prevStats, [surveyId]: stats }));
    } catch (error) {
      console.error(`❌ Erreur lors de la récupération des statistiques pour le sondage ${surveyId}:`, error);
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
      <View style={styles.surveyHeader}>
        <Text style={styles.surveyTitle}>{item.nom}</Text>
        {item.photoBase64 && (
          <Image
            source={{ uri: `data:image/jpeg;base64,${item.photoBase64}` }}
            style={styles.surveyImage}
          />
        )}
      </View>
      <Text style={styles.surveyDescription}>{item.description}</Text>
      <Text style={styles.surveyDate}>📅 Fin: {new Date(item.fin).toLocaleDateString()}</Text>
      <Text style={[styles.surveyStatus, { color: item.cloture ? "#FF3B30" : "#007AFF" }]}>
        {item.cloture ? "🔴 Clôturé" : "🟢 Ouvert"}
      </Text>
  
      {/* Résultats avec dates et stats sur une ligne */}
      {choicesStats[item.sondageId] && (
  <View style={styles.statsContainer}>
    <Text style={styles.statsTitle}>📊 Résultats :</Text>
    {Object.entries(choicesStats[item.sondageId]).map(([dateId, stats]) => {
      const formattedDate = new Date(stats.date).toLocaleDateString();

      return (
        <View key={dateId} style={styles.statsRow}>
          <Text style={styles.statsDate}>📅 {formattedDate}</Text>
          <View style={styles.choicesContainer}>
            <Text style={styles.choiceText}>✅ {stats.choices["DISPONIBLE"] || 0}</Text>
            <Text style={styles.choiceText}>❌ {stats.choices["INDISPONIBLE"] || 0}</Text>
            <Text style={styles.choiceText}>⚠️ {stats.choices["PEUTETRE"] || 0}</Text>
          </View>
        </View>
      );
    })}
  </View>
)}

  
      {/* Boutons stylisés */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.modifyButton} onPress={() => navigateToEditSurvey(item)}>
          <Text style={styles.buttonText}>✏️ Modifier</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDeleteSurvey(item)}>
          <Text style={styles.buttonText}>🗑 Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  
  
  
  

  return (
    <View style={styles.container}>
      {surveys.length > 0 ? (
        <FlatList
          data={surveys}
          renderItem={renderSurvey}
          keyExtractor={(item) => item.sondageId?.toString() || ''}
        />
      ) : (
        <Text style={styles.noSurveys}>Aucun Sondage créé.</Text>
      )}

      {/* Confirmation Modal */}
      {selectedSurvey && (
  <Modal
    animationType="fade" // Change "slide" to "fade" for a better effect
    transparent={true}
    visible={isModalVisible}
    onRequestClose={closeModal}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Supprimer le sondage</Text>
        <Text style={styles.modalMessage}>
          Es-tu sûr de vouloir supprimer le sondage "{selectedSurvey.nom}" ?
        </Text>
        <View style={styles.modalActions}>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={closeModal}
          >
            <Text style={styles.buttonText}>Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.deleteButton]}
            onPress={() => deleteSurvey(selectedSurvey.sondageId!)}
          >
            <Text style={styles.buttonText}>Supprimer</Text>
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
  surveyCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  surveyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  surveyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  surveyImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  surveyDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  surveyDate: {
    fontSize: 12,
    color: '#888',
  },
  surveyStatus: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  statsContainer: {
    backgroundColor: '#f0f4f8',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  statsDate: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
    flex: 1,
  },
  choicesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'space-evenly',
  },
  choiceText: {
    fontSize: 12,
    color: '#444',
    fontWeight: '500',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modifyButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 5,
    flex: 2,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Fond semi-transparent
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%', // Largeur du modal
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5, // Ombre sur Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  }
});

export default MySurveysScreen;
