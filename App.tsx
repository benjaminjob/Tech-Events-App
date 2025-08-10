import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TechEventsScreen } from "./src/screens/TechEventsScreen";
import { StatusBar } from "expo-status-bar";
import { useAppStore } from "./src/state/app-store";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <TechEventsScreen />
          <StatusBar style="light" />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}