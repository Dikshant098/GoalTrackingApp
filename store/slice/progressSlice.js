import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../utils/common";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  progress: [],
  loading: false,
  error: null,
};

export const updateProgress = createAsyncThunk(
  "updateProgress",
  async ({ goalId, progress, progressStatus }, { rejectWithValue }) => {
    // console.log("progress : ", progress);
    const token = await AsyncStorage.getItem("userToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.post(
        `${API_URL}/api/updateProgress/${goalId}`,
        { progress, progressStatus },
        config
      );
      // console.log("Updated Goal data in slice : ", response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        // console.log(
        //   "Error while update the progress : ",
        //   error.response.data.message
        // );
        return rejectWithValue(error.response.data.message);
      } else {
        // console.log("Error : ", error.message);
        return rejectWithValue(error.message);
      }
    }
  }
);

export const getProgress = createAsyncThunk(
  "getProgress",
  async (goalId, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem("userToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(
        `${API_URL}/api/getProgress/${goalId}`,
        config
      );
      // console.log("Goal Progress data in slice : ", response.data);
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

const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // update Goal Progress
      .addCase(updateProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.progress = action.payload;
        state.error = null;
      })
      .addCase(updateProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //   get Goal Progress
      .addCase(getProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.progress = action.payload;
        state.error = null;
      })
      .addCase(getProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = progressSlice.actions;
export default progressSlice.reducer;
