import React, { useState } from "react";
import { View, Text, Alert, StyleSheet, TouchableOpacity } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App"; // Chemin vers App.tsx
import Input from "../components/Input";

type ConnectionScreenProps = NativeStackScreenProps<RootStackParamList, "Connexion">;

const ConnectionScreen: React.FC<ConnectionScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");
  const [showRegisterButton, setShowRegisterButton] = useState(false);

  const handleLogin = async () => {
    // Réinitialisation des erreurs
    setUsernameError("");
    setPasswordError("");
    setServerError("");
    setShowRegisterButton(false);

    let valid = true;
    if (!username.trim()) {
      setUsernameError("Le pseudo est requis.");
      valid = false;
    }
    if (!password.trim()) {
      setPasswordError("Le mot de passe est requis.");
      valid = false;
    }

    if (!valid) return;

    try {
      const response = await axios.post("http://localhost:3000/login", {
        username,
        password,
      });

      if (response.data.token) {
        await AsyncStorage.setItem("jwt_token", response.data.token);
        Alert.alert("Succès", "Connexion réussie !");
        navigation.navigate("SurveyList");
      } else {
        Alert.alert("Erreur", "Connexion échouée. Aucun token reçu.");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setServerError("Le pseudo n'existe pas dans la base de données.");
        setShowRegisterButton(true);
      } else {
        Alert.alert("Erreur", "Une erreur s'est produite lors de la connexion.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <Input
        placeholder="Pseudo"
        value={username}
        onChangeText={(text) => {
          setUsername(text);
          setUsernameError("");
        }}
        containerStyle={styles.inputContainer}
      />
      {usernameError !== "" && <Text style={styles.errorText}>{usernameError}</Text>}
      <Input
        placeholder="Mot de passe"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setPasswordError("");
        }}
        secureTextEntry
        containerStyle={styles.inputContainer}
      />
      {passwordError !== "" && <Text style={styles.errorText}>{passwordError}</Text>}
      {serverError !== "" && <Text style={styles.errorText}>{serverError}</Text>}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Se connecter</Text>
      </TouchableOpacity>
      {showRegisterButton && (
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate("Inscription")}
        >
          <Text style={styles.registerButtonText}>Pas de compte ? Inscrivez-vous ici</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 15,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
  loginButton: {
    marginTop: 20,
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerButton: {
    marginTop: 20,
    alignItems: "center",
  },
  registerButtonText: {
    color: "#007BFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default ConnectionScreen;
