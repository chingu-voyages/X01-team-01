"use client"

import { Button } from "./ui/button";
import Link from "next/link";

export default function LoginButton() {
  return (
    <Link href="/login" aria-label="AI Helper login">
      <Button className="w-20">Log in</Button>
    </Link>
  );
}
