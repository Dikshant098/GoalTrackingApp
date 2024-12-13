import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { ProgressChart, LineChart } from "react-native-chart-kit";
import { useDispatch, useSelector } from "react-redux";
import { getAllGoals } from "../../store/slice/goalSlice";
import { ActivityIndicator } from "react-native";
import { Colors } from "../../constants/styles";

const screenWidth = Dimensions.get("window").width;

const ViewProgressScreen = () => {
  const dispatch = useDispatch();

  const { loading, error, goals } = useSelector((state) => state.goal);

  useFocusEffect(
    useCallback(() => {
      dispatch(getAllGoals());
    }, [dispatch])
  );

  const goalProgress =
    goals?.data?.map((goal) => {
      return {
        title: goal.title,
        progress: goal.progress
          ? parseFloat(goal.progress.progress_percentage)
          : 0,
        status: goal.status,
      };
    }) || [];

  // Calculate overall progress percentage
  const totalProgress =
    goalProgress.reduce((acc, curr) => acc + curr.progress, 0) /
    (goalProgress.length || 1);

  // Prepare data for LineChart
  const lineChartData = {
    labels: goalProgress.map((goal, index) => `Goal ${index + 1}`),
    datasets: [
      {
        data: goalProgress.map((goal) => goal.progress / 1),
        color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Goal Progress</Text>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.grayColor} />
        </View>
      ) : goalProgress.length === 0 ? (
        // Display "No Data Found" if there are no goals
        <Text style={styles.noDataText}>No Goal Progress Found</Text>
      ) : (
        <ScrollView>
          {/* Progress Chart */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Overall Progress</Text>
            <ProgressChart
              data={{
                labels: [""], // No labels for single progress bar
                data: [totalProgress / 100],
              }}
              width={screenWidth * 0.9}
              height={150}
              strokeWidth={10}
              radius={42}
              chartConfig={{
                backgroundGradientFrom: "#FFF",
                backgroundGradientTo: "#FFF",
                color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
              }}
              hideLegend={true}
            />
            <Text style={styles.progressText}>
              {Math.round(totalProgress)}% Complete
            </Text>
          </View>

          {/* Line Chart */}
          <View style={styles.lineChartContainer}>
            <Text style={styles.chartTitle}>Progress by Goals</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <LineChart
                data={lineChartData}
                width={Math.max(screenWidth * 0.9, goalProgress.length * 80)} // Dynamically adjust width
                height={220}
                chartConfig={{
                  backgroundColor: "#FFF",
                  backgroundGradientFrom: "#FFF",
                  backgroundGradientTo: "#FFF",
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 8,
                  },
                }}
                bezier
              />
            </ScrollView>
          </View>

          {/* Goals List */}
          {/* <View style={{ width: "100%" }}>
            {goalProgress.map((goal, index) => (
              <View key={index} style={styles.goalItem}>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <Text style={styles.goalStatus}>
                  Status: {goal.status} | Progress: {goal.progress}%
                </Text>
              </View>
            ))}
          </View> */}
        </ScrollView>
      )}

      {/* Set New Goal Button */}
      {/* <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Set New Goal</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default ViewProgressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 10,
  },
  chartContainer: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  lineChartContainer: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  progressText: {
    fontSize: 16,
    color: "#555",
    marginTop: 10,
  },
  button: {
    position: "absolute",
    bottom: 20,
    backgroundColor: "#6200EE",
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  buttonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
  goalItem: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  goalStatus: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
  },
  noDataText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#888",
    textAlign: "center",
    marginTop: 50,
  },
});
