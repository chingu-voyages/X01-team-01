"use client";
import Link from "next/link";
import Image from "next/image";
import ChinguLogo from "@/media/chingu-logo.png";
import LoginButton from "../LoginButton";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import LogoutButton from "../LogoutButton";

const ITEMS = [
  { label: "Home", href: "/home" },
  { label: "History", href: "/history" },
];

export default function Navbar() {
  const pathname = usePathname();

  const isLoggedIn: boolean = true;

  return (
    <header className=" z-50 sticky top-0">
      <div className="bg-background/85 backdrop-blur w-full border-b border-border ">
        <div className="relative container flex h-20 items-center justify-between gap-2 sm:gap-3 ">
          <Link
            href="/home"
            className="flex shrink-0 items-center gap-2"
            aria-label="AI Helper home"
          >
            <Image
              src={ChinguLogo}
              alt="Chingu logo"
              className="w-10 md:w-14 flex shrink-0 items-center gap-2"
            />
          </Link>

          <nav className="flex flex-1 items-center justify-center gap-8">
            {ITEMS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "text-base transition-colors",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div>{isLoggedIn ? <LogoutButton /> : <LoginButton />}</div>
        </div>
      </div>
    </header>
  );
}
