import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import Survey from '../models/Survey';

type CreateSurveyScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreateSurvey'>;
type CreateSurveyScreenRouteProp = RouteProp<RootStackParamList, 'CreateSurvey'>;

type CreateSurveyScreenProps = {
  navigation: CreateSurveyScreenNavigationProp;
  route: CreateSurveyScreenRouteProp;
};

const CreateSurveyScreen: React.FC<CreateSurveyScreenProps> = ({ navigation, route }) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [fin, setFin] = useState<Date>(new Date(new Date().setDate(new Date().getDate() + 1))); // Par défaut, demain
  const [showPicker, setShowPicker] = useState<boolean>(false);

  const handleCreateSurvey = () => {
    if (!name || !description || !fin) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    const formattedFin = fin.toISOString();

    const newSurvey = new Survey(
      null,
      name,
      description,
      formattedFin,
      false, // cloture
      1 // createBy : valeur exemple
    );

    console.log('Préparation de la requête avec les données :', newSurvey);

    fetch('http://localhost:8080/api/sondage/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newSurvey),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Sondage créé avec succès:', data);

        if (route.params?.refreshSurveys) {
          route.params.refreshSurveys();
        }

        navigation.navigate('SurveyList');
      })
      .catch((error) => {
        console.error('Erreur lors de la création du sondage:', error);
        alert(`Erreur lors de la création du sondage : ${error.message}`);
      });
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false); 
    if (selectedDate) {
      setFin(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Création d'un sondage</Text>
      <TextInput
        placeholder="Nom du sondage"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <View style={styles.dateContainer}>
        <Text style={styles.dateLabel}>Date de fin :</Text>
        <Button
          title={fin.toDateString()}
          onPress={() => setShowPicker(true)}
        />
      </View>
      {showPicker && (
        <DateTimePicker
          value={fin}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
        />
      )}
      <Button title="Créer le sondage" onPress={handleCreateSurvey} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  dateContainer: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateLabel: {
    fontSize: 16,
  },
});

export default CreateSurveyScreen;
