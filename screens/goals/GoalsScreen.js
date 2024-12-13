import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  clearError,
  deleteGoal,
  getAllGoals,
  setGoal,
  updateGoal,
} from "../../store/slice/goalSlice";
import { Colors } from "../../constants/styles";
import { ActivityIndicator } from "react-native";
import { useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native";
import QuotesHeader from "../../components/QuotesHeader";
import * as Progress from "react-native-progress";

const GoalsScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // Track if the screen is focused

  const [goal, setGoalInput] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [isModalVisible, setModalVisible] = useState(false);
  const [showPicker, setShowPicker] = useState({ type: null, visible: false });
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [currentGoalId, setCurrentGoalId] = useState(null); // Track the goal being edited
  const [searchText, setSearchText] = useState("");
  const [filteredGoals, setFilteredGoals] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const dispatch = useDispatch();
  const { loading, error, goals } = useSelector((state) => state.goal);

  useFocusEffect(
    useCallback(()=>{
      dispatch(getAllGoals());
    }, [dispatch])
  )

  // console.log("All Goals Data : ", goals?.data);

  const refreshGoals = () => {
    setRefreshing(true); // Show loader
    dispatch(getAllGoals())
      .unwrap()
      .finally(() => setRefreshing(false)); // Hide loader after fetching
  };

  // Fetch goals whenever the screen is focused
  useEffect(() => {
    if (isFocused) {
      refreshGoals();
    }
  }, [isFocused]);

  const parseTime = (timeStr) => {
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds, 0);
    return date;
  };

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

  const openModal = (goal) => {
    setModalVisible(true);
    setIsUpdateMode(true); // Set to update mode
    setCurrentGoalId(goal.id); // Set the current goal ID for editing
    setGoalInput(goal.title); // Populate form with existing goal data
    setDescription(goal.description);
    setStartDate(new Date(goal.start_date));
    setEndDate(new Date(goal.end_date));
    setStartTime(parseTime(goal.start_time));
    setEndTime(parseTime(goal.end_time));
  };

  const closeModal = () => {
    setModalVisible(false);
    setGoalInput("");
    setDescription("");
  };

  const addGoalHandler = async () => {
    setErrorMessage(null); // Reset error message

    const start = new Date(startTime);
    const end = new Date(endTime);
    const timeDifference = (end - start) / (1000 * 60); // Difference in minutes

    if (goal.trim() === "" || description.trim() === "") {
      setErrorMessage("Please fill out all fields.");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setErrorMessage("End date cannot be earlier than the start date.");
      return;
    }
    if (timeDifference < 30) {
      setErrorMessage(
        "End time must be at least 30 minutes greater than start time."
      );
      return;
    }

    const formatTime = (date) => {
      return date
        .toLocaleTimeString("en-US", { hour12: false }) // Convert to 24-hour format
        .split(" ")[0]; // Strip unnecessary timezone or AM/PM
    };

    const goalData = {
      title: goal,
      description,
      start_date: startDate.toISOString().split("T")[0], // Format to YYYY-MM-DD
      end_date: endDate.toISOString().split("T")[0],
      start_time: formatTime(startTime), // Format to HH:MM:SS
      end_time: formatTime(endTime), // Format to HH:MM:SS
    };

    dispatch(setGoal(goalData))
      .unwrap()
      .then(() => {
        Alert.alert("Success", "Goal created successfully!");
        closeModal();
        refreshGoals();
        setErrorMessage(null); // Reset error message
      })
      .catch((err) => {
        Alert.alert("Error", err);
      });
  };

  const searchHandler = (text) => {
    setSearchText(text);
    if (text.trim() === "") {
      setFilteredGoals(goals?.data || []); // Show all goals if search text is empty
    } else {
      const filtered = goals?.data.filter((goal) =>
        goal.title.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredGoals(filtered);
    }
  };

  useEffect(() => {
    // Filter goals based on search text
    if (searchText.trim() === "") {
      setFilteredGoals(goals?.data || []); // Show all goals if search text is empty
    } else {
      setFilteredGoals(
        goals?.data?.filter((goal) =>
          goal.title.toLowerCase().includes(searchText.toLowerCase())
        ) || []
      );
    }
  }, [searchText, goals]);

  const updateGoalHandler = async () => {
    setErrorMessage(null); // Reset error message

    const start = new Date(startTime);
    const end = new Date(endTime);
    const timeDifference = (end - start) / (1000 * 60); // Difference in minutes

    if (goal.trim() === "" || description.trim() === "") {
      setErrorMessage("Please fill out all fields.");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      setErrorMessage("End date cannot be earlier than the start date.");
      return;
    }
    if (timeDifference < 30) {
      setErrorMessage(
        "End time must be at least 30 minutes greater than start time."
      );
      return;
    }

    const formatTime = (date) => {
      return date
        .toLocaleTimeString("en-US", { hour12: false }) // Convert to 24-hour format
        .split(" ")[0]; // Strip unnecessary timezone or AM/PM
    };

    const goalId = currentGoalId;
    // console.log("current Goal Id : ", currentGoalId);
    const goalData = {
      goal_title: goal,
      goal_description: description,
      start_date: startDate.toISOString().split("T")[0],
      end_date: endDate.toISOString().split("T")[0],
      start_time: formatTime(startTime), // Format to HH:MM:SS
      end_time: formatTime(endTime), // Format to HH:MM:SS
    };

    dispatch(updateGoal({ goalId, goalData }));
    closeModal();
    refreshGoals();
    setErrorMessage(null); // Reset error message
  };

  const deleteGoalHandler = async (goalId) => {
    Alert.alert(
      "Delete",
      "Are you sure you want to delete this goal?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            dispatch(deleteGoal(goalId));
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const onPickerChange = (event, selectedDate) => {
    if (event.type === "set") {
      const { type } = showPicker;
      setShowPicker({ type: null, visible: false });
      if (type === "startDate") setStartDate(selectedDate);
      if (type === "endDate") setEndDate(selectedDate);
      if (type === "startTime") setStartTime(selectedDate);
      if (type === "endTime") setEndTime(selectedDate);
    } else {
      setShowPicker({ type: null, visible: false });
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error, [
        { text: "OK", onPress: () => dispatch(clearError()) },
      ]);
    }
  }, [error]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <View style={styles.container}>
        {/* {header()} */}
        <QuotesHeader title="Your Personal Goals"/>
        <View style={styles.contentContainer}>
          {searchGoals()}
          {actionButtonToAddGoal()}
          {goalsList()}
        </View>
        {addNewGoal()}
      </View>
    </SafeAreaView>
  );

  // function header() {
  //   return (
  //     <View style={styles.header}>
  //       <Text style={styles.headerTitle}>Your Personal Goals</Text>
  //       <Text style={styles.headerSubtitle}>
  //         “Stay consistent, stay motivated.”
  //       </Text>
  //     </View>
  //   );
  // }

  function searchGoals() {
    return (
      goals?.data?.length > 0 && (
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={24}
            color="#ccc"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchBar}
            placeholder="Search goals..."
            value={searchText}
            onChangeText={(text) => setSearchText(text)} // Update search text
          />
        </View>
      )
    );
  }

  function actionButtonToAddGoal() {
    // Floating Action Button to Add Goal
    return (
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          // Reset the modal to add mode
          setGoalInput("");
          setDescription("");
          setStartDate(new Date());
          setEndDate(new Date());
          setStartTime(new Date());
          setEndTime(new Date());
          setIsUpdateMode(false); // Ensure it's in add mode
          setModalVisible(true);
        }}
      >
        <Ionicons name="add" size={25} color="white" />
      </TouchableOpacity>
    );
  }

  function goalsList() {
    return loading ? (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.grayColor} />
      </View>
    ) : (
      <FlatList
        data={filteredGoals}
        renderItem={({ item }) => {
          // Get the index from the original goals list
          const originalIndex =
            goals?.data.findIndex((goal) => goal.id === item.id) + 1;

          // Determine the status text and style
          const progress = parseFloat(item?.progress?.progress_percentage || 0);
          // console.log("progress  : ", progress);
          const getStatusStyle = () => {
            const currentDate = new Date();
            const startDate = new Date(item.start_date);
            const endDate = new Date(item.end_date);

            // Parse start and end times for comparison
            const currentTime = currentDate.getTime();
            const endTime = new Date(
              `${item.end_date}T${item.end_time}`
            ).getTime();

            // Check if start and end dates are the same
            const isSameDay =
              startDate.toDateString() === endDate.toDateString();

            if (isSameDay) {
              if (progress === 100) {
                // Goal completed before the end time on the same day
                return { text: "Completed", color: Colors.greenColor };
              }
              if (currentTime > endTime) {
                // Same day but the end time has passed
                return { text: "Failed", color: Colors.redColor };
              }
              // Same day but not completed yet and end time hasn't passed
              return { text: "Pending", color: 'purple' };
            }

            const isExpired = endDate < currentDate;

            if (isNaN(progress)) {
              // Default to "Pending" if progress is invalid or not a number
              return { text: "Pending", color: 'purple' };
            }

            if (progress === 0) {
              return isExpired
                ? { text: "Failed", color: Colors.redColor } // Expired with no progress
                : { text: "Pending", color: 'purple' }; // No progress made
            }

            if (progress > 0 && progress < 100) {
              return { text: "In Progress", color: Colors.blueColor }; // Partial progress
            }

            if (progress === 100) {
              return { text: "Completed", color: Colors.greenColor }; // Fully completed
            }

            // Additional safeguard to prevent "Unknown" status
            return isExpired
              ? { text: "Failed", color: Colors.redColor }
              : { text: "Pending", color: 'purple' };
          };

          const status = getStatusStyle();

          return (
            <View style={styles.goalCardContainer}>
              <TouchableOpacity
                style={styles.goalCard}
                onPress={() => navigation.navigate("goalCheck", { goal: item })}
              >
                <View style={styles.goalItem}>
                  {/* Title with Pending Text */}
                  <View style={styles.titleContainer}>
                    <Text style={styles.goalText}>
                      {originalIndex}. {item.title}
                    </Text>
                    <Text style={[styles.pendingText, { color: status.color }]}>
                      {status.text}
                    </Text>
                  </View>

                  {/* Description with Progress Bar */}
                  <View style={styles.descriptionContainer}>
                    <Text style={styles.goalDescriptionText}>
                      {item.description.length > 20
                        ? `${item.description.slice(0, 30)}...`
                        : item.description}
                    </Text>
                    <Progress.Bar
                      progress={progress / 100} // Example progress value
                      width={80}
                      height={8}
                      color={status.color}
                      borderRadius={5}
                      marginTop={0}
                    />
                  </View>
                  {/* Date and Time Side by Side */}
                  <View style={styles.rowContainer}>
                    <View style={styles.columnContainer}>
                      <View style={styles.rowWithIcon}>
                        <Ionicons
                          name="calendar-outline"
                          size={20}
                          color="#666"
                        />
                        <Text style={styles.heading}>Start Date</Text>
                      </View>
                      <Text style={styles.value}>
                        {formatDate(item.start_date)}
                      </Text>
                    </View>
                    <View style={styles.columnContainer}>
                      <View style={styles.rowWithIcon}>
                        <Ionicons
                          name="calendar-outline"
                          size={20}
                          color="#666"
                        />
                        <Text style={styles.heading}>End Date</Text>
                      </View>
                      <Text style={styles.value}>
                        {formatDate(item.end_date)}
                      </Text>
                    </View>
                  </View>
                  {/* Horizontal Line */}
                  <View style={styles.horizontalLineThick} />
                  <View style={styles.rowContainer}>
                    <View style={styles.columnContainer}>
                      <View style={styles.rowWithIcon}>
                        <Ionicons name="time-outline" size={20} color="#666" />
                        <Text style={styles.heading}>Start Time</Text>
                      </View>
                      <Text style={styles.value}>
                        {formatTime(item.start_time)}
                      </Text>
                    </View>
                    <View style={styles.columnContainer}>
                      <View style={styles.rowWithIcon}>
                        <Ionicons name="time-outline" size={20} color="#666" />
                        <Text style={styles.heading}>End Time</Text>
                      </View>
                      <Text style={styles.value}>
                        {formatTime(item.end_time)}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => openModal(item)}>
                  <Ionicons name="create-outline" size={26} color="blue" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteGoalHandler(item.id)}>
                  <Ionicons name="trash-outline" size={26} color="#ff5252" />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        keyExtractor={(item) => item.id}
        style={styles.goalList}
        refreshing={refreshing}
        onRefresh={refreshGoals}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No goals found. Add some goals!</Text>
        )}
        showsVerticalScrollIndicator={false}
      />
    );
  }

  function addNewGoal() {
    return (
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "android" ? "padding" : "height"}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Goal</Text>
              <TextInput
                style={styles.input}
                placeholder="Goal Title"
                value={goal}
                onChangeText={setGoalInput}
              />
              <TextInput
                style={styles.input}
                placeholder="Goal Description"
                value={description}
                onChangeText={setDescription}
                multiline={true}
                numberOfLines={4}
              />
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() =>
                  setShowPicker({ type: "startDate", visible: true })
                }
              >
                <Ionicons name="calendar-outline" size={20} color="#666" />
                <Text style={styles.dateText}>
                  {" "}
                  {`Start Date: ${formatDate(startDate)}`}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() =>
                  setShowPicker({ type: "endDate", visible: true })
                }
              >
                <Ionicons name="calendar-outline" size={20} color="#666" />
                <Text style={styles.dateText}>{`End Date: ${formatDate(
                  endDate
                )}`}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() =>
                  setShowPicker({ type: "startTime", visible: true })
                }
              >
                <Ionicons name="time-outline" size={20} color="#666" />
                <Text
                  style={styles.dateText}
                >{`Start Time: ${startTime.toLocaleTimeString()}`}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() =>
                  setShowPicker({ type: "endTime", visible: true })
                }
              >
                <Ionicons name="time-outline" size={20} color="#666" />
                <Text
                  style={styles.dateText}
                >{`End Time: ${endTime.toLocaleTimeString()}`}</Text>
              </TouchableOpacity>

              {showPicker.visible && (
                <DateTimePicker
                  mode={showPicker.type.includes("Time") ? "time" : "date"}
                  value={
                    showPicker.type === "startDate"
                      ? startDate
                      : showPicker.type === "endDate"
                      ? endDate
                      : showPicker.type === "startTime"
                      ? startTime
                      : endTime
                  }
                  onChange={onPickerChange}
                />
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={isUpdateMode ? updateGoalHandler : addGoalHandler}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading
                      ? "Saving..."
                      : isUpdateMode
                      ? "Update Goal"
                      : "Add Goal"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={closeModal}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
              {/* Error message */}
              {errorMessage ? (
                <Text style={styles.errorMessage}>{errorMessage}</Text>
              ) : null}
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  contentContainer: {
    paddingHorizontal: 16,
    flex: 1,
  },
  header: {
    width: "100%",
    paddingVertical: 20,
    backgroundColor: Colors.lightBlueColor,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#e0e0e0",
    marginTop: 8,
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
  },
  addButton: {
    position: "absolute",
    bottom: 10, // Gives some space from the bottom
    alignSelf: "center", // Centers the button horizontally
    backgroundColor: Colors.blueColor,
    borderRadius: 50,
    width: 55, // Slightly larger button for better visibility
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10, // Ensures it is above other elements
    elevation: 5, // Adds a shadow for Android
    shadowColor: "#000", // Shadow properties for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  goalCardContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    borderColor: "black",
    borderWidth: 0.2,
    padding: 15,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  goalCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    borderColor: "black",
    borderWidth: 0.2,
    padding: 15,
    paddingRight: 10,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  goalItem: {
    marginBottom: 10,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: "center",
    // marginBottom: 5,
  },
  pendingText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  descriptionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  goalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  goalDescriptionText: {
    fontSize: 16,
    justifyContent: "space-between",
    color: "gray",
    marginBottom: 10,
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#666",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  goalList: {
    flex: 1,
    marginBottom: 10,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 18,
    color: "#999",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    marginHorizontal: 30,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  dateTimeButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: Colors.jetColor,
    padding: 13,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    margin: 8,
  },
  cancelButton: {
    backgroundColor: "#8f8f8f",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButtonText: {
    color: "#333",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // marginTop: 10,
  },
  rowWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5, // Space between heading and value
  },
  columnContainer: {
    alignItems: "center",
    flex: 1,
  },
  heading: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
    marginLeft: 5, // Space between icon and text
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  horizontalLineThick: {
    height: 2,
    backgroundColor: Colors.lightGrayColor,
    marginVertical: 10,
    width: "80%",
    alignSelf: "center",
  },
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10, // Ensure it overlays all other content
  },
  errorMessage: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
});

export default GoalsScreen;
