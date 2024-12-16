import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getAllGoals } from "../../store/slice/goalSlice";
import { ActivityIndicator } from "react-native";
import { Colors } from "../../constants/styles";

const { width, height } = Dimensions.get("window");

const HistoryScreen = () => {
  const dispatch = useDispatch();
  const { loading, error, goals } = useSelector((state) => state.goal);

  useFocusEffect(
    useCallback(() => {
      dispatch(getAllGoals());
    }, [dispatch])
  );

  // Filter the goals data to include status logic
const filteredGoals = goals?.data
  .filter((goal) => {
    const currentDate = new Date();
    const goalEndDate = new Date(goal.end_date);

    // Include only goals where the end date has passed
    return goalEndDate < currentDate;
  })
  .map((goal) => {
    let updatedStatus = goal.status; // Default to current status

    // Safely check for progress and progress_percentage
    const progressPercentage = goal.progress?.progress_percentage || "0.00";

    if (progressPercentage === "100.00" && goal.status === "completed") {
      updatedStatus = "Completed";
    } else if (parseFloat(progressPercentage) < 100) {
      updatedStatus = "Failed";
    }

    return { ...goal, status: updatedStatus };
  });

  // console.log("Filtered Goals: ", filteredGoals);

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

  // Render each goal item
  const renderGoalItem = ({ item }) => (
    <View
      style={[
        styles.goalCard,
        item.status === "Completed" ? styles.completed : styles.missed,
      ]}
    >
      <View style={styles.goalInfo}>
        <Text style={styles.goalTitle}>{item.title}</Text>
        <Text style={styles.goalDate}>{formatDate(item.end_date)}</Text>
      </View>
      <Text style={styles.goalStatus}>{item.status}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Your Goal History</Text>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.grayColor} />
        </View>
      ) : filteredGoals.length === 0 ? (
        <Text style={styles.noDataText}>No Goals History Found</Text>
      ) : (
        <FlatList
          data={filteredGoals}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderGoalItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
      {/* <TouchableOpacity style={styles.clearButton}>
        <Text style={styles.clearButtonText}>Clear History</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
   flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: "5%", // Relative padding
    paddingVertical: "2%",
  },
  headerText: {
    fontSize: width * 0.06, // Scale font size
    fontWeight: "bold",
    color: "#333",
    marginVertical: height * 0.01,
    textAlign: "center",
    marginBottom:'5%',
  },
  listContent: {
    paddingBottom: height * 0.1, // Add dynamic padding
  },
  goalCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: width * 0.04, // Scale padding
    marginBottom: height * 0.015, // Scale margin
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  completed: {
    borderLeftColor: "#4CAF50",
    borderLeftWidth: 5,
  },
  missed: {
    borderLeftColor: "#F44336",
    borderLeftWidth: 5,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: width * 0.045, // Scale font size
    fontWeight: "bold",
    color: "#333",
  },
  goalDate: {
    fontSize: width * 0.035, // Scale font size
    color: "#777",
    marginTop: height * 0.005,
  },
  goalStatus: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "#555",
  },
  clearButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#6200EE",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
  },
  noDataText: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#888",
    textAlign: "center",
    marginTop: height * 0.1,
  },
});
