"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  return (
    <div className="min-h-screen">
    </div>
  );
}