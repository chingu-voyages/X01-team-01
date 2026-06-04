"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { setGuestMode } from "@/redux/features/authslice";
import { useAppDispatch } from "@/redux/hooks";

import { signInWithGoogle, signInWithGithub, db } from "@/lib/firebase";

import { doc, setDoc, getDoc } from "firebase/firestore";

import type { User } from "@/redux/features/authslice";
import { setUser } from "@/redux/features/authslice";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const user = useSelector((state: RootState) => state.auth.user);

  const [loadingProvider, setLoadingProvider] = useState<
    null | "google" | "github"
  >(null);

  const [error, setError] = useState("");

  const handleOAuthSignIn = async (
    providerFn: () => Promise<any>,
    providerName: "google" | "github",
  ) => {
    setError("");
    setLoadingProvider(providerName);

    try {
      const result = await providerFn();
      const firebaseUser = result.user;

      const providerData = firebaseUser.providerData.find(
        (p: any) =>
          p.providerId ===
          (providerName === "google" ? "google.com" : "github.com"),
      );

      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      let userData: User;

      if (!userSnap.exists()) {
        userData = {
          id: firebaseUser.uid,
          oauth_provider: providerName,
          oauth_provider_id: providerData?.uid || firebaseUser.uid,
          display_name:
            providerName === "github"
              ? providerData?.displayName ||
                providerData?.screenName ||
                firebaseUser.reloadUserInfo?.screenName ||
                firebaseUser.displayName ||
                firebaseUser.email?.split("@")[0] ||
                ""
              : firebaseUser.displayName || "",
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
      setError(
        err.message ||
          `${providerName} Sign-in was not completed. Please try again.`,
      );
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="max-h-[90vh] md:min-h-screen w-full grid place-items-center bg-slate-50">
      <div className="w-[90%] sm:max-w-md p-6 sm:p-8 bg-white rounded-xl shadow-md">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <h1 className="tracking-tight text-3xl sm:text-5xl font-black text-gray-900 leading-none">
            AI{" "}
            <span className="text-primary bg-linear-to-r from-primary to-primary/70 bg-clip-text">
              Helper
            </span>
          </h1>
          <h3 className="tracking-tight font-normal text-base sm:text-xl text-gray-500 max-w-xs mx-auto">
            Build better prompts.
          </h3>
        </div>

        {/* Auth Buttons */}
        <div className="flex flex-col gap-3 w-full">
          <p className="tracking-tight text-center text-sm sm:text-base text-gray-500">
            Sign in with:
          </p>

          {/* GitHub */}
          <Button
            variant="default"
            className="w-full h-11 text-sm font-semibold tracking-wide rounded-xl shadow-xs transition-colors"
            onClick={() => handleOAuthSignIn(signInWithGithub, "github")}
            disabled={loadingProvider !== null}
          >
            {loadingProvider === "github"
              ? "Loading..."
              : "Sign in with GitHub"}
          </Button>

          {/* Divider */}
          <div className="flex items-center w-full my-2">
            <div className="grow border-t border-slate-300" />
            <span className="mx-4 text-sm font-medium text-gray-500 tracking-wider">
              or
            </span>
            <div className="grow border-t border-slate-300" />
          </div>

          {/* Google */}
          <Button
            variant="outline"
            className="w-full h-11 text-sm font-semibold tracking-wide rounded-xl shadow-xs transition-colors"
            onClick={() => handleOAuthSignIn(signInWithGoogle, "google")}
            disabled={loadingProvider !== null}
          >
            {loadingProvider === "google"
              ? "Loading..."
              : "Sign in with Google"}
          </Button>
        </div>

        {/* Guest Mode */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => {
              dispatch(setGuestMode());
              router.push("/home");
            }}
            className="text-sm text-slate-600 hover:text-slate-900 underline underline-offset-4 font-medium transition-colors block mx-auto"
          >
            Continue without signing in
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-xs font-medium tracking-tight mt-3 text-center animate-in fade-in-50 duration-200">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
