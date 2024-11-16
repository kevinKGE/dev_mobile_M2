import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import Input from '../components/Input';

const RegisterScreen: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const handleRegister = () => {
        setFirstNameError('');
        setLastNameError('');
        setPasswordError('');
        setConfirmPasswordError('');

        let valid = true;

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

        if (valid && password !== confirmPassword) {
            setPasswordError('Les mots de passe ne correspondent pas.');
            valid = false;
        }

        if (valid) {
            console.log('Inscription réussie avec :', { firstName, lastName, password });
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
                    setLastNameError('');
                }}
            />
            {lastNameError && <Text style={styles.errorText}>{lastNameError}</Text>}

            <Input 
                placeholder="Prénom" 
                value={firstName} 
                onChangeText={(text) => {
                    setFirstName(text);
                    setFirstNameError('');
                }}
            />
            {firstNameError && <Text style={styles.errorText}>{firstNameError}</Text>}

            <Input 
                placeholder="Mot de passe" 
                value={password} 
                onChangeText={(text) => {
                    setPassword(text);
                    setPasswordError('');
                }}
                secureTextEntry
            />
            {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

            <Input 
                placeholder="Confirmez le mot de passe" 
                value={confirmPassword} 
                onChangeText={(text) => {
                    setConfirmPassword(text);
                    setConfirmPasswordError('');
                }}
                secureTextEntry
            />
            {confirmPasswordError && <Text style={styles.errorText}>{confirmPasswordError}</Text>}

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
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
    },
});

export default RegisterScreen;
