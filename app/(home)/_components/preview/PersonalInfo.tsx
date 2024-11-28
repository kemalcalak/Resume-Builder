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
    <div className="w-full min-h-14">
      <h2
        className="font-bold text-xl text-center "
        style={{
          color: themeColor,
        }}
      >
        {resumeInfo?.personalInfo?.firstName || "First Name"}{" "}
        {resumeInfo?.personalInfo?.lastName || "Last Name"}
      </h2>
      <h5 className="text-center text-sm font-medium">
        {resumeInfo?.personalInfo?.jobTitle || "Job Title"}
      </h5>
      <p className="text-center font-normal text-[13px]">
        {resumeInfo?.personalInfo?.address || "Address"}
      </p>
      <div className="flex justify-between items-center pt-3 ">
        <h5 className="flex font-normal text-[12px]">
          <Phone size={14} style={{ paddingRight: "2px", marginTop: "2px" }} />
          {resumeInfo?.personalInfo?.phone || "Phone Number"}
        </h5>
        <h5 className="flex font-normal text-[12px]">
          <button onClick={handleMailClick} className="flex">
            <Mail size={14} style={{ paddingRight: "2px", marginTop: "2px" }} />
            {resumeInfo?.personalInfo?.email || "Email Address"}
          </button>
        </h5>
        {resumeInfo?.personalInfo?.linkedin && (
          <h5 className="font-normal text-[12px]">
            <button onClick={handleLinkedlnClick} className="flex">
              <Linkedin
                size={14}
                style={{ paddingRight: "2px", marginTop: "1px" }}
              />
              {resumeInfo?.personalInfo?.linkedin || "LinkedIn Profile"}
            </button>
          </h5>
        )}
        {resumeInfo?.personalInfo?.github && (
          <h5 className="font-normal text-[12px]">
            <button onClick={handleGithubClick} className="flex">
              <Github
                size={14}
                style={{ paddingRight: "2px", marginTop: "2px" }}
              />
              {resumeInfo?.personalInfo?.github || "Github Profile"}
            </button>
          </h5>
        )}
        {resumeInfo?.personalInfo?.medium && (
          <h5 className="font-normal text-[12px]">
            <button onClick={handleMediumClick} className="flex">
              <FaMedium
                size={14}
                style={{ paddingRight: "2px", marginTop: "2px" }}
              />
              {resumeInfo?.personalInfo?.medium || "Medium"}
            </button>
          </h5>
        )}
        {resumeInfo?.personalInfo?.website && (
          <h5 className="font-normal text-[12px]">
            <button onClick={handleWebsiteClick} className="flex">
              <Home
                size={14}
                style={{ paddingRight: "2px", marginTop: "2px" }}
              />
              {resumeInfo?.personalInfo?.website || "Website"}
            </button>
          </h5>
        )}
      </div>
      <hr
        className="border-[1.5px] mb-2"
        style={{
          borderColor: themeColor,
        }}
      />
    </div>
  );
};

const SkeletonLoader = () => {
  return (
    <div className="w-full min-h-14">
      <Skeleton className="h-6 w-1/2 mx-auto mb-2" />
      <Skeleton className="h-6 w-1/4 mx-auto mb-2" />
      <Skeleton className="h-6 w-1/3 mx-auto mb-2" />
      <div className="flex justify-between pt-3">
        <Skeleton className="h-3 w-1/4 " />
        <Skeleton className="h-3 w-1/4 " />
      </div>
      <Skeleton className="h-[1.5px] w-full my-2" />
    </div>
  );
};

export default PersonalInfo;
