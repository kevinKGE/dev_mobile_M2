import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Survey from '../models/Survey';

const SurveyListScreen = ({ navigation }: { navigation: any }) => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: string }>({});

  const CHOIX = ["DISPONIBLE", "INDISPONIBLE", "PEUTETRE"];

  const loadSurveys = () => {
    fetch('http://localhost:8080/api/sondage/')
      .then((response) => response.json())
      .then((data: any[]) => {
        const parsedSurveys = data.map((item: any) => ({
          ...Survey.fromJson(item),
          photoUrl: item.photoUrl || null, // Ajoute une propriété photoUrl si elle existe
        }));
        setSurveys(parsedSurveys);
      })
      .catch((error) =>
        console.error('Erreur lors du chargement des sondages:', error)
      );
  };

  const handleOptionSelect = (surveyId: number, choice: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [surveyId]: choice,
    }));
  };

  const handleSubmit = (surveyId: number) => {
    const choice = selectedOptions[surveyId];
    if (!choice) {
      console.error('Aucun choix sélectionné pour ce sondage');
      return;
    }

    // Envoyer le choix au backend
    fetch(`http://localhost:8080/api/date/${surveyId}/participer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dateSondeeId: surveyId,
        participant: 1, // ID du participant (à remplacer par une gestion réelle des utilisateurs)
        choix: choice,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur lors de l envoi du choix');
        }
        console.log('Choix envoyé avec succès');
      })
      .catch((error) => console.error('Erreur:', error));
  };

  useEffect(() => {
    loadSurveys();
  }, []);

  const renderSurvey = ({ item }: { item: Survey }) => (
    <View style={styles.surveyContainer}>
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
      <View style={styles.divider} />
      <View style={styles.optionsContainer}>
        {CHOIX.map((choice) => (
          <Pressable
            key={choice}
            style={styles.option}
            onPress={() => handleOptionSelect(item.sondageId!, choice)}
          >
            <Text style={styles.radio}>
              {selectedOptions[item.sondageId!] === choice ? '●' : '○'}
            </Text>
            <Text style={styles.optionLabel}>{choice}</Text>
          </Pressable>
        ))}
      </View>
      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => handleSubmit(item.sondageId!)}
      >
        <Text style={styles.submitButtonText}>Valider</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Les sondages publiés</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() =>
            navigation.navigate('CreateSurvey', { refreshSurveys: loadSurveys })
          }
        >
          <Text style={styles.createButtonText}>Créer sondage</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={surveys}
        keyExtractor={(item) => item.sondageId!.toString()}
        renderItem={renderSurvey}
        contentContainerStyle={styles.listContent}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  surveyContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  surveyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  surveyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    flex: 1,
  },
  surveyImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginLeft: 10,
  },
  surveyDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '45%',
    marginBottom: 5,
  },
  radio: {
    marginRight: 8,
    fontSize: 16,
  },
  optionLabel: {
    fontSize: 14,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default SurveyListScreen;
