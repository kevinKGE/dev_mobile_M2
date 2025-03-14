import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Survey from '../models/Survey';

interface SurveyItemProps {
  survey: Survey;
  choicesStats: { [key: number]: { date: string; choices: Record<string, number> } };
  onEdit: () => void;
  onDelete: () => void;
}

const SurveyItem: React.FC<SurveyItemProps> = ({ survey, choicesStats, onEdit, onDelete }) => {
  return (
    <View style={styles.surveyCard}>
      <View style={styles.surveyHeader}>
        <Text style={styles.surveyTitle}>{survey.nom}</Text>
        {survey.photoBase64 && (
          <Image source={{ uri: `data:image/jpeg;base64,${survey.photoBase64}` }} style={styles.surveyImage} />
        )}
      </View>
      <Text style={styles.surveyDescription}>{survey.description}</Text>
      <Text style={styles.surveyDate}>📅 Fin: {new Date(survey.fin).toLocaleDateString()}</Text>
      <Text style={[styles.surveyStatus, { color: survey.cloture ? "#FF3B30" : "#007AFF" }]}>
        {survey.cloture ? "🔴 Clôturé" : "🟢 Ouvert"}
      </Text>

      {survey.sondageId !== null && choicesStats[survey.sondageId] && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>📊 Résultats :</Text>
          {Object.entries(choicesStats[survey.sondageId]).map(([dateId, stats]) => {
            const formattedDate = new Date(stats.date).toLocaleDateString();
            return (
              <View key={dateId} style={styles.statsRow}>
                <Text style={styles.statsDate}>📅 {formattedDate}</Text>
                <View style={styles.choicesContainer}>
                  <Text style={styles.choiceText}>✅ {stats.choices["DISPONIBLE"] || 0}</Text>
                  <Text style={styles.choiceText}>❌ {stats.choices["INDISPONIBLE"] || 0}</Text>
                  <Text style={styles.choiceText}>⚠️ {stats.choices["PEUTETRE"] || 0}</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.modifyButton} onPress={onEdit}>
          <Text style={styles.buttonText}>✏️ Modifier</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.buttonText}>🗑 Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  surveyCard: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 3 },
  surveyHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  surveyTitle: { fontSize: 18, fontWeight: 'bold', color: '#007AFF' },
  surveyImage: { width: 40, height: 40, borderRadius: 20 },
  surveyDescription: { fontSize: 14, color: '#666', marginVertical: 5 },
  surveyDate: { fontSize: 12, color: '#888' },
  surveyStatus: { fontSize: 14, fontWeight: '600', marginBottom: 10 },
  statsContainer: { backgroundColor: '#f0f4f8', padding: 10, borderRadius: 8, marginTop: 10 },
  statsTitle: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 5 },
  statsDate: { fontSize: 12, fontWeight: 'bold', color: '#555', flex: 1 },
  choicesContainer: { flexDirection: 'row', alignItems: 'center', flex: 2, justifyContent: 'space-evenly' },
  choiceText: { fontSize: 12, color: '#444', fontWeight: '500' },
  buttonGroup: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  modifyButton: { backgroundColor: '#007AFF', padding: 8, borderRadius: 5, flex: 1, marginRight: 5, alignItems: 'center' },
  deleteButton: { backgroundColor: '#FF3B30', padding: 8, borderRadius: 5, flex: 2, marginLeft: 5, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});

export default SurveyItem;
