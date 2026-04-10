"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, db } from "@/lib/firebase";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/authslice";
import { doc, getDoc } from "firebase/firestore";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Sign in user
      const result = await signIn(email, password);
      const user = result.user;

      // 2. Get user profile from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDocRef);

      const userData = userSnap.exists() ? userSnap.data() : null;

      // 3. Store FULL user in Redux
      dispatch(
        setUser({
          uid: user.uid,
          email: user.email,
          name: userData?.name || "",
          photoURL: userData?.photoURL || "",
        })
      );

      router.push("/home");
    } catch (err: any) {
      setError(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>

      <form onSubmit={handleLogin} className="flex flex-col gap-3 max-w-sm">
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white p-2 rounded"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>

      <div className="mt-4 text-sm">
        <p className="mb-2">Don't have an account?</p>

        <button
          onClick={() => router.push("/register")}
          className="text-blue-600 hover:underline"
        >
          Create an account
        </button>
      </div>
    </div>
  );
}