import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../utils/common";

const initialState = {
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null,
  success: false,
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/register`, userData);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response); // Inspect the error response
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/login`, userData);
      // Store the token in AsyncStorage
      await AsyncStorage.setItem("userToken", response.data.token);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response); // Inspect the error response
      return rejectWithValue(error.response.data.message);
    }
  }
);

// export const forgotPassword = createAsyncThunk(
//   "auth/forgotPassword",
//   async ({ email }, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(`${API_URL}/api/forgot-password`, {
//         email,
//       });
//       return response.data;
//     } catch (error) {
//       console.log(error.response);
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

export const sendPasswordResetEmail = createAsyncThunk(
  "auth/sendPasswordResetEmail",
  async (emailData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/forgot-password`, emailData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        return rejectWithValue("No token found. Please log in again.");
      }
      const response = await axios.post(
        `${API_URL}/api/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        await AsyncStorage.removeItem("userToken");
        console.log("Logout User : ", response.data);
        return response.data;
      } else {
        return rejectWithValue("Logout failed. Please try again. inside the slice 1");
      }
    } catch (error) {
      console.log("error : ", error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload.user;
        state.isLoggedIn = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isLoggedIn = false;
      })
      // Forget Password
      // .addCase(forgotPassword.pending, (state) => {
      //   state.loading = true;
      // })
      // .addCase(forgotPassword.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.success = true;
      // })
      // .addCase(forgotPassword.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload;
      // })

      .addCase(sendPasswordResetEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendPasswordResetEmail.fulfilled, (state, action) => {sto
        state.loading = false;
        state.success = true;
      })
      .addCase(sendPasswordResetEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout User
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.user = null;
        state.isLoggedIn = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isLoggedIn = false;
      });
  },
});

export const { clearError, clearSuccess } = authSlice.actions;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export default authSlice.reducer;
