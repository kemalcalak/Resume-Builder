import SkeletonLoader from "@/components/skeleton-loader";
import { INITIAL_THEME_COLOR } from "@/lib/helper";
import { ResumeDataType } from "@/types/resume.type";
import React, { FC } from "react";

interface Propstype {
  resumeInfo: ResumeDataType | undefined;
  isLoading: boolean;
}

const ProjectsPreview: FC<Propstype> = ({ resumeInfo, isLoading }) => {
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
            className="bg-white shadow-sm rounded-lg p-3 mobile:p-2 mobile:rounded-md"
          >
            <div className="flex flex-col mobile:flex-row mobile:items-center mobile:justify-between mb-2">
              <h5 
                className="text-sm mobile:text-[14px] font-bold mb-1 mobile:mb-0" 
                style={{ color: themeColor }}
              >
                {project?.projectName}
              </h5>
              <span className="text-[13px] mobile:text-[12px] text-gray-600">
                {project?.startDate}
                {project?.startDate && " - "}
                {project?.endDate}
              </span>
            </div>
            {project?.projectSummary && (
              <p className="text-[13px] mobile:text-[12px] leading-tight text-gray-800 mt-2">
                {project?.projectSummary}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPreview;