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
    <div className="w-full my-3 mb-0 pb-0">
      <h5
        className="text-start font-bold
      "
        style={{ color: themeColor }}
      >
        Projects
      </h5>
      <hr
        className="
          border-[1.5px] myb-1
          "
        style={{
          borderColor: themeColor,
        }}
      />

      <div className="flex flex-col gap-2 min-h-9">
        {resumeInfo?.projects?.map((project, index) => (
          <div key={index}>
            <div className="flex items-start justify-between">
              <h5 className="text-sm font-bold" style={{ color: themeColor }}>
                {project?.projectName}
              </h5>
              <span className="text-[13px]">
                {project?.startDate}
                {project?.startDate && " - "}
                {project?.endDate}
              </span>
            </div>
            <p className="text-[13px] my-2">{project?.projectSummary}</p>
            {"\n"}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPreview;
