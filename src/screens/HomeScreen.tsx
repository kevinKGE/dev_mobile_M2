import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Button from '../components/Button';

type HomeScreenProps = {
    navigation: {
        navigate: (screen: string) => void;
    };
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenue !</Text>
            <Text style={styles.subtitle}>Choisissez une option pour continuer</Text>

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
        backgroundColor: '#f5f5f5',
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
        width: '60%',
        marginVertical: 10,
    },
    button: {
        paddingVertical: 15,
        borderRadius: 10,
        backgroundColor: '#007AFF',
    },
});

export default HomeScreen;
