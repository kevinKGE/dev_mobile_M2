// src/screens/ConnectionScreen.js
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Input from '../components/Input';

const ConnectionScreen = () => {
    // États pour stocker les valeurs des champs de saisie
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');

    // États pour stocker les messages d'erreur pour chaque champ
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // Fonction pour gérer l'action de connexion avec vérification des champs
    const handleLogin = () => {
        // Réinitialise les messages d'erreur
        setFirstNameError('');
        setLastNameError('');
        setPasswordError('');

        let valid = true;

        // Vérifie si chaque champ est vide et met à jour le message d'erreur
        if (firstName.trim() === '') {
            setFirstNameError('Le prénom est requis');
            valid = false;
        }
        if (lastName.trim() === '') {
            setLastNameError('Le nom est requis');
            valid = false;
        }
        if (password.trim() === '') {
            setPasswordError('Le mot de passe est requis');
            valid = false;
        }

        // Si tous les champs sont valides, procéder à la connexion
        if (valid) {
            console.log('Nom:', lastName);
            console.log('Prénom:', firstName);
            console.log('Mot de passe:', password);
            // Logique de connexion ici
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Connexion</Text>
            <Input 
                placeholder="Nom" 
                value={lastName} 
                onChangeText={(text) => {
                    setLastName(text);
                    setLastNameError(''); // Efface l'erreur en cas de saisie
                }} 
            />
            {lastNameError ? <Text style={styles.errorText}>{lastNameError}</Text> : null}

            <Input 
                placeholder="Prénom" 
                value={firstName} 
                onChangeText={(text) => {
                    setFirstName(text);
                    setFirstNameError(''); // Efface l'erreur en cas de saisie
                }} 
            />
            {firstNameError ? <Text style={styles.errorText}>{firstNameError}</Text> : null}

            <Input 
                placeholder="Mot de passe" 
                value={password} 
                onChangeText={(text) => {
                    setPassword(text);
                    setPasswordError(''); // Efface l'erreur en cas de saisie
                }} 
                secureTextEntry 
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            <Button title="Se connecter" onPress={handleLogin} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
        marginTop: -10,
    },
});

export default ConnectionScreen;
