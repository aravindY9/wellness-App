// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/Screens/LoginScreen'; 
import SignUpScreen from './src/Screens/SignupScreen';
import HomeScreen from './src/Screens/HomeScreen';
import ProfileScreen from './src/Screens/ProfileScreen';
import Home from './src/Screens/Home';
import FirstLaunchScreen from './src/Screens/FirstLaunchScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';


// const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();



function App() {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then(value => {
      if (value === null) {
        AsyncStorage.setItem('alreadyLaunched', 'true'); // Mark as launched
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []);

  if (isFirstLaunch === null) {
    return null; // This is the case where the app is loading the launch status
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isFirstLaunch ? "FirstLaunch" : "Login"}
        screenOptions={{
          headerShown: false,
        }}
      >
        {isFirstLaunch && <Stack.Screen name="FirstLaunch" component={FirstLaunchScreen} />}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignUpScreen} />
        {/* <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} /> */}
        <Stack.Screen name="HomeD" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
