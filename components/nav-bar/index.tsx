import React from "react";
import {
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";

const NavBar = () => {
  return (
    <div className="shadow-sm w-full sticky top-0  bg-white dark:bg-gray-900 z-[9999]">
      <div className="w-full mx-auto max-w-7xl p-3 px-5 flex items-center justify-between ">
        <div className="flex items-center flex-1 gap-9">
          <div>
            <h5 className="font-black text-lg text-primary motion-preset-typewriter-[14]">Resume Builder</h5>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <LoginLink>
            <Button variant="outline" className="">Sign In</Button>
          </LoginLink>
          <RegisterLink>
            <Button className="motion-preset-pulse motion-duration-2000">Get Started</Button>
          </RegisterLink>
        </div>
      </div>
    </div>
  );
};

export default NavBar;