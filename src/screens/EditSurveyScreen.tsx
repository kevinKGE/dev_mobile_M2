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
    const updatedSurvey = {
      sondageId: survey.sondageId,
      nom: name,
      description,
      fin: endDate.toISOString(),
      createBy: survey.createBy,
      cloture: survey.cloture,
      photoBase64: survey.photoBase64 || "", // Assurez-vous que ce champ est toujours rempli
    };
  
    console.log('Payload being sent:', updatedSurvey);
    console.log('Endpoint:', `http://localhost:8080/api/sondage/${survey.sondageId}`);
  
    if (!name || !description || !endDate) {
      console.error('Validation Error: Missing fields');
      setMessage({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8080/api/sondage/${survey.sondageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSurvey),
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
          Payload: ${JSON.stringify(updatedSurvey, null, 2)} \n
          Response: ${response.statusText}`,
        });
      }
    } catch (error) {
      console.error('Error updating survey:', error);
      setMessage({
        type: 'error',
        text: `An error occurred while updating the survey. \n
        Endpoint: http://localhost:8080/api/sondage/${survey.sondageId} \n
        Payload: ${JSON.stringify(updatedSurvey, null, 2)} \n
        Error: ${(error as any).message}`,
      });
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Survey</Text>
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
        <Text style={styles.dateLabel}>End Date:</Text>
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
        title="Save Changes"
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
