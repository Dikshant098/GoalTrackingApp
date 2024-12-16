import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback } from "react";
import { StyleSheet, Text, View, Dimensions, FlatList, ActivityIndicator, useWindowDimensions } from "react-native";
import { ProgressChart } from "react-native-chart-kit";
import { useDispatch, useSelector } from "react-redux";
import { getAllGoals } from "../../store/slice/goalSlice";
import { Colors } from "../../constants/styles";

const screenWidth = Dimensions.get("window").width;
const { width } = Dimensions.get("window");

const TrackYourGoalScreen = () => {
  const dispatch = useDispatch();

  const { loading, error, goals } = useSelector((state) => state.goal);

  useFocusEffect(
    useCallback(() => {
      dispatch(getAllGoals());
    }, [dispatch])
  );


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

  const renderGoal = ({ item }) => {
    // Get progress percentage, default to 0 if no progress
    const progress = item.progress
      ? parseFloat(item.progress.progress_percentage) / 100
      : 0;

    return (
      <View style={styles.goalCard}>
        <Text style={styles.goalTitle}>{item.title}</Text>
        <ProgressChart
          data={{
            labels: [""], // No labels for clean design
            data: [progress], // Map progress to chart
          }}
          width={screenWidth * 0.9}
          height={150}
          strokeWidth={10}
          radius={40}
          chartConfig={{
            backgroundGradientFrom: "#FFF",
            backgroundGradientTo: "#FFF",
            color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          hideLegend={true}
        />
        <Text style={styles.progressText}>
          {Math.round(progress * 100)}% Complete
        </Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.dates}>
          {formatDate(item.start_date)} to {formatDate(item.end_date)}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Track Your Goals</Text>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.grayColor} />
        </View>
      ) : goals?.data?.length === 0 ? (
        <Text style={styles.noDataText}>No Goals Found</Text>
      ) : (
        <FlatList
          data={goals?.data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderGoal}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default TrackYourGoalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: "5%", // Relative padding
    paddingVertical: "2%",
  },
  headerText: {
    fontWeight: "bold",
    color: "#333",
    marginVertical: 10,
    textAlign: "center",
    fontSize: width * 0.06,
  },
  listContent: {
    paddingBottom: "10%", // Adjust based on screen height
  },
  goalCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: "5%",
    marginBottom: "4%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    alignItems: "center",
  },
  goalTitle: {
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: "2%",
  },
  progressText: {
    color: "#555",
    marginTop: "2%",
  },
  description: {
    color: "#777",
    textAlign: "center",
    marginTop: "2%",
  },
  dates: {
    color: "#999",
    marginTop: "1%",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    fontWeight: "bold",
    color: "#888",
    textAlign: "center",
    marginTop: "10%",
  },
});
