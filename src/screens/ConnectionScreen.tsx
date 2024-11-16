import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Input from '../components/Input';

type ConnectionScreenProps = {
    navigation: {
        navigate: (screen: string) => void;
    };
};

const ConnectionScreen: React.FC<ConnectionScreenProps> = ({ navigation }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');

    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleLogin = () => {
        setFirstNameError('');
        setLastNameError('');
        setPasswordError('');

        let valid = true;

        if (!firstName.trim()) {
            setFirstNameError('Le prénom est requis');
            valid = false;
        }
        if (!lastName.trim()) {
            setLastNameError('Le nom est requis');
            valid = false;
        }
        if (!password.trim()) {
            setPasswordError('Le mot de passe est requis');
            valid = false;
        }

        if (valid) {
            console.log('Connexion réussie avec :', { firstName, lastName, password });
            navigation.navigate('SurveyList');
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
    },
});

export default ConnectionScreen;
