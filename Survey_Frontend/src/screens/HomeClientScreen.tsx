import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

// type des propriétés
type HomeClientScreenProps = {
  navigation: {
    navigate: (screen: string) => void;
  };
};

// fonction qui retourne l'écran d'accueil de l'espace client
const HomeClientScreen: React.FC<HomeClientScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue dans votre espace</Text>
      <Text style={styles.subtitle}>
        Gérez vos sondages facilement avec nos outils dédiés.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('SurveyList')}
      >
        <Text style={styles.buttonText}>Voir les sondages</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CreateSurvey')}
      >
        <Text style={styles.buttonText}>Créer un sondage</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('MySurveys')}
        >
      <Text style={styles.buttonText}>Mes sondages</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeClientScreen;
