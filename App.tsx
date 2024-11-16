import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack";
import HomeScreen from "./src/screens/HomeScreen";
import Inscription from "./src/screens/RegisterScreen";
import Connexion from "./src/screens/ConnectionScreen";
import SurveyListScreen from "./src/screens/SurveyListScreen";
import CreateSurveyScreen from "./src/screens/CreateSurveyScreen";

// Définition des types pour le Stack Navigator
export type RootStackParamList = {
  Accueil: undefined;
  Inscription: undefined;
  Connexion: undefined;
  SurveyList: undefined;
  CreateSurvey: { refreshSurveys?: () => void } | undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Accueil">
        <Stack.Screen name="Accueil" component={HomeScreen} />
        <Stack.Screen name="Inscription" component={Inscription} />
        <Stack.Screen name="Connexion" component={Connexion} />
        <Stack.Screen name="SurveyList" component={SurveyListScreen} />
        <Stack.Screen name="CreateSurvey" component={CreateSurveyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
