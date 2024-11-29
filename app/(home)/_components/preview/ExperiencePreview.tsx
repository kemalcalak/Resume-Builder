import SkeletonLoader from "@/components/skeleton-loader";
import { INITIAL_THEME_COLOR } from "@/lib/helper";
import { ResumeDataType } from "@/types/resume.type";
import React, { FC } from "react";

interface PropsType {
  resumeInfo: ResumeDataType | undefined;
  isLoading: boolean;
}

const ExperiencePreview: FC<PropsType> = ({ resumeInfo, isLoading }) => {
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
        Experience
      </h5>
      <hr
        className="border-[1.5px] mb-2 mt-0"
        style={{
          borderColor: themeColor,
        }}
      />

      <div className="flex flex-col gap-4 mobile:gap-3 min-h-9">
        {resumeInfo?.experiences?.map((experience, index) => (
          <div 
            key={index} 
            className="bg-white shadow-sm rounded-lg p-3 mobile:p-2 mobile:rounded-md"
          >
            <h5 
              className="text-[15px] mobile:text-[14px] font-bold mb-1" 
              style={{ color: themeColor }}
            >
              {experience?.title}
            </h5>
            <div className="flex flex-col mobile:flex-row mobile:items-center mobile:justify-between mb-2">
              <h5 className="text-[13px] mobile:text-[12px] text-gray-700 mb-1 mobile:mb-0">
                {experience?.companyName}
                {experience?.companyName && experience?.city && ", "}
                {experience?.city}
                {experience?.city && experience?.state && ", "}
                {experience?.state}
              </h5>
              <span className="text-[13px] mobile:text-[12px] text-gray-600">
                {experience?.startDate}
                {experience?.startDate && " - "}
                {experience?.currentlyWorking ? "Present" : experience?.endDate}
              </span>
            </div>
            <div
              className="text-[13px] mobile:text-[12px] leading-tight text-gray-800 exp-preview"
              dangerouslySetInnerHTML={{
                __html: experience?.workSummary || "",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperiencePreview;