"use client";

import { Button } from "./ui/button";

export default function LogoutButton() {
  return (
    <Button
      variant={"outline"}
      aria-label="AI Helper logout"
      className="w-24 h-10 text-xs font-semibold tracking-wide border-primary/20 hover:bg-primary/5 text-primary rounded-xl transition-colors"
    >
      Log out
    </Button>
  );
}
