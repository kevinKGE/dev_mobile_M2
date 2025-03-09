import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { launchCamera } from "react-native-image-picker";
import { DatePicker } from "react-rainbow-components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImageSelector from "../components/ImageSelector";

const CreateSurveyScreen = ({ navigation, route }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fin, setFin] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));
  const [dates, setDates] = useState([]);
  const [newDate, setNewDate] = useState(new Date());
  const [photoUri, setPhotoUri] = useState(null);
  const [userId, setUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("user_id");
      setUserId(storedUserId);
    };
    fetchUserId();
  }, []);

  const addMessage = (newMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const handleTakePhoto = () => {
    launchCamera({ mediaType: "photo", cameraType: "back", saveToPhotos: true }, (response) => {
      if (response.didCancel) {
        addMessage("Photo annulée par l'utilisateur.");
      } else if (response.errorCode) {
        addMessage(`Erreur photo : ${response.errorMessage}`);
      } else if (response.assets?.length > 0) {
        setPhotoUri(response.assets[0].uri);
        addMessage("Photo capturée avec succès.");
      }
    });
  };

  const addDate = () => {
    if (!dates.find(d => d.getTime() === newDate.getTime())) {
      setDates([...dates, newDate]);
    } else {
      Alert.alert("Erreur", "Cette date est déjà ajoutée.");
    }
  };

  const removeDate = (index) => {
    setDates(dates.filter((_, i) => i !== index));
  };

  const handleCreateSurvey = async () => {
    setMessages([]);
    addMessage("Début de la création du sondage...");

    if (!name || !description || dates.length === 0 || !fin) {
      addMessage("Veuillez remplir tous les champs et ajouter au moins une date.");
      return;
    }

    if (!userId) {
      addMessage("Erreur : utilisateur non connecté.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("fin", fin.toISOString());
    formData.append("createBy", userId);

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
      addMessage("Sondage créé avec succès.");

      // Ajouter les dates une par une après la création du sondage
      for (const date of dates) {
        await fetch(`http://localhost:8080/api/sondage/${data.sondageId}/dates`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date: date.toISOString() }),
        });
      }

      if (route.params?.refreshSurveys) {
        route.params.refreshSurveys();
      }
      navigation.navigate("SurveyList");
    } catch (error) {
      console.error("Erreur lors de la création du sondage :", error);
      addMessage(`Erreur : ${error instanceof Error ? error.message : "Erreur inconnue"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un sondage</Text>
      <View style={styles.messageContainer}>
        {messages.map((msg, index) => (
          <Text key={index} style={styles.message}>{msg}</Text>
        ))}
      </View>
      <TextInput placeholder="Nom du sondage" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />
      
      <Text style={styles.subtitle}>Date de fin :</Text>
      <DatePicker value={fin} onChange={(value) => setFin(value)} formatStyle="large" />

      <Text style={styles.subtitle}>Ajouter des dates :</Text>
      <DatePicker value={newDate} onChange={setNewDate} formatStyle="large" />
      <Button title="Ajouter la date" onPress={addDate} />

      <FlatList
        data={dates}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.dateItem}>
            <Text>{new Date(item).toLocaleDateString()}</Text>
            <TouchableOpacity onPress={() => removeDate(index)}>
              <Text style={styles.removeText}>✖</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <ImageSelector onImageSelected={setPhotoUri} />

      
      <TouchableOpacity
        style={[styles.createButton, loading && styles.disabledButton]}
        onPress={handleCreateSurvey}
        disabled={loading}
      >
        <Text style={styles.createButtonText}>
          {loading ? "Création en cours..." : "Créer le sondage"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f8f8" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  input: { backgroundColor: "#fff", padding: 10, borderRadius: 5, marginBottom: 10, borderWidth: 1, borderColor: "#ccc" },
  subtitle: { fontSize: 18, fontWeight: "bold", marginTop: 15 },
  dateItem: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#e6e6e6", padding: 10, marginVertical: 5, borderRadius: 5 },
  removeText: { color: "red", fontSize: 16 },
  preview: { width: 100, height: 100, marginVertical: 10 },
  createButton: { marginTop: 20, backgroundColor: "#007BFF", paddingVertical: 15, borderRadius: 5, alignItems: "center" },
  createButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  disabledButton: { backgroundColor: "#ccc" },
});

export default CreateSurveyScreen;
