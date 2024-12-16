import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Colors } from "../constants/styles";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window"); // Get screen dimensions

const motivationalQuotes = [
  "Stay consistent, stay motivated.",
  "Your limitation—it’s only your imagination.",
  "Dream it. Wish it. Do it.",
  "You are your only limit.",
  "Be stronger than your excuses.",
  "Success is a journey, not a destination.",
  "Focus on the process, not the outcome.",
];

// Responsive font scaling
const responsiveFontSize = (size) => {
  const scale = screenWidth / 375; // 375 is the base screen width for scaling
  return Math.round(size * scale);
};

const QuotesHeader = ({ title }) => {
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity value

  useEffect(() => {
    const changeQuote = () => {
      // Fade out animation
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        // After fade out, change quote
        const nextIndex = (currentIndex + 1) % motivationalQuotes.length;
        setCurrentIndex(nextIndex);

        // Fade in animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start();
      });
    };

    const timer = setInterval(changeQuote, 4000); // Change quote every 4 seconds

    return () => clearInterval(timer); // Cleanup timer on unmount
  }, [currentIndex, fadeAnim]);

  return (
    <SafeAreaView style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
      <Animated.Text style={[styles.headerSubtitle, { opacity: fadeAnim }]}>
        {motivationalQuotes[currentIndex]}
      </Animated.Text>
    </SafeAreaView>
  );
};

export default QuotesHeader;

const styles = StyleSheet.create({
  header: {
    width: "100%",
    paddingVertical: screenHeight * 0.02, // Responsive padding
    backgroundColor: Colors.lightBlueColor,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    marginBottom: screenHeight * 0.02, // Responsive margin
    alignSelf: "center",
    marginTop: 1,
  },
  headerTitle: {
    fontSize: responsiveFontSize(24), // Scaled font size
    fontWeight: "bold",
    color: "#fff",
    marginBottom: screenHeight * 0.01,
  },
  headerSubtitle: {
    fontSize: responsiveFontSize(20), // Scaled font size
    color: "#F7EF8A",
    textAlign: "center",
    paddingHorizontal: "7%", // Percentage for consistent spacing
  },
  quoteContainer: {
    width: screenWidth, // Each slide takes up the full width of the screen
    justifyContent: "center",
    alignItems: "center",
  },
});
