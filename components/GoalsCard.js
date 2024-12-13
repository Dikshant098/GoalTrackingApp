import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Colors } from "../constants/styles";

const GoalsCard = ({ title, goals }) => {

    // Function to format the date to DD/MM/YYYY
    const formatDate = (date) => {
      if (!(date instanceof Date)) {
        date = new Date(date); // Ensure date is a Date object
      }
      if (isNaN(date)) {
        // console.error("Invalid date:", date);
        return "Invalid Date";
      }
  
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
      const year = date.getFullYear();
  
      return `${day}/${month}/${year}`;
    };

      // Function to format the time to HH:MM AM/PM
  const formatTime = (timeStr) => {
    const [hours, minutes, seconds] = timeStr.split(":").map(Number); // Parse the time string
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format and handle midnight as 12
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  return (
    <View style={styles.card}>
      {/* Section Title */}
      {/* <Text style={styles.sectionTitle}>{title}</Text> */}

      {/* Goal Card */}
      {goals.map((goal) => (
        <View style={styles.goalCard}>
          <Text style={styles.goalTitle}>{goal.title}</Text>
          <Text style={styles.goalDescription}>{goal.description}</Text>
          <View style={styles.dateTimeContainer}>
            <View style={styles.dateTime}>
              <Text style={styles.label}>Start Date:</Text>
              <Text style={styles.value}>{formatDate(goal.start_date)}</Text>
            </View>
            <View style={styles.dateTime}>
              <Text style={styles.label}>End Date:</Text>
              <Text style={styles.value}>{formatDate(goal.end_date)}</Text>
            </View>
            <View style={styles.dateTime}>
              <Text style={styles.label}>Start Time:</Text>
              <Text style={styles.value}>{formatTime(goal.start_time)}</Text>
            </View>
            <View style={styles.dateTime}>
              <Text style={styles.label}>End Time:</Text>
              <Text style={styles.value}>{formatTime(goal.end_time)}</Text>
            </View>
          </View>
          <Text
            style={[
              styles.status,
              goal.status === "completed"
                ? styles.completed
                : goal.status === "pending"
                ? styles.pending
                : goal.status === "in_progress"
                ? styles.inProgress
                : goal.status === "failed"
                ? styles.failed
                : styles.failed,
            ]}
          >
            {goal.status}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default GoalsCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    // marginTop: 20,
    marginBottom: 10,
  },
  goalCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  goalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  goalDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },
  dateTimeContainer: {
    marginBottom: 15,
  },
  dateTime: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    color: "#888",
    fontWeight: "bold",
  },
  value: {
    fontSize: 14,
    color: "#333",
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    padding: 5,
    borderRadius: 5,
  },
  completed: {
    backgroundColor: "#4CAF50",
    color: "#fff",
  },
  failed: {
    backgroundColor: "#F44336",
    color: "#fff",
  },
  pending: {
    backgroundColor: "#FF9800",
    color: "#fff",
  },
  inProgress: {
    backgroundColor: "#FF9800",
    color: "#fff",
  },
  viewButton: {
    alignSelf: "center",
    backgroundColor: Colors.buttonColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
