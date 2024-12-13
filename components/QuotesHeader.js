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

const { width: screenWidth } = Dimensions.get("window"); // Get screen width

const motivationalQuotes = [
  "Stay consistent, stay motivated.",
  "The only way to do great work is to love what you do.",
  "Success is the sum of small efforts, repeated day in and day out.",
  "Your limitation—it’s only your imagination.",
  "Dream it. Wish it. Do it.",
];

const QuotesHeader = ({title}) => {
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
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
      <Animated.Text style={[styles.headerSubtitle, { opacity: fadeAnim }]}>
        {motivationalQuotes[currentIndex]}
      </Animated.Text>
    </View>
  );
};

export default QuotesHeader;

const styles = StyleSheet.create({
  header: {
    width: "100%",
    paddingVertical: 12,
    backgroundColor: Colors.lightBlueColor,
    alignItems: "center",
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    marginBottom: 10,
    height: "14%",
    marginTop: 1,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 19,
    color: "#F7EF8A",
    textAlign: "center",
    paddingHorizontal: 20,
    marginBottom: 5,
  },
  quoteContainer: {
    width: screenWidth, // Each slide takes up the full width of the screen
    justifyContent: "center",
    alignItems: "center",
  },
});
