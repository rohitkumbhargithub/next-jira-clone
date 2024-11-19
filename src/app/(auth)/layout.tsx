"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import jiraLogo from "../utils/jira.svg";

interface AuthLayoutProps {
  children: React.ReactDOM;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const pathname = usePathname();
  const isSignin = pathname === "/sign-in";
  return (
    <>
      <nav className="bg-blue-100">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden"></div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex flex-shrink-0 items-center">
                <Image src={jiraLogo} alt="jira logo" className="size-20" />
              </div>
              <div className="hidden sm:ml-6 sm:block"></div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <div className="relative ml-3">
                <div>
                  <Button asChild variant="secondary">
                    <Link href={isSignin ? "/sign-up" : "/sign-in"}>
                      {pathname === "/sign-in" ? "Sign Up" : "Login"}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
        {children}
      </div>
    </>
  );
};

export default AuthLayout;
