"use client";

import { Button } from "./ui/button";
import { logout } from "@/lib/firebase";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "@/redux/features/authslice";
import { useRouter } from "next/navigation";
import type { RootState } from "@/redux/store";

export default function LogoutButton() {
  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(clearUser());
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = () => {
    router.push("/login");
  };

  if (!user) {
    return (
      <Button
        variant="outline"
        className="w-20"
        onClick={handleLogin}
      >
        Sign in
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      className="w-20"
      onClick={handleLogout}
    >
      Log out
    </Button>
  );
}