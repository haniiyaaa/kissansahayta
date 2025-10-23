import "./global.css"
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";  
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import signup from './signup'; 
import "./global.css";
import languagepage from "./languagepage";  



const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="languagepage"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="signup" component={signup} />
        <Stack.Screen name="languagepage" component={languagepage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

