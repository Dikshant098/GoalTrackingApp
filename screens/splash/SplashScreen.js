import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/styles';

const SplashScreen = () => {
  const navigation = useNavigation();
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial opacity
  const [scaleAnim] = useState(new Animated.Value(0.5)); // Initial scale

  // Fade-in and scale-up animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, // Fade in to full opacity
      duration: 1500, // Duration in milliseconds
      useNativeDriver: true,
    }).start();

    Animated.timing(scaleAnim, {
      toValue: 1, // Scale to normal size
      duration: 1500, // Duration in milliseconds
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      navigation.replace('Login User'); // Navigate to the login screen after 4 seconds
    }, 4000);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          opacity: fadeAnim, // Apply fade animation
          transform: [{ scale: scaleAnim }], // Apply scale animation
        }}
      >
        <Text style={styles.goalText}>My Goal</Text>
        <Text style={styles.trackingText}>Tracking</Text>
      </Animated.View>
      <StatusBar style="dark" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.blueColor, // Background color can be customized
  },
  goalText: {
    color: 'white',
    fontSize: 60,
    fontWeight: 'bold',
    textAlign: 'center', // Ensure "Goal" is centered
    fontFamily: 'cursive', // Apply cursive font
  },
  trackingText: {
    color: 'white',
    fontSize: 60,
    fontWeight: 'bold',
    textAlign: 'center', // Ensure "Tracking" is centered
    marginTop: 10, // Space between "Goal" and "Tracking"
    fontFamily: 'cursive', // Apply cursive font
  },
});

export default SplashScreen;
