import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import Survey from '../models/Survey';
import SurveyOption from '../models/SurveyOption';

const SurveyListScreen = ({ navigation }: { navigation: any }) => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: string }>({});
  const [newOption, setNewOption] = useState<{ [key: number]: string }>({});

  const loadSurveys = () => {
    fetch('http://localhost:8080/api/sondage/')
      .then((response) => response.json())
      .then((data: any[]) => {
        const parsedSurveys = data.map((item: any) => Survey.fromJson(item));
        setSurveys(parsedSurveys);
      })
      .catch((error) =>
        console.error('Erreur lors du chargement des sondages:', error)
      );
  };

  const handleOptionSelect = (surveyId: number, optionId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [surveyId]: optionId,
    }));
  };

  const handleAddOption = (surveyId: number) => {
    const optionText = newOption[surveyId]?.trim();
    if (optionText) {
      setSurveys((prevSurveys) =>
        prevSurveys.map((survey) =>
          survey.sondageId === surveyId
            ? {
                ...survey,
                options: [
                  ...survey.options,
                  new SurveyOption(
                    (survey.options.length + 1).toString(),
                    optionText
                  ),
                ],
              }
            : survey
        )
      );
      setNewOption((prev) => ({ ...prev, [surveyId]: '' }));
    }
  };

  useEffect(() => {
    loadSurveys();
  }, []);

  const renderSurvey = ({ item }: { item: Survey }) => (
    <View style={styles.surveyContainer}>
      <Text style={styles.surveyTitle}>{item.nom}</Text>
      <Text style={styles.surveyDescription}>{item.description}</Text>
      <View style={styles.divider} />
      <View style={styles.optionsContainer}>
        {item.options.map((option: SurveyOption) => (
          <Pressable
            key={option.id}
            style={styles.option}
            onPress={() => handleOptionSelect(item.sondageId!, option.id)}
          >
            <Text style={styles.radio}>
              {selectedOptions[item.sondageId!] === option.id ? '●' : '○'}
            </Text>
            <Text style={styles.optionLabel}>{option.label}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.addOptionContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ajouter un cas"
          value={newOption[item.sondageId!] || ''}
          onChangeText={(text) =>
            setNewOption((prev) => ({ ...prev, [item.sondageId!]: text }))
          }
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddOption(item.sondageId!)}
        >
          <Text style={styles.addButtonText}>Ajouter</Text>
        </TouchableOpacity>
      </View>
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
  surveyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
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
  addOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default SurveyListScreen;
