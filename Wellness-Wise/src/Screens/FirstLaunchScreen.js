// src/Screens/FirstLaunchScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const FirstLaunchScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Our App!</Text>
      <Text style={styles.description}>
        Wellness Wise extends a warm invitation to embark on a transformative journey towards a healthier and happier you. Our platform is designed to empower and inspire, offering a unique blend of personalized goal-setting, community support, and engaging gamification. With Wellness Wise, you're not just setting goals; you're embarking on an exciting adventure towards holistic well-being. Join a vibrant community of like-minded individuals, personalize your wellness objectives, and embark on a journey of self-discovery and growth. From managing stress to improving nutrition and fitness, Wellness Wise provides the tools and support you need to thrive. Download Wellness Wise today and start your journey towards a healthier, happier life!
      </Text>
      <Button
        title="Start"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: "#e0ebeb",
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default FirstLaunchScreen;
