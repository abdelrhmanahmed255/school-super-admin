import { createSlice } from "@reduxjs/toolkit";

import { UserState } from "./type";
import {
  changeUserPassword,
  editUser,
  fetchConnections,
  fetchSubscription,
  forgetPassword,
  loginUser,
  logoutUser,
  signupUser,
} from "./thunk";

/** Normalize error payload to a plain string so Redux state never holds non-serializable values (e.g. Error/event). */
function getErrorMessage(payload: unknown): string {
  if (payload == null) return "";
  if (typeof payload === "string") return payload;
  if (
    typeof payload === "object" &&
    payload !== null &&
    "message" in payload &&
    typeof (payload as { message: unknown }).message === "string"
  ) {
    return (payload as { message: string }).message;
  }
  try {
    return JSON.stringify(payload);
  } catch {
    return String(payload);
  }
}

const initialState: UserState = {
  emailDelegation: {},
  user: null,
  token: "",
  loading: false,
  sallaConnected: false,
  merchantID: "",
  storeName: "",
  storeLink: "",
  createdAt: "",
  storeImage: "",
  newStoreImage: "",

  isLoggedIn: false,
  error: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updatePersonal(state, action) {
      Object.assign(state.user, action.payload); // تحديث فقط القيم المرسلة في `payload`
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setEmailDelegation(state, action) {
      state.emailDelegation = action.payload;
    },
    setUser: (state, action) => {
      // state.user = action.payload;
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      localStorage.clear();
      state.user = null;
      state.isLoggedIn = false;
      state.token = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        localStorage.setItem("token", action.payload.access_token);
        state.isLoggedIn = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = initialState.user;
        state.error = getErrorMessage(action.payload);
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = initialState.user;
        state.error = getErrorMessage(action.payload);
        state.isLoggedIn = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.user = initialState.user;
        state.error = getErrorMessage(action.payload);
      })
      .addCase(signupUser.pending, (state) => {
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.error = getErrorMessage(action.payload);
      })
      .addCase(forgetPassword.pending, (state) => {
        state.error = null;
      })
      .addCase(forgetPassword.fulfilled, (state, action) => {
        state.error = null;
      })
      .addCase(forgetPassword.rejected, (state, action) => {
        state.error = getErrorMessage(action.payload);
      })
      .addCase(fetchSubscription.fulfilled, (state, action) => {
        state.user.subscription = action.payload.subscription;
      })
      .addCase(editUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          ...state.user,
          profileImage:
            action.payload?.data?.profileImage ?? state.user?.profileImage,
          name: action.payload?.data?.name ?? state.user?.name,
          mobile: action.payload?.data?.mobile ?? state.user?.mobile,
          lastName: action.payload?.data?.lastName ?? state.user?.lastName,
        };
        state.error = null;
      })
      .addCase(editUser.rejected, (state, action) => {
        state.loading = false;
        state.error = getErrorMessage(action.payload);
      })
      .addCase(changeUserPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeUserPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(changeUserPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = getErrorMessage(action.payload);
      });
  },
});

export const { setUser, logout, setIsLoggedIn, updatePersonal } =
  userSlice.actions;
export default userSlice.reducer;
