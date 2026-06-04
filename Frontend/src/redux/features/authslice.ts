import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;

  oauth_provider: "google" | "github";
  oauth_provider_id: string;

  display_name: string;
  avatar_url: string | null;

  email: string;

  created_at: string;
  last_login_at: string;

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
      state.user = null;
      state.status = "guest";
    },
  },
});

export const { setUser, clearUser, setGuestMode } = authSlice.actions;
export default authSlice.reducer;