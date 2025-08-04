import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { buttonVariants } from "../components/ui/button";
import { Menu } from "lucide-react";
import { ModeToggle } from "../components/mode-toggle";
import { AuthWidget } from "../components/AuthWidget";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "#about",
    label: "About Us",
  },
  {
    href: "#features",
    label: "What We Do",
  },
  {
    href: "#team",
    label: "Meet The Team",
  },
  {
    href: "#faq",
    label: "FAQ",
  },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between items-center">
          <NavigationMenuItem className="font-bold flex">
            <a
              rel="noreferrer noopener"
              href="/"
              className="ml-2 font-bold text-xl flex items-center"
            >
              <img
                src="https://i.ibb.co/0mN0h4n/icon-trans.png"
                alt="Logo"
                className="h-10 w-10 mr-2"
              />
              Enigma
            </a>
          </NavigationMenuItem>

          {/* mobile */}
          <div className="flex md:hidden items-center gap-2">
            <ModeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="px-2">
                <Menu
                  className="flex md:hidden h-5 w-5"
                  onClick={() => setIsOpen(true)}
                >
                  <span className="sr-only">Menu Icon</span>
                </Menu>
              </SheetTrigger>

              <SheetContent side={"left"} className="w-[300px]">
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">Enigma</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col justify-center items-center gap-3 mt-6">
                  {routeList.map(({ href, label }: RouteProps) => (
                    <a
                      rel="noreferrer noopener"
                      key={label}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={`w-full text-center ${buttonVariants({ variant: "ghost" })}`}
                    >
                      {label}
                    </a>
                  ))}
                  <div className="w-full border-t pt-4 mt-4">
                    <div className="flex flex-col gap-3 items-center">
                      <AuthWidget />
                      <a
                        rel="noreferrer noopener"
                        href="https://github.com/MU-Enigma/"
                        target="_blank"
                        className={`w-full border ${buttonVariants({
                          variant: "secondary",
                        })}`}
                      >
                        <GitHubLogoIcon className="mr-2 w-5 h-5" />
                        Github
                      </a>
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* desktop */}
          <nav className="hidden md:flex gap-2">
            {routeList.map((route: RouteProps, i) => (
              <a
                rel="noreferrer noopener"
                href={route.href}
                key={i}
                className={`text-[17px] ${buttonVariants({
                  variant: "ghost",
                })}`}
              >
                {route.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex gap-3 items-center">
            <a
              rel="noreferrer noopener"
              href="https://github.com/MU-Enigma"
              target="_blank"
              className={`border ${buttonVariants({ variant: "secondary" })}`}
            >
              <GitHubLogoIcon className="mr-2 w-5 h-5" />
              Github
            </a>
            <div className="flex items-center">
              <AuthWidget />
            </div>
            <ModeToggle />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
