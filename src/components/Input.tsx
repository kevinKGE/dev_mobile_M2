import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, StyleProp, ViewStyle, TextInputProps } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type InputProps = {
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    containerStyle?: StyleProp<ViewStyle>; // Optionnel : Style pour le conteneur
} & TextInputProps; // Pour inclure toutes les autres props possibles de TextInput

const Input: React.FC<InputProps> = ({ placeholder, value, onChangeText, secureTextEntry, containerStyle, ...rest }) => {
    const [isPasswordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!isPasswordVisible);
    };

    return (
        <View style={[styles.container, containerStyle]}>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry && !isPasswordVisible}
                {...rest}
            />
            {secureTextEntry && (
                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.icon}>
                    <Icon name={isPasswordVisible ? 'visibility' : 'visibility-off'} size={24} color="grey" />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: '#f9f9f9',
    },
    input: {
        flex: 1,
        height: 50,
    },
    icon: {
        padding: 5,
    },
});

export default Input;
