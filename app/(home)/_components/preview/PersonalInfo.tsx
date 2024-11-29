"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { INITIAL_THEME_COLOR } from "@/lib/helper";
import { ResumeDataType } from "@/types/resume.type";
import { Github, Home, Linkedin, Mail, Phone } from "lucide-react";
import { FaMedium } from "react-icons/fa";
import React, { FC } from "react";

interface Propstype {
  resumeInfo: ResumeDataType | undefined;
  isLoading: boolean;
}

const PersonalInfo: FC<Propstype> = ({ resumeInfo, isLoading }) => {
  const handleMailClick = () => {
    const email = resumeInfo?.personalInfo?.email;
    if (email) {
      window.open(`mailto:${email}`, "_blank");
    }
  };

  const handleMediumClick = () => {
    const medium = resumeInfo?.personalInfo?.medium;
    if (medium) {
      const fullUrl = `https://medium.com/@${medium}`;
      window.open(fullUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleWebsiteClick = () => {
    const website = resumeInfo?.personalInfo?.website;
    if (website) {
      const fullUrl = `https://${website}`;
      window.open(fullUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleLinkedlnClick = () => {
    const linkedInProfile = resumeInfo?.personalInfo?.linkedin;
    if (linkedInProfile) {
      const fullUrl = `https://www.linkedin.com/in/${linkedInProfile}`;
      window.open(fullUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleGithubClick = () => {
    const githubProfile = resumeInfo?.personalInfo?.github;
    if (githubProfile) {
      const fullUrl = `https://github.com/${githubProfile}`;
      window.open(fullUrl, "_blank", "noopener,noreferrer");
    }
  };

  const themeColor = resumeInfo?.themeColor || INITIAL_THEME_COLOR;

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="w-full min-h-14 sm:px-0">
      <h2
        className="font-bold text-lg sm:text-xl text-center"
        style={{
          color: themeColor,
        }}
      >
        {resumeInfo?.personalInfo?.firstName || "First Name"}{" "}
        {resumeInfo?.personalInfo?.lastName || "Last Name"}
      </h2>
      <h5 className="text-center text-xs sm:text-sm font-medium">
        {resumeInfo?.personalInfo?.jobTitle || "Job Title"}
      </h5>
      <p className="text-center font-normal text-[11px] sm:text-[13px]">
        {resumeInfo?.personalInfo?.address || "Address"}
      </p>
      <div className="flex justify-between items-center pt-3">
        <h5 className="flex font-normal text-[9px] sm:text-[12px] items-center">
          <Phone size={10}  />
          {resumeInfo?.personalInfo?.phone || "Phone Number"}
        </h5>
        <h5 className="flex font-normal text-[9px] sm:text-[13px] items-center">
          <button onClick={handleMailClick} className="flex items-center">
            <Mail size={10}  />
            {resumeInfo?.personalInfo?.email || "Email Address"}
          </button>
        </h5>
        {resumeInfo?.personalInfo?.linkedin && (
          <h5 className="font-normal text-[9px] sm:text-[13px]">
            <button onClick={handleLinkedlnClick} className="flex items-center">
              <Linkedin size={10} />
              {resumeInfo?.personalInfo?.linkedin || "LinkedIn"}
            </button>
          </h5>
        )}
        {resumeInfo?.personalInfo?.github && (
          <h5 className="font-normal text-[9px] sm:text-[13px]">
            <button onClick={handleGithubClick} className="flex items-center">
              <Github size={10} />
              {resumeInfo?.personalInfo?.github || "Github"}
            </button>
          </h5>
        )}
        {resumeInfo?.personalInfo?.medium && (
          <h5 className="font-normal text-[9px] sm:text-[13px]">
            <button onClick={handleMediumClick} className="flex items-center">
              <FaMedium size={10} />
              {resumeInfo?.personalInfo?.medium || "Medium"}
            </button>
          </h5>
        )}
        {resumeInfo?.personalInfo?.website && (
          <h5 className="font-normal text-[9px] sm:text-[13px]">
            <button onClick={handleWebsiteClick} className="flex items-center">
              <Home size={10} />
              {resumeInfo?.personalInfo?.website || "Website"}
            </button>
          </h5>
        )}
      </div>
      <hr
        className="border-[1.5px] mb-1"
        style={{
          borderColor: themeColor,
        }}
      />
    </div>
  );
};

const SkeletonLoader = () => {
  return (
    <div className="w-full min-h-14 px-4 sm:px-0">
      <Skeleton className="h-6 w-1/2 mx-auto mb-2" />
      <Skeleton className="h-4 w-1/4 mx-auto mb-2" />
      <Skeleton className="h-4 w-1/3 mx-auto mb-2" />
      <div className="flex flex-col sm:flex-row justify-between pt-3 space-y-2 sm:space-y-0">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      <Skeleton className="h-[1.5px] w-full my-2" />
    </div>
  );
};

export default PersonalInfo;
