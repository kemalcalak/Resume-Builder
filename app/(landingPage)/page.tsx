"use client";
import { Button } from "@/components/ui/button";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function Home() {
  const { theme, systemTheme } = useTheme();

  // Determine the effective theme by checking both manual and system preferences
  const effectiveTheme = theme === "system" ? systemTheme : theme;

  // Select image based on the effective theme
  const imageSrc =
    effectiveTheme === "dark"
      ? "/images/board-dark-img.png"
      : "/images/board-img.png";

  return (
    <div className="w-full">
      <div className="hero-section w-full min-h-screen">
        <div className="w-full flex flex-col items-center justify-center py-10 max-w-4xl mx-auto">
          <div className="flex flex-col mt-5 items-center text-center">
            <h1 className="text-6xl font-black ">
              <p>Get dream jobs with our</p>
              <p>
                <span className="bg-gradient-to-r from-primary via-rose-300 to-primary bg-clip-text text-transparent animate-sparkle">
                  AI Powered
                </span>{" "}
                resume builder
              </p>
            </h1>
            <p className="block text-xl mt-3 font-medium text-black/70 ">
              Create a resume with our free ai builder and share it with a
              shareable link.
            </p>
            <br />
            <div className="flex items-center gap-2">
              <Button
                className="h-12 text-base font-medium min-w-32 motion-scale-in-[0.5] motion-translate-x-in-[-120%] motion-translate-y-in-[-60%] motion-opacity-in-[33%] motion-rotate-in-[-1080deg] motion-blur-in-[10px] motion-duration-[1.13s] motion-delay-[0.56s]/scale motion-duration-[0.56s]/opacity motion-duration-[1.80s]/rotate motion-duration-[0.23s]/blur motion-delay-[0.90s]/blur motion-ease-spring-bouncier"
                asChild
              >
                <RegisterLink>Get Started</RegisterLink>
              </Button>
            </div>
          </div>
        </div>
        <div className="w-full relative max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-full h-[400px] bg-gradient-to-r from-primary to-blue-500 rounded-full blur-3xl opacity-40 z-0" />
          <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-xl shadow-lg bg-background">
            <div className="relative w-full h-full rounded-md">
              <Image
                src={imageSrc}
                alt="App dashboard"
                fill
                className="object-contain w-full h-full rounded-md motion-scale-in-[0.5] motion-translate-x-in-[-84%] motion-translate-y-in-[63%] motion-opacity-in-[0%] motion-rotate-in-[-10deg] motion-blur-in-[5px] motion-duration-[0.88s] motion-duration-[1.31s]/scale motion-duration-[1.31s]/translate motion-duration-[1.57s]/rotate"
              />
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
      <br />
    </div>
  );
}
