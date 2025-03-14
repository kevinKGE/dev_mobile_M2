import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CHOIX = ["DISPONIBLE", "INDISPONIBLE", "PEUTETRE"];

// fonction qui retourne un composant pour une date de sondage
const SurveyDate = ({ date, userId, onChoiceSelected }: { date: any, userId: string | null, onChoiceSelected: () => void }) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [alreadyAnswered, setAlreadyAnswered] = useState<boolean>(false);

  useEffect(() => {
    checkUserParticipation();
  }, []);

  const checkUserParticipation = async () => {
    if (!userId) return;

    try {
      console.log(`🔍 Vérification de la participation pour la date ID: ${date.dateSondageId} et user ID: ${userId}`);
      const response = await fetch(`http://localhost:8080/api/date/${date.dateSondageId}/participant/${userId}`);
      const choice = await response.text();
      console.log(`✅ Réponse reçue: ${choice}`);

      if (CHOIX.includes(choice)) {
        setSelectedChoice(choice);
        setAlreadyAnswered(true);
      }
    } catch (error) {
      console.error(`❌ Erreur lors de la vérification de la participation:`, error);
    }
  };

  // fonction pour gérer la sélection d'un choix
  const handleChoiceSelect = async (choice: string) => {
    if (alreadyAnswered) return; //on permet pas une double participation

    try {
      const response = await fetch(`http://localhost:8080/api/date/${date.dateSondageId}/participer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dateSondeeId: 0,  
          participant: parseInt(userId!), 
          choix: choice
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
      }

      console.log(`✅ Participation enregistrée pour ${choice}`);
      setSelectedChoice(choice);
      setAlreadyAnswered(true);
      onChoiceSelected(); // on rafraichit les participations
    } catch (error) {
      console.error(`❌ Erreur lors de la participation:`, error);
    }
  };

  return (
    <View style={styles.dateChoiceContainer}>
      <Text style={styles.dateText}>{new Date(date.date).toLocaleDateString()}</Text>

      {alreadyAnswered ? (
        <Text style={styles.userChoiceText}>✅ Vous avez choisi : {selectedChoice}</Text>
      ) : (
        <View style={styles.choicesContainer}>
          {CHOIX.map((choice) => (
            <TouchableOpacity
              key={choice}
              style={[
                styles.choiceButton,
                selectedChoice === choice && styles.selectedChoice
              ]}
              onPress={() => handleChoiceSelect(choice)}
            >
              <Text style={styles.choiceText}>{choice}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dateChoiceContainer: { marginBottom: 10 },
  dateText: { fontSize: 14, fontWeight: 'bold' },
  userChoiceText: { fontSize: 14, color: '#28a745', fontWeight: 'bold' },
  choicesContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 5 },
  choiceButton: { 
    padding: 8, 
    borderRadius: 5, 
    backgroundColor: '#ddd', 
    flex: 1, 
    marginHorizontal: 5, 
    alignItems: 'center' 
  },
  selectedChoice: {
    backgroundColor: '#007AFF',
  },
  choiceText: { fontSize: 14, color: '#000' },
});

export default SurveyDate;
