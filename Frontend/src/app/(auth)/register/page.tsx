"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { signInWithGoogle, db } from "@/lib/firebase";

import { doc, setDoc, getDoc } from "firebase/firestore";

import { useAppDispatch } from "@/redux/hooks";
import type { User } from "@/redux/features/authslice";
import { setUser } from "@/redux/features/authslice";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      // 1. Google Auth
      const result = await signInWithGoogle();
      const firebaseUser = result.user;

      const providerData = firebaseUser.providerData.find(
        (p) => p.providerId === "google.com"
      );

      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      let userData: User;

      if (!userSnap.exists()) {
        // NEW USER → create profile
        userData = {
          id: firebaseUser.uid,
          oauth_provider: "google",
          oauth_provider_id: providerData?.uid || firebaseUser.uid,
          display_name: firebaseUser.displayName || "",
          avatar_url: firebaseUser.photoURL || null,
          email: firebaseUser.email || "",
          created_at: new Date().toISOString(),
          last_login_at: new Date().toISOString(),
        };

        await setDoc(userRef, userData);
      } else {
        // EXISTING USER → update last login
        const existing = userSnap.data() as User;

        userData = {
          ...existing,
          last_login_at: new Date().toISOString(),
        };

        await setDoc(userRef, userData);
      }

      // 3. Redux
      dispatch(setUser(userData));

      // 4. Redirect
      router.push("/home");

    } catch (err: any) {
      setError(err.message || "Google sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-semibold mb-4">
        Continue with Google
      </h1>

      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="bg-black text-white p-3 rounded"
      >
        {loading ? "Signing in..." : "Continue with Google"}
      </button>

      {error && (
        <p className="text-red-500 text-sm mt-3">
          {error}
        </p>
      )}
    </div>
  );
}