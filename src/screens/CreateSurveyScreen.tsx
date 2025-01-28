import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import { DatePicker } from 'react-rainbow-components';
import RNFS from 'react-native-fs';
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CreateSurveyScreen = ({ navigation, route }: any) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [fin, setFin] = useState<Date>(new Date(new Date().setDate(new Date().getDate() + 1)));
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);


  const addMessage = (newMessage: string) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  // Récupère l'ID utilisateur au chargement de l'écran
  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("user_id");
      setUserId(storedUserId);
    };

    fetchUserId();
  }, []);

  const handleTakePhoto = () => {
    launchCamera(
      { mediaType: 'photo', cameraType: 'back', saveToPhotos: true },
      (response) => {
        if (response.didCancel) {
          addMessage('Photo annulée par l\'utilisateur.');
        } else if (response.errorCode) {
          addMessage(`Erreur photo : ${response.errorMessage}`);
        } else if (response.assets && response.assets.length > 0) {
          if (response.assets[0].uri) {
            setPhotoUri(response.assets[0].uri);
            addMessage('Photo capturée avec succès.');
          }
        }
      }
    );
  };

  const handleCreateSurvey = async () => {
    setMessages([]);
    addMessage("Début de la création du sondage...");
  
    if (!name || !description || !fin) {
      addMessage("Veuillez remplir tous les champs.");
      return;
    }
  
    if (!userId) {
      addMessage("Erreur : utilisateur non connecté.");
      return;
    }
  
    const formattedFin = fin.toISOString();
    const formData = new FormData();
  
    formData.append("name", name);
    formData.append("description", description);
    formData.append("fin", formattedFin);
    formData.append("createBy", userId); // Utilisation de l'ID utilisateur récupéré
  
    if (photoUri) {
      try {
        const response = await fetch(photoUri);
        const blob = await response.blob();
        formData.append("photo", blob, "photo.jpg");
        addMessage("Photo ajoutée au formulaire.");
      } catch (error) {
        console.error("Erreur lors de la conversion de la photo :", error);
        addMessage("Erreur lors de la conversion de la photo.");
        return;
      }
    }
  
    try {
      addMessage("Envoi de la requête...");
      const response = await fetch("http://localhost:8080/api/sondage/", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erreur HTTP ${response.status}:`, errorText);
        throw new Error(`Erreur HTTP ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Réponse du serveur :", data);
  
      addMessage("Sondage créé avec succès.");
      if (route.params?.refreshSurveys) {
        route.params.refreshSurveys();
      }
      navigation.navigate("SurveyList");
    } catch (error) {
      console.error("Erreur lors de la création du sondage :", error);
      addMessage(`Erreur : ${error instanceof Error ? error.message : "Erreur inconnue"}`);
    }
  };
  


  const convertImageToBase64 = async (uri: string): Promise<string | null> => {
    if (typeof window !== 'undefined') {
      // Web: Utilisation de FileReader
      try {
        const response = await fetch(uri); // Récupérer le fichier
        const blob = await response.blob(); // Convertir en Blob
        return await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string); // Base64
          reader.onerror = reject;
          reader.readAsDataURL(blob); // Lire le blob
        });
      } catch (error) {
        console.error("Erreur lors de la conversion de l'image en base64 (web) :", error);
        return null;
      }
    } else {
      // Mobile: Utilisation de RNFS
      try {
        const RNFS = require('react-native-fs'); // Charger RNFS uniquement pour mobile
        return await RNFS.readFile(uri, 'base64'); // Lire en base64
      } catch (error) {
        console.error("Erreur lors de la conversion de l'image en base64 (mobile) :", error);
        return null;
      }
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Création d'un sondage</Text>
      <View style={styles.messageContainer}>
        {messages.map((msg, index) => (
          <Text key={index} style={styles.message}>
            {msg}
          </Text>
        ))}
      </View>
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
        <DatePicker
          id="datePicker-1"
          value={fin}
          onChange={(value) => setFin(value as Date)}
          formatStyle="large"
        />
      </View>
      <Button title="Prendre une photo" onPress={handleTakePhoto} />
      {photoUri && <Image source={{ uri: photoUri }} style={styles.preview} />}
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
  },
  dateLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  preview: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  messageContainer: {
    marginBottom: 15,
  },
  message: {
    fontSize: 16,
    color: 'red',
    marginBottom: 5,
    textAlign: 'center',
  },
});

export default CreateSurveyScreen;
