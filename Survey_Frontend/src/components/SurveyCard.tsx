import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import SurveyDate from './SurveyDate';

// fonction qui retourne un sondage avec ses dates
const SurveyCard = ({ survey, userId }: { survey: any, userId: string | null }) => {
  const [dates, setDates] = useState<any[]>([]);

  useEffect(() => {
    loadSurveyDates();
  }, []);

  const loadSurveyDates = async () => {
    try {
      console.log(`🔍 Chargement des dates pour le sondage ID: ${survey.sondageId}`);
      const response = await fetch(`http://localhost:8080/api/sondage/${survey.sondageId}/dates`);
      const datesData = await response.json();
      console.log(`📅 Dates récupérées:`, datesData);

      setDates(datesData);
    } catch (error) {
      console.error(`❌ Erreur lors du chargement des dates pour le sondage ${survey.sondageId}:`, error);
    }
  };

  return (
    <View style={styles.surveyContainer}>
      <View style={styles.surveyHeader}>
        <Text style={styles.surveyTitle}>{survey.nom}</Text>
        {survey.photoBase64 && (
          <Image source={{ uri: `data:image/jpeg;base64,${survey.photoBase64}` }} style={styles.surveyImage} />
        )}
      </View>
      <Text style={styles.surveyDescription}>{survey.description}</Text>
      <Text style={styles.surveyEndDate}>📅 Fin du sondage : {new Date(survey.fin).toLocaleDateString()}</Text>

      <View style={styles.datesContainer}>
        {dates.map((date) => (
          <SurveyDate key={date.dateSondageId} date={date} userId={userId} onChoiceSelected={loadSurveyDates} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  surveyContainer: { backgroundColor: '#fff', borderRadius: 5, padding: 15, marginBottom: 10 },
  surveyHeader: { flexDirection: 'row', alignItems: 'center' },
  surveyTitle: { fontSize: 16, fontWeight: 'bold' },
  surveyImage: { width: 60, height: 60, borderRadius: 8, marginLeft: 10 },
  surveyDescription: { fontSize: 14, marginVertical: 5 },
  surveyEndDate: { fontSize: 12, color: 'gray' },
  datesContainer: { marginTop: 10 },
});

export default SurveyCard;
