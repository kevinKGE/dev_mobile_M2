import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';

type RadioButtonProps = {
    label: string;
    selected: boolean;
    onPress: () => void;
    containerStyle?: StyleProp<ViewStyle>; // Optionnel : Style pour le conteneur
    labelStyle?: StyleProp<TextStyle>; // Optionnel : Style pour le label
};

const RadioButton: React.FC<RadioButtonProps> = ({ label, selected, onPress, containerStyle, labelStyle }) => {
    return (
        <TouchableOpacity style={[styles.container, containerStyle]} onPress={onPress}>
            <View style={[styles.radio, selected && styles.radioSelected]} />
            <Text style={[styles.label, labelStyle]}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    radio: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#007AFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    radioSelected: {
        backgroundColor: '#007AFF',
    },
    label: {
        fontSize: 16,
    },
});

export default RadioButton;
