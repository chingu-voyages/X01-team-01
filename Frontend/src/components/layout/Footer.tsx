import Image from "next/image";
import ChinguLogo from "@/media/chingu-logo.png";
import { LinkedinIcon } from "../icons/il-linkedin";
import { GithubIcon } from "../icons/lucide-github";

const dateFormatter = Intl.DateTimeFormat("en-US", { dateStyle: "long" });

export default function Footer() {
  const today: Date = new Date();
  const formattedDate: string = dateFormatter.format(today);

  return (
    <footer className="bg-background relative overflow-hidden flex justify-center py-6 px-4 w-full text-gray-500">
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/60 to-transparent" />
      <div className="container max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-[10rem_auto_10rem] gap-6 md:gap-4 items-center text-center md:text-left">
          {/* Left: Logo */}
          <div className="flex justify-center md:justify-start">
            <Image
              src={ChinguLogo}
              alt="Chingu logo"
              className="w-8 md:w-10 opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>

          {/* Center: Team Credits in Two Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 justify-center max-w-xl mx-auto w-full text-xs sm:text-sm">
            {/* Column 1: Leadership */}
            <div className="space-y-2">
              <div>
                <span className="font-bold uppercase tracking-wider text-[10px] text-gray-400 block mb-1">
                  Product Owner
                </span>
                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-700 font-medium">
                  <span>Chinedu Olekah</span>
                  <a
                    href="https://www.linkedin.com/in/chinedu-olekah/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                  <a
                    href="https://github.com/kenako1"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="pt-1">
                <span className="font-bold uppercase tracking-wider text-[10px] text-gray-400 block mb-1">
                  Scrum Master
                </span>
                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-700 font-medium">
                  <span>Yangchen Dema</span>
                  <a
                    href="https://www.linkedin.com/in/yangchendema/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                  <a
                    href="https://github.com/dema66"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Column 2: Developers */}
            <div>
              <span className="font-bold uppercase tracking-wider text-[10px] text-gray-400 block mb-1">
                Developers
              </span>
              <div className="space-y-1.5 text-gray-700 font-medium">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span>Omar Ramos-Correa</span>
                  <a
                    href="https://www.linkedin.com/in/omar-ramos-correa-7621253b2/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                  <a
                    href="https://github.com/oramos-correa"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span>Lilla Tóth</span>
                  <a
                    href="https://www.linkedin.com/in/lillatoth216/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                  <a
                    href="https://github.com/Lilla-ctrl"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span>Ivan Rebolledo</span>
                  <a
                    href="https://www.linkedin.com/in/ivan-rebolledo-012b17244/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                  <a
                    href="https://github.com/ivannissimrch"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Current Date */}
          <div className="text-center md:text-right text-xs font-mono text-gray-400 tracking-tight">
            {formattedDate}
          </div>
        </div>
      </div>
    </footer>
  );
}
