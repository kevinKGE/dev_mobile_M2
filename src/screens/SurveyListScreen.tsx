import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import SurveyCard from '../components/SurveyCard';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

// Définition du type pour les props de navigation
type SurveyListScreenProps = NativeStackScreenProps<RootStackParamList, "SurveyList">;

// Interface pour un sondage
interface Survey {
  sondageId: number;
  [key: string]: any;
}

// Page de liste des sondages
const SurveyListScreen: React.FC<SurveyListScreenProps> = ({ navigation }) => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Récupérer l'ID de l'utilisateur stocké dans le stockage local
  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("user_id");
      setUserId(storedUserId ?? null);
    };
    fetchUserId();
    loadSurveys();
  }, []);

  // Fonction pour charger les sondages depuis l'API
  const loadSurveys = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/sondage/');
      const data: Survey[] = await response.json();
      setSurveys(data);
    } catch (error) {
      console.error('Erreur lors du chargement des sondages:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Les sondages publiés</Text>
        <TouchableOpacity 
          style={styles.createButton} 
          onPress={() => navigation.navigate('CreateSurvey', { refreshSurveys: loadSurveys })}
        >
          <Text style={styles.createButtonText}>Créer sondage</Text>
        </TouchableOpacity>
      </View>

      <FlatList 
        data={surveys} 
        keyExtractor={(item) => item.sondageId?.toString() || Math.random().toString()} 
        renderItem={({ item }) => <SurveyCard survey={item} userId={userId} />}
        contentContainerStyle={styles.listContent} 
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 10, marginBottom: 10, borderRadius: 5 },
  title: { fontSize: 18, fontWeight: 'bold' },
  createButton: { backgroundColor: '#007AFF', padding: 10, borderRadius: 5 },
  createButtonText: { color: '#fff', fontSize: 16 },
  listContent: { paddingBottom: 20 },
});

export default SurveyListScreen;
