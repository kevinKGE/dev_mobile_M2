import AsyncStorage from '@react-native-async-storage/async-storage';

// Fonction pour se connecter
export const fetchUserData = async () => {
    const token = await AsyncStorage.getItem('userToken');
    
    try {
        const response = await fetch('https://api.votrebackend.com/user', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Erreur de l\'API');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur de récupération des données utilisateur:', error);
        throw error;
    }
};
