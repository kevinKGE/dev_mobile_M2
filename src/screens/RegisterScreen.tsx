import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Input from "../components/Input";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App"; // Import du RootStackParamList défini dans App.tsx

type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, "Inscription">;

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showLoginButton, setShowLoginButton] = useState(false);

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    specialChar: false,
    number: false,
  });

  const validatePassword = (password: string) => {
    setPasswordCriteria({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      specialChar: /[@$!%*?&]/.test(password),
      number: /\d/.test(password),
    });
  };

  const handleRegister = async () => {
    setUsernameError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setShowLoginButton(false);
  
    let valid = true;
  
    if (username.trim() === "") {
      setUsernameError("Le pseudo est requis");
      valid = false;
    }
    if (password.trim() === "") {
      setPasswordError("Le mot de passe est requis");
      valid = false;
    } else if (
      !passwordCriteria.length ||
      !passwordCriteria.uppercase ||
      !passwordCriteria.lowercase ||
      !passwordCriteria.specialChar ||
      !passwordCriteria.number
    ) {
      setPasswordError("Le mot de passe ne respecte pas les critères requis.");
      valid = false;
    }
    if (confirmPassword.trim() === "") {
      setConfirmPasswordError("La confirmation du mot de passe est requise");
      valid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Les mots de passe ne correspondent pas.");
      valid = false;
    }
  
    if (valid) {
      try {
        const response = await axios.post("http://localhost:3000/register", {
          username,
          password,
        });
  
        if (response.data && response.data.id) {
          console.log("Utilisateur créé avec succès :", response.data);
  
          await AsyncStorage.setItem("jwt_token", response.data.token);
          await AsyncStorage.setItem("user_id", response.data.id.toString()); // Stocke l'ID utilisateur
  
          Alert.alert("Succès", "Compte créé avec succès !");
          navigation.navigate("HomeClient");
        } else {
          Alert.alert("Erreur", "Impossible de créer le compte.");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 400) {
            setUsernameError("Le pseudo existe déjà.");
            setShowLoginButton(true);
          } else {
            Alert.alert("Erreur", "Erreur du serveur : " + error.message);
          }
        } else {
          Alert.alert("Erreur", "Une erreur inconnue s'est produite.");
        }
      }
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>
      <Input
        placeholder="Pseudo"
        value={username}
        onChangeText={(text) => {
          setUsername(text);
          setUsernameError("");
        }}
      />
      {usernameError && <Text style={styles.errorText}>{usernameError}</Text>}

      <Input
        placeholder="Mot de passe"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setPasswordError("");
          validatePassword(text);
        }}
        secureTextEntry
      />
      {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

      <View style={styles.passwordCriteria}>
        <Text style={passwordCriteria.length ? styles.valid : styles.invalid}>
          - Au moins 8 caractères
        </Text>
        <Text style={passwordCriteria.uppercase ? styles.valid : styles.invalid}>
          - Une majuscule
        </Text>
        <Text style={passwordCriteria.lowercase ? styles.valid : styles.invalid}>
          - Une minuscule
        </Text>
        <Text style={passwordCriteria.specialChar ? styles.valid : styles.invalid}>
          - Un caractère spécial (@$!%*?&)
        </Text>
        <Text style={passwordCriteria.number ? styles.valid : styles.invalid}>
          - Un chiffre
        </Text>
      </View>

      <Input
        placeholder="Confirmez le mot de passe"
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          setConfirmPasswordError("");
        }}
        secureTextEntry
      />
      {confirmPasswordError && (
        <Text style={styles.errorText}>{confirmPasswordError}</Text>
      )}

      <Button title="S'inscrire" onPress={handleRegister} />

      {showLoginButton && (
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Connexion")}
        >
          <Text style={styles.loginButtonText}>
            Pseudo déjà existant ? Connectez-vous ici
          </Text>
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  passwordCriteria: {
    marginVertical: 10,
  },
  valid: {
    color: "green",
    fontSize: 12,
  },
  invalid: {
    color: "red",
    fontSize: 12,
  },
  loginButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  loginButtonText: {
    color: "white",
    textAlign: "center",
  },
});

export default RegisterScreen;
