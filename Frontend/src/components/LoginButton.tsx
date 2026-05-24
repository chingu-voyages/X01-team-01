"use client";

import { Button } from "./ui/button";
import Link from "next/link";

export default function LoginButton() {
  return (
    <Link href="/login" aria-label="AI Helper login">
      <Button className="w-24 h-10 text-xs font-semibold tracking-wide rounded-xl shadow-xs transition-opacity hover:opacity-95">
        Sign in
      </Button>
    </Link>
  );
}
