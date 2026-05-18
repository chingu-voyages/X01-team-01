"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  signInWithGoogle,
  signInWithGithub,
  db
} from "@/lib/firebase";

import { doc, setDoc, getDoc } from "firebase/firestore";

import { useAppDispatch } from "@/redux/hooks";
import type { User } from "@/redux/features/authslice";
import { setUser } from "@/redux/features/authslice";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [loadingProvider, setLoadingProvider] = useState<null | "google" | "github">(null);
  const [error, setError] = useState("");

  const handleOAuthSignIn = async (
    providerFn: () => Promise<any>,
    providerName: "google" | "github"
  ) => {
    setError("");
    setLoadingProvider(providerName);

    try {
      const result = await providerFn();
      const firebaseUser = result.user;

      const providerData = firebaseUser.providerData.find(
        (p: any) =>
          p.providerId ===
          (providerName === "google" ? "google.com" : "github.com")
      );

      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      let userData: User;

      if (!userSnap.exists()) {
        userData = {
          id: firebaseUser.uid,
          oauth_provider: providerName,
          oauth_provider_id: providerData?.uid || firebaseUser.uid,
          display_name: firebaseUser.displayName || "",
          avatar_url: firebaseUser.photoURL || null,
          email: firebaseUser.email || "",
          created_at: new Date().toISOString(),
          last_login_at: new Date().toISOString(),
        };

        await setDoc(userRef, userData);
      } else {
        const existing = userSnap.data() as User;

        userData = {
          ...existing,
          last_login_at: new Date().toISOString(),
        };

        await setDoc(userRef, userData);
      }

      dispatch(setUser(userData));
      router.push("/home");

    } catch (err: any) {
      setError(err.message || `${providerName} Sign-in was not completed. Please try again.`);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-semibold mb-4">
        Create your account
      </h1>

      {/* Google */}
      <button
        onClick={() => handleOAuthSignIn(signInWithGoogle, "google")}
        disabled={loadingProvider !== null}
        className={`bg-black text-white p-3 rounded w-full mb-3 flex items-center justify-center transition
          ${loadingProvider !== null ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}
        `}
      >
        {loadingProvider === "google" ? (
          <span className="animate-spin">⏳</span>
        ) : (
          "Sign in with Google"
        )}
      </button>

      {/* GitHub */}
      <button
        onClick={() => handleOAuthSignIn(signInWithGithub, "github")}
        disabled={loadingProvider !== null}
        className={`bg-gray-900 text-white p-3 rounded w-full flex items-center justify-center transition
          ${loadingProvider !== null ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}
        `}
      >
        {loadingProvider === "github" ? (
          <span className="animate-spin">⏳</span>
        ) : (
          "Sign in with GitHub"
        )}
      </button>

      {/* Error */}
      {error && (
        <p className="text-red-500 text-sm mt-3">
          {error}
        </p>
      )}
    </div>
  );
}