import React, { useState, useEffect } from "react";
import { View, Text, Button, Image, ActivityIndicator, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { launchCamera } from "react-native-image-picker";

const ImageSelector = ({ onImageSelected }) => {
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState("none");
  const [photoUri, setPhotoUri] = useState(null);
  const [loading, setLoading] = useState(true);

  // Chargement des thèmes depuis l'API
  useEffect(() => {
    fetch("http://localhost:3001/api/themes")
      .then((res) => res.json())
      .then((data) => {
        setThemes(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Erreur lors de la récupération des thèmes :", error.message);
        setLoading(false);
      });
  }, []);

  // Gestion de la sélection d'un thème ou de la prise d'une photo
  const handleThemeChange = (value) => {
    setSelectedTheme(value);

    if (value === "camera") {
      handleTakePhoto();
    } else {
      const selectedThemeObj = themes.find((theme) => theme.title === value);
      if (selectedThemeObj) {
        const imageUri = `data:image/jpeg;base64,${selectedThemeObj.image_base64}`;
        setPhotoUri(imageUri);
        onImageSelected(imageUri);
      } else {
        setPhotoUri(null);
        onImageSelected(null);
      }
    }
  };

  // Gestion de la prise de photo avec la caméra
  const handleTakePhoto = () => {
    launchCamera({ mediaType: "photo", cameraType: "back", saveToPhotos: true }, (response) => {
      if (response.didCancel) {
        console.log("📸 Photo annulée par l'utilisateur.");
        return;
      }
      if (response.assets?.length > 0) {
        const uri = response.assets[0].uri;
        console.log("✅ Photo capturée :", uri);
        setPhotoUri(uri);
        onImageSelected(uri);
      }
    });
  };

  return (
    <View>
      <Text style={styles.subtitle}>Sélectionner une image :</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <Picker selectedValue={selectedTheme} onValueChange={handleThemeChange} style={styles.picker}>
          <Picker.Item label="Pas d'image" value="none" />
          <Picker.Item label="Prendre une photo" value="camera" />
          {themes.map((theme) => (
            <Picker.Item key={theme.title} label={theme.title} value={theme.title} />
          ))}
        </Picker>
      )}

      {photoUri && <Image source={{ uri: photoUri }} style={styles.preview} />}
      {selectedTheme !== "none" && selectedTheme !== "camera" && (
        <Text style={styles.selectedTheme}>Thème sélectionné : {selectedTheme}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  subtitle: { fontSize: 18, fontWeight: "bold", marginTop: 15 },
  picker: { height: 50, backgroundColor: "#fff", marginBottom: 10 },
  preview: { width: 100, height: 100, marginVertical: 10 },
  selectedTheme: { fontSize: 16, fontStyle: "italic", color: "#555", marginTop: 5 },
});

export default ImageSelector;
