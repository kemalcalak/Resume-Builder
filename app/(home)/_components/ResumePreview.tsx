"use client";
import { useResumeContext } from "@/context/resume-info-provider";
import { cn } from "@/lib/utils";
import React from "react";
import PersonalInfo from "@/components/preview/PersonalInfo";
import SummaryPreview from "@/components/preview/SummaryPreview";
import ExperiencePreview from "@/components/preview/ExperiencePreview";
import EducationPreview from "@/components/preview/EducationPreview";
import ProjectsPreview from "@/components/preview/ProjectsPreview";
import CertificationsPreview from "@/components/preview/CertificatesPreview";

const ResumePreview = () => {
  const { resumeInfo, isLoading } = useResumeContext();

  return (
    <div
      id="resume-preview-id"
      className={cn(
        `
        shadow-lg bg-white w-full flex-[1.02]
        h-full p-10 !font-open-sans
        dark:border dark:bg-card 
        dark:border-b-gray-800 
        dark:border-x-gray-800`
      )}
    >
      {/* {Personal Info} */}
      <PersonalInfo isLoading={isLoading} resumeInfo={resumeInfo} />
      {/* {Summary} */}
      <SummaryPreview isLoading={isLoading} resumeInfo={resumeInfo} />

      {/* {Professional Experience} */}
      <ExperiencePreview isLoading={isLoading} resumeInfo={resumeInfo} />

      {/* {Projects} */}
      <ProjectsPreview isLoading={isLoading} resumeInfo={resumeInfo} />

      {/* {Educational Info} */}
      <EducationPreview isLoading={isLoading} resumeInfo={resumeInfo} />

      {/* {Certifications} */}
      <CertificationsPreview isLoading={isLoading} resumeInfo={resumeInfo} />
    </div>
  );
};

export default ResumePreview;
