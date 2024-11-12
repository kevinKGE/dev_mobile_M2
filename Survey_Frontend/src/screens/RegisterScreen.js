// src/screens/RegisterScreen.js
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Input from '../components/Input';

const RegisterScreen = () => {
    // États pour stocker les valeurs des champs de saisie
    const [firstName, setFirstName] = useState(''); // Prénom
    const [lastName, setLastName] = useState(''); // Nom
    const [password, setPassword] = useState(''); // MDP
    const [confirmPassword, setConfirmPassword] = useState(''); // Confirmation du MDP

    // États pour les messages d'erreur
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    // Critères de validation pour le mot de passe
    const minLength = password.length >= 8;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const passwordsMatch = password === confirmPassword;

    // Fonction pour gérer l'action d'inscription
    const handleRegister = () => {
        // Réinitialise les messages d'erreur
        setFirstNameError('');
        setLastNameError('');
        setPasswordError('');
        setConfirmPasswordError('');

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
        if (confirmPassword.trim() === '') {
            setConfirmPasswordError('La confirmation du mot de passe est requise');
            valid = false;
        }

        // Vérifie les critères de mot de passe seulement si le champ mot de passe n'est pas vide
        if (valid && (!minLength || !hasSpecialChar || !hasNumber || !hasUppercase || !passwordsMatch)) {
            setPasswordError('Le mot de passe ne respecte pas les critères ou ne correspond pas.');
            valid = false;
        }

        // Si tous les champs sont valides, effectuer la logique d'inscription
        if (valid) {
            console.log('Nom:', lastName);
            console.log('Prénom:', firstName);
            console.log('Mot de passe:', password);
            // Logique supplémentaire pour l'inscription ici
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Inscription</Text>
            
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

            {/* Critères de mot de passe */}
            <View style={styles.criteriaContainer}>
                <Text style={[styles.criteria, minLength ? styles.valid : styles.invalid]}>
                    • Au moins 8 caractères
                </Text>
                <Text style={[styles.criteria, hasSpecialChar ? styles.valid : styles.invalid]}>
                    • Un caractère spécial (!, @, #, $, etc.)
                </Text>
                <Text style={[styles.criteria, hasNumber ? styles.valid : styles.invalid]}>
                    • Un chiffre
                </Text>
                <Text style={[styles.criteria, hasUppercase ? styles.valid : styles.invalid]}>
                    • Une lettre majuscule
                </Text>
            </View>

            <Input 
                placeholder="Confirmez le mot de passe" 
                value={confirmPassword} 
                onChangeText={(text) => {
                    setConfirmPassword(text);
                    setConfirmPasswordError(''); // Efface l'erreur en cas de saisie
                }} 
                secureTextEntry 
            />
            {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

            {/* Message d'erreur si les mots de passe ne correspondent pas */}
            <Text style={[styles.criteria, passwordsMatch ? styles.valid : styles.invalid]}>
                {passwordsMatch ? '' : 'Les mots de passe doivent correspondre'}
            </Text>

            <Button title="S'inscrire" onPress={handleRegister} />
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
    criteriaContainer: {
        marginTop: 10, 
        marginBottom: 15, 
    },
    criteria: {
        fontSize: 14, 
        marginVertical: 2, 
    },
    valid: {
        color: 'green', 
    },
    invalid: {
        color: 'red', 
    },
    errorText: {
        color: 'red', 
        fontSize: 12, 
        marginBottom: 10, 
        marginTop: -10, 
    },
});

export default RegisterScreen;
