import React, { FC } from "react";
import SkeletonLoader from "@/components/skeleton-loader";
import { INITIAL_THEME_COLOR } from "@/lib/helper";
import { ResumeDataType } from "@/types/resume.type";

interface PropsType {
  resumeInfo: ResumeDataType | undefined;
  isLoading: boolean;
}

const EducationPreview: FC<PropsType> = ({ resumeInfo, isLoading }) => {
  const themeColor = resumeInfo?.themeColor || INITIAL_THEME_COLOR;
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  if (isLoading) {
    return <SkeletonLoader />;
  }
  return (
    <div className="w-full pb-3">
      <h5
        className="text-start font-bold text-base mobile:text-sm"
        style={{ color: themeColor }}
      >
        Education
      </h5>
      <hr
        className="border-[1.5px] mb-2 mt-0"
        style={{
          borderColor: themeColor,
        }}
      />

      <div className="flex flex-col gap-4 mobile:gap-3 min-h-9">
        {resumeInfo?.educations?.map((education, index) => (
          <div 
            key={index} 
          >
            <h5 
              className="text-[15px] mobile:text-[14px] font-bold mb-1" 
              style={{ color: themeColor }}
            >
              {education?.universityName}
            </h5>
            <div className="flex justify-between">
              <h5 className="text-[13px] mobile:text-[12px] text-gray-700  mobile:mb-0">
                {education?.degree}
                {education?.degree && education?.major && " in "}
                {education?.major}
              </h5>
              <span className="text-[13px] mobile:text-[12px] text-gray-600">
              <span className="text-[13px] text-gray-600">
                  {formatDate(education?.startDate)}
                  {education?.startDate && " - "}
                  {formatDate(education?.endDate)}
                </span>
              </span>
            </div>
            {education?.description && (
              <p className="text-[13px] mobile:text-[12px] leading-tight text-gray-800 m">
                {education?.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationPreview;