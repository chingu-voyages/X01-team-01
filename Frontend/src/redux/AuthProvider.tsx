"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/lib/firebase";

import { useDispatch } from "react-redux";

import {
  setUser,
  clearUser,
} from "@/redux/features/authslice";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const dispatch = useDispatch();

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (user) => {

      if (user) {

        dispatch(
          setUser({
            id: user.uid,

            oauth_provider:
              user.providerData[0]?.providerId === "google.com"
                ? "google"
                : "github",

            oauth_provider_id:
              user.providerData[0]?.uid || "",

            display_name:
              user.displayName || "",

            avatar_url:
              user.photoURL || null,

            email:
              user.email || "",

            created_at: user.metadata.creationTime
              ? new Date(user.metadata.creationTime).toISOString()
              : "",

            last_login_at: user.metadata.lastSignInTime
              ? new Date(user.metadata.lastSignInTime).toISOString()
              : "",
          })
        );

      } else {

        dispatch(clearUser());

      }

    });

    return () => unsubscribe();

  }, [dispatch]);

  return <>{children}</>;
}