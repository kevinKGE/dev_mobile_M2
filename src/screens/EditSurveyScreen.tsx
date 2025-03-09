import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { DatePicker } from "react-rainbow-components";

type EditSurveyScreenRouteProp = RouteProp<RootStackParamList, "EditSurvey">;
type EditSurveyScreenNavigationProp = StackNavigationProp<RootStackParamList, "EditSurvey">;

type Props = {
  route: EditSurveyScreenRouteProp;
  navigation: EditSurveyScreenNavigationProp;
};

const EditSurveyScreen: React.FC<Props> = ({ route, navigation }) => {
  const { survey } = route.params;
  const [name, setName] = useState<string>(survey.nom);
  const [description, setDescription] = useState<string>(survey.description);
  const [endDate, setEndDate] = useState<Date>(new Date(survey.fin));
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSave = async () => {
    console.log("Tentative d'enregistrement des modifications...");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("fin", endDate.toISOString());
    formData.append("cloture", survey.cloture.toString());

    if (survey.photoBase64) {
      formData.append("photo", survey.photoBase64);
    }

    console.log("Données envoyées :", formData);
    console.log("Endpoint :", `http://localhost:8080/api/sondage/${survey.sondageId}`);

    if (!name || !description || !endDate) {
      console.error("Erreur de validation : Champs manquants");
      setMessage({ type: "error", text: "Veuillez remplir tous les champs." });
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/sondage/${survey.sondageId}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
        },
        body: formData, 
      });

      console.log("Réponse du serveur :", response);

      if (response.ok) {
        console.log("Sondage mis à jour avec succès");
        setMessage({ type: "success", text: "Le sondage a été modifié avec succès !" });
        setTimeout(() => {
          navigation.navigate("MySurveys");
        }, 2000);
      } else {
        const errorText = await response.text();
        console.error("Texte de réponse d'erreur :", errorText);
        setMessage({
          type: "error",
          text: `Échec de la mise à jour du sondage. \n
          Endpoint: http://localhost:8080/api/sondage/${survey.sondageId} \n
          Réponse: ${response.statusText}`,
        });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du sondage :", error);
      setMessage({
        type: "error",
        text: `Une erreur est survenue lors de la mise à jour du sondage. \n
        Endpoint: http://localhost:8080/api/sondage/${survey.sondageId} \n
        Erreur: ${(error as any).message}`,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modifier le sondage</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom du sondage"
        value={name}
        onChangeText={(text) => {
          setName(text);
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={(text) => {
          setDescription(text);
        }}
      />
      <View style={styles.dateContainer}>
        <Text style={styles.dateLabel}>Date de fin :</Text>
        <DatePicker
          id="datePicker-2"
          value={endDate}
          onChange={(value) => {
            console.log("Date mise à jour :", value);
            setEndDate(value as Date);
          }}
          formatStyle="large"
        />
      </View>
      {message && (
        <Text style={[styles.message, message.type === "success" ? styles.success : styles.error]}>
          {message.text}
        </Text>
      )}
      <Button
        title="Enregistrer les modifications"
        onPress={() => {
          console.log("Bouton Enregistrer pressé");
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
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
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
    textAlign: "center",
  },
  success: {
    color: "green",
  },
  error: {
    color: "red",
  },
});

export default EditSurveyScreen;
