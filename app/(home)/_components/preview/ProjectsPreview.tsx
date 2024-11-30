import SkeletonLoader from "@/components/skeleton-loader";
import { INITIAL_THEME_COLOR } from "@/lib/helper";
import { ResumeDataType } from "@/types/resume.type";
import React, { FC } from "react";

interface Propstype {
  resumeInfo: ResumeDataType | undefined;
  isLoading: boolean;
}

const ProjectsPreview: FC<Propstype> = ({ resumeInfo, isLoading }) => {
  console.log(resumeInfo?.projects);
  const themeColor = resumeInfo?.themeColor || INITIAL_THEME_COLOR;
  
  if (isLoading) {
    return <SkeletonLoader />;
  }
  
  return (
    <div className="w-full pb-3">
      <h5
        className="text-start font-bold text-base mobile:text-sm"
        style={{ color: themeColor }}
      >
        Projects
      </h5>
      <hr
        className="border-[1.5px] mb-2"
        style={{
          borderColor: themeColor,
        }}
      />

      <div className="flex flex-col gap-4 mobile:gap-3 min-h-9">
        {resumeInfo?.projects?.map((project, index) => (
          <div 
            key={index} 
          >
            <div className="flex flex-col mobile:flex-row mobile:items-center mobile:justify-between mb-2">
              <h5 
                className="text-sm mobile:text-[14px] font-bold mb-1 mobile:mb-0" 
                style={{ color: themeColor }}
              >
                {project?.projectName}
              </h5>
            </div>
            <div
              className="text-[13px] mobile:text-[12px] leading-tight exp-preview pb-1"
              dangerouslySetInnerHTML={{
                __html: project?.projectSummary || "",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPreview;