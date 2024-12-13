import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../utils/common";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  user: null,
  loading: false,
  error: null,
};

export const getUser = createAsyncThunk(
  "user/getUser",
  async (_, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem("userToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(`${API_URL}/api/user`, config);
      //   console.log("User data in slice : ", response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const setUser = createAsyncThunk(
  "user/setUser",
  async (formData, { rejectWithValue }) => {
    // console.log("Form data inside slice : ", formData);
    const token = await AsyncStorage.getItem("userToken");
    // console.log("Token : ", token);
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const response = await axios.post(
        `${API_URL}/api/setUser`,
        formData,
        config
      );
      // console.log("Created User Detail : ", response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        // console.log("Error inside slice : ", error.response.data.message);
        return rejectWithValue(error.response.data.message);
      } else {
        // console.log("Error inside slice 2 : ", error.message);
        return rejectWithValue(error.message);
      }
    }
  }
);

export const updateUser = createAsyncThunk(
  "updateUser",
  async (formData, { rejectWithValue }) => {
    // console.log("Form data inside slice : ", formData);
    const token = await AsyncStorage.getItem("userToken");
    // console.log("Token : ", token);
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const response = await axios.post(
        `${API_URL}/api/updateUser`,
        formData,
        config
      );
      // console.log("Updated User Detail : ", response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        // console.log("Error inside slice : ", error.response.data.message);
        return rejectWithValue(error.response.data.message);
      } else {
        // console.log("Error inside slice 2 : ", error.message);
        return rejectWithValue(error.message);
      }
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // get user detail
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Set User Detail
      .addCase(setUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(setUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update User Detail
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const clearError = userSlice.actions;
export default userSlice.reducer;
