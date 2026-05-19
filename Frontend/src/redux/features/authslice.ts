import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  uid: string;
  email: string | null;
  name?: string;
  photoURL?: string;
}

interface AuthState {
  user: User | null;
  status: "authenticated" | "unauthenticated" | "guest";
}

const initialState: AuthState = {
  user: null,
  status: "unauthenticated",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.status = action.payload ? "authenticated" : "unauthenticated";
    },
    clearUser: (state) => {
      state.user = null;
      state.status = "unauthenticated";
    },
    setGuestMode: (state) => {
      ((state.user = null), (state.status = "guest"));
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
