"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { INITIAL_THEME_COLOR } from "@/lib/helper";
import { ResumeDataType } from "@/types/resume.type";
import { Github, Home, Linkedin, Mail, Phone } from "lucide-react";
import { FaMediumM } from "react-icons/fa";
import React, { FC } from "react";

interface Propstype {
  resumeInfo: ResumeDataType | undefined;
  isLoading: boolean;
}

const PersonalInfo: FC<Propstype> = ({ resumeInfo, isLoading }) => {
  const handleMailClick = () => {
    // bu fonksiyon eğer resumeInfo.personalInfo.email varsa mailto: ile mail atma işlemi yapar.
    const email = resumeInfo?.personalInfo?.email;
    if (email) {
      window.open(`mailto:${email}`, "_blank");
    }
  };

  const handleMediumClick = () => {
    const medium = resumeInfo?.personalInfo?.medium;
    if (medium) {
      const fullUrl = `https://medium.com/@${medium}`;
      return fullUrl;
    }
  };

  const handleWebsiteClick = () => {
    const website = resumeInfo?.personalInfo?.website;
    if (website) {
      const fullUrl = `https://${website}`;
      return fullUrl;
    }
  };

  const handleLinkedlnClick = () => {
    const linkedInProfile = resumeInfo?.personalInfo?.linkedin;
    if (linkedInProfile) {
      const fullUrl = `https://www.linkedin.com/in/${linkedInProfile}`;
      return fullUrl;
    }
  };

  const handleGithubClick = () => {
    const githubProfile = resumeInfo?.personalInfo?.github;
    if (githubProfile) {
      const fullUrl = `https://github.com/${githubProfile}`;
      return fullUrl;
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
              <a href={handleLinkedlnClick()} className="flex items-center" target="_blank" rel="noreferrer">
              <Linkedin size={10} />
              {resumeInfo?.personalInfo?.linkedin || "LinkedIn"}
              </a>
          </h5>
        )}
        {resumeInfo?.personalInfo?.github && (
          <h5 className="font-normal text-[9px] sm:text-[13px]">
              <a href={handleGithubClick()} className="flex items-center" target="_blank" rel="noreferrer">
              <Github size={10} />
              {resumeInfo?.personalInfo?.github || "Github"}
              </a>
          </h5>
        )}
        {resumeInfo?.personalInfo?.medium && (
          <h5 className="font-normal text-[9px] sm:text-[13px]">
              <a href={handleMediumClick()} className="flex items-center" target="_blank" rel="noreferrer">
              <FaMediumM size={10} />
              {resumeInfo?.personalInfo?.medium || "Medium"}
              </a>
          </h5>
        )}
        {resumeInfo?.personalInfo?.website && (
          <h5 className="font-normal text-[9px] sm:text-[13px]">
              <a href={handleWebsiteClick()} target="_blank" rel="noreferrer" >
              <Home size={10} />
              {resumeInfo?.personalInfo?.website || "Website"}
              </a>
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
