"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signUp, db, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/authslice";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!file) {
        throw new Error("Please upload a profile picture");
      }

      // 1. Create auth user
      const userCredential = await signUp(email, password);
      const user = userCredential.user;

      // 2. Upload profile image
      const imageRef = ref(storage, `profilePictures/${user.uid}`);
      await uploadBytes(imageRef, file);

      const photoURL = await getDownloadURL(imageRef);

      // 3. Save to Firestore
      const userData = {
        uid: user.uid,
        name,
        email,
        photoURL,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", user.uid), userData);

      // 4. Save to Redux (IMPORTANT FIX)
      dispatch(setUser(userData));

      // 5. Redirect
      router.push("/home");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-semibold mb-4">Register</h1>

      <form onSubmit={handleRegister} className="flex flex-col gap-3 max-w-sm">
        <input
          type="text"
          placeholder="Full Name"
          className="border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

        <input
          type="file"
          accept="image/*"
          className="border p-2 rounded"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white p-2 rounded"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
}