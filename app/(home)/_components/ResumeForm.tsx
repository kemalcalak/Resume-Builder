"use client";
import React, { useState } from "react";
import { useResumeContext } from "@/context/resume-info-provider";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import SummaryForm from "./forms/SummaryForm";
import ExperienceForm from "./forms/ExperienceForm";
import EducationForm from "./forms/EducationForm";
import ProjectForm from "./forms/ProjectForm";
import CertificateForm from "./forms/CertificateForm";

const ResumeForm = () => {
  const { resumeInfo } = useResumeContext();
  const [activeFormIndex, setActiveFormIndex] = useState(1);

  const handleNext = () => {
    const newIndex = activeFormIndex + 1;
    setActiveFormIndex(newIndex > 6 ? 1 : newIndex);
  };

  const handlePrevious = () => {
    setActiveFormIndex(prevIndex => prevIndex > 1 ? prevIndex - 1 : prevIndex);
  };

  return (
    <div className="flex-1 w-full lg:sticky lg:top-16 lg:max-w-[1000px] xl:max-w-[1200px] 2xl:max-w-[1400px] mx-auto lg:mx-1">
      <div 
        className="shadow-md rounded-md bg-white 
        !border-t-primary !border-t-4 
        dark:bg-card dark:border dark:border-gray-800"
      >
        <div className="flex items-center gap-1 px-3 justify-end border-b py-[7px] min-h-10">
          {activeFormIndex > 1 && (
            <Button
              variant="outline"
              size="default"
              className="!px-2 !py-1 !h-auto"
              onClick={handlePrevious}
            >
              <ArrowLeft size="16px" />
              Previous
            </Button>
          )}

          <Button
            variant="outline"
            size="default"
            className="!px-2 !py-1 !h-auto"
            disabled={activeFormIndex === 6 || resumeInfo?.status === "archived"}
            onClick={handleNext}
          >
            Next
            <ArrowRight size="16px" />
          </Button>
        </div>
        
        <div className="px-5 py-3 pb-5">
          {activeFormIndex === 1 && <PersonalInfoForm handleNext={handleNext} />}
          {activeFormIndex === 2 && <SummaryForm handleNext={handleNext} />}
          {activeFormIndex === 3 && <ExperienceForm handleNext={handleNext} />}
          {activeFormIndex === 4 && <EducationForm handleNext={handleNext} />}
          {activeFormIndex === 5 && <ProjectForm handleNext={handleNext} />}
          {activeFormIndex === 6 && <CertificateForm handleNext={handleNext} />}
        </div>
      </div>
    </div>
  );
};

export default ResumeForm;