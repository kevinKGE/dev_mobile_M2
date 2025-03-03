import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { DatePicker } from 'react-rainbow-components';

type EditSurveyScreenRouteProp = RouteProp<RootStackParamList, 'EditSurvey'>;
type EditSurveyScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditSurvey'>;

type Props = {
  route: EditSurveyScreenRouteProp;
  navigation: EditSurveyScreenNavigationProp;
};

const EditSurveyScreen: React.FC<Props> = ({ route, navigation }) => {
  const { survey } = route.params;
  const [name, setName] = useState<string>(survey.nom);
  const [description, setDescription] = useState<string>(survey.description);
  const [endDate, setEndDate] = useState<Date>(new Date(survey.fin));
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = async () => {
    console.log('Attempting to save changes...');
    
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("fin", endDate.toISOString());
    formData.append("cloture", survey.cloture.toString());
    
    if (survey.photoBase64) {
      formData.append("photo", survey.photoBase64);
    }
  
    console.log('Payload being sent:', formData);
    console.log('Endpoint:', `http://localhost:8080/api/sondage/${survey.sondageId}`);
  
    if (!name || !description || !endDate) {
      console.error('Validation Error: Missing fields');
      setMessage({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8080/api/sondage/${survey.sondageId}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
        },
        body: formData, // Ne pas ajouter Content-Type, FormData le gère automatiquement
      });
  
      console.log('Server Response:', response);
  
      if (response.ok) {
        console.log('Survey updated successfully');
        setMessage({ type: 'success', text: 'Survey updated successfully.' });
        setTimeout(() => {
          navigation.navigate('MySurveys');
        }, 2000);
      } else {
        const errorText = await response.text();
        console.error('Error Response Text:', errorText);
        setMessage({
          type: 'error',
          text: `Failed to update the survey. \n
          Endpoint: http://localhost:8080/api/sondage/${survey.sondageId} \n
          Response: ${response.statusText}`,
        });
      }
    } catch (error) {
      console.error('Error updating survey:', error);
      setMessage({
        type: 'error',
        text: `An error occurred while updating the survey. \n
        Endpoint: http://localhost:8080/api/sondage/${survey.sondageId} \n
        Error: ${(error as any).message}`,
      });
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modifier le sondage</Text>
      <TextInput
        style={styles.input}
        placeholder="Survey Name"
        value={name}
        onChangeText={(text) => {
          console.log('Survey Name updated:', text);
          setName(text);
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={(text) => {
          console.log('Description updated:', text);
          setDescription(text);
        }}
      />
      <View style={styles.dateContainer}>
        <Text style={styles.dateLabel}>Date de fin:</Text>
        <DatePicker
          id="datePicker-2"
          value={endDate}
          onChange={(value) => {
            console.log('Date updated:', value);
            setEndDate(value as Date);
          }}
          formatStyle="large"
        />
      </View>
      {message && (
        <Text style={[styles.message, message.type === 'success' ? styles.success : styles.error]}>
          {message.text}
        </Text>
      )}
      <Button
        title="Réaliser les modifications"
        onPress={() => {
          console.log('Save button pressed');
          handleSave();
        }}
      />
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
  },
  dateLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  message: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
  },
  success: {
    color: 'green',
  },
  error: {
    color: 'red',
  },
});

export default EditSurveyScreen;
