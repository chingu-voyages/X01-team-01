"use client";

import { Button } from "./ui/button";
import { logout } from "@/lib/firebase";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "@/redux/features/authslice";
import type { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { usePentagram } from "@/redux/hooks/usePentagram";

const PENTAGRAM_STORAGE_KEY = "pentagram_form";

export default function LogoutButton() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { clearAll } = usePentagram();

  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    try {
      // 1. Firebase logout
      await logout();

      // 2. Clear auth state
      dispatch(clearUser());

      // 3. CRITICAL: clear form redux state (this fixes “ghost prompt” bug)
      clearAll();

      // 4. Clear local cache
      localStorage.removeItem(PENTAGRAM_STORAGE_KEY);

      // 5. Force navigation
      router.push("/login");

      // 6. Optional but powerful: hard session reset signal
      window.dispatchEvent(new Event("auth:logout"));
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleLogin = () => {
    router.push("/login");
  };

  if (!user) {
    return (
      <Button variant="outline" className="w-20" onClick={handleLogin}>
        Sign in
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      aria-label="AI Helper logout"
      className="w-24 h-10 text-xs font-semibold tracking-wide border-primary/20 hover:bg-primary/5 text-primary rounded-xl transition-colors"
    >
      Log out
    </Button>
  );
}
