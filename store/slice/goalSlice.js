import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../utils/common";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  goals: [],
  loading: false,
  error: null,
};

export const getAllGoals = createAsyncThunk(
  "getAllGoals",
  async (_, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem("userToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(`${API_URL}/api/getAllGoals`, config);
      // console.log("All Goals data in slice : ", response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        // console.log("Error : ", error.response.data.message);
        return rejectWithValue(error.response.data.message);
      } else {
        // console.log("Error : ", error.message);
        return rejectWithValue(error.message);
      }
    }
  }
);

export const setGoal = createAsyncThunk(
  "setGoal",
  async (goalData, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem("userToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.post(
        `${API_URL}/api/setGoal`,
        goalData,
        config
      );
      // console.log("Goal data in slice : ", response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        // console.log("Error : ", error.response.data.message);
        return rejectWithValue(error.response.data.message);
      } else {
        // console.log("Error : ", error.message);
        return rejectWithValue(error.message);
      }
    }
  }
);

export const updateGoal = createAsyncThunk(
  "updateGoal",
  async ({ goalId, goalData }, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem("userToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.post(
        `${API_URL}/api/updateGoal/${goalId}`,
        goalData,
        config
      );
      // console.log("Updated Goal data in slice : ", response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        // console.log("Error while update the goal : ", error.response.data.message);
        return rejectWithValue(error.response.data.message);
      } else {
        // console.log("Error : ", error.message);
        return rejectWithValue(error.message);
      }
    }
  }
);

export const deleteGoal = createAsyncThunk(
  "deleteGoal",
  async (goalId, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem("userToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const response = await axios.delete(
        `${API_URL}/api/deleteGoal/${goalId}`,
        config
      );
      // console.log('res: ', response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        // console.log("Error : ", error.response.data.message);
        return rejectWithValue(error.response.data.message);
      } else {
        // console.log("Error : ", error.message);
        return rejectWithValue(error.message);
      }
    }
  }
);

const goalSlice = createSlice({
  name: "goal",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // get All Goals
      .addCase(getAllGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.goals = action.payload;
        state.error = null;
      })
      .addCase(getAllGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Crate a New Goal
      .addCase(setGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setGoal.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(setGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update the Goal
      .addCase(updateGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGoal.fulfilled, (state) => {
        state.loading = false;mmon
        state.error = null;
      })
      .addCase(updateGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete a Goal
      .addCase(deleteGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGoal.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {clearError} = goalSlice.actions;
export default goalSlice.reducer;
