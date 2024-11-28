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
    <div className="w-full my-3 mb-0 pb-0">
      <h5
        className="text-start font-bold
      "
        style={{ color: themeColor }}
      >
        Professional Experience
      </h5>
      <hr
        className="
          border-[1.5px] mb-1 mt-0 pt-0
          "
        style={{
          borderColor: themeColor,
        }}
      />

      <div className="flex flex-col gap-2 min-h-9">
        {resumeInfo?.experiences?.map((experience, index) => (
          <div key={index}>
            <h5 className="text-[15px] font-bold" style={{ color: themeColor }}>
              {experience?.title}
            </h5>
            <div
              className="flex items-start 
            justify-between mb-2"
            >
              <h5 className="text-[13px]">
                {experience?.companyName}
                {experience?.companyName && experience?.city && ", "}
                {experience?.city}
                {experience?.city && experience?.state && ", "}
                {experience?.state}
              </h5>
              <span className="text-[13px]">
                {experience?.startDate}
                {experience?.startDate && " - "}
                {experience?.currentlyWorking ? "Present" : experience?.endDate}
              </span>
            </div>
            <div
              style={{ fontSize: "13px" }}
              className="exp-preview leading-[14.6px]"
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