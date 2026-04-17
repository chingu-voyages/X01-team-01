import { Button } from "./ui/button";
import Link from "next/link";

export default function LoginButton() {
  return (
    <Link href="/login" aria-label="AI Helper login">
      <Button>Log in</Button>
    </Link>
  );
}
