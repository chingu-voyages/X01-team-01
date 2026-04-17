import Image from "next/image";
import ChinguLogo from "@/media/chingu-logo.png"

const dateFormatter = Intl.DateTimeFormat("en-US", {dateStyle: "long"})

export default function Footer() {
  const today: Date = new Date()
  const formattedDate: string = dateFormatter.format(today)

  return (
    <footer className="bg-background relative overflow-hidden flex justify-center border-t border-border p-4 w-full">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="">
            <Image src={ChinguLogo} alt="Chingu logo" className="w-8 md:w-10"/>
          </p>
          <ul className="flex flex-col items-center gap-2 py-2 text-sm
                        md:flex-row md:justify-between md:gap-4 md:py-0 md:text-base">
            <li className="md:border-r border-r-black/30 md:pr-4">
              <a
                href="https://www.linkedin.com/in/lillatoth216/"
                target="_blank"
                rel="noreferrer noopener"
              >
                Lilla Tóth
              </a>
            </li>
            <li className="md:border-r border-r-black/30 md:pr-4">
              <a
                href="https://www.linkedin.com/in/ivan-rebolledo-012b17244/"
                target="_blank"
                rel="noreferrer noopener"
              >
                Ivan Rebolledo
              </a>
            </li>
            <li className="md:border-r border-r-black/30 md:pr-4">
              <a
                href="https://www.linkedin.com/in/omar-ramos-correa-7621253b2/"
                target="_blank"
                rel="noreferrer noopener"
              >
                Omar Ramos-Correa
              </a>
            </li>
            <li className="md:border-r border-r-black/30 md:pr-4">
              <a
                href="https://www.linkedin.com/in/yangchendema/"
                target="_blank"
                rel="noreferrer noopener"
              >
                Yangchen Dema
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/chinedu-olekah"
                target="_blank"
                rel="noreferrer noopener"
              >
                Chinedu Olekah
              </a>
            </li>
          </ul>
          <p className="text-sm md:text-base">{formattedDate}</p>
        </div>
      </div>
    </footer>
  );
}
