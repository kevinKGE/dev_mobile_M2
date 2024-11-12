// src/screens/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../components/Button';

const HomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenue !</Text>
            <Text style={styles.subtitle}>Choisissez une option pour continuer</Text>

            {/* Wrapper de bouton pour contrôler la largeur */}
            <View style={styles.buttonContainer}>
                <Button 
                    title="Inscription" 
                    onPress={() => navigation.navigate('Inscription')}
                    style={styles.button} 
                />
            </View>

            <View style={styles.buttonContainer}>
                <Button 
                    title="Connexion" 
                    onPress={() => navigation.navigate('Connexion')} 
                    style={styles.button}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5', // Couleur de fond légère pour la page
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
        textAlign: 'center',
    },
    buttonContainer: {
        width: '60%', // Largeur de la View pour ajuster la taille des boutons
        marginVertical: 10, // Espacement vertical entre les boutons
    },
    button: {
        paddingVertical: 15,
        borderRadius: 10, // Bord arrondi
        backgroundColor: '#007AFF', // Couleur de fond bleue pour les boutons
    },
});

export default HomeScreen;
