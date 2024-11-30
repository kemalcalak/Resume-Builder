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
        Experience
      </h5>
      <hr
        className="border-[1.5px] mb-2 mt-0"
        style={{
          borderColor: themeColor,
        }}
      />

      <div className="flex flex-col min-h-9">
        {resumeInfo?.experiences?.map((experience, index) => (
          <div key={index} className=" rounded-lg  mobile:rounded-md">
            <div className="flex justify-between">
              <h5
                className="text-[15px] mobile:text-[14px] font-bold mb-1"
                style={{ color: themeColor }}
              >
                {experience?.title}
              </h5>
              <h5 className="text-[13px] mobile:text-[12px] text-gray-700 pt-1 mb-1 mobile:mb-0">
                {experience?.city}
                {experience?.city && experience?.state && " - "}
                {experience?.state}
              </h5>
            </div>
            <div className="flex justify-between">
              <h5 className="text-[13px] mobile:text-[12px] text-gray-700 mb-1 mobile:mb-0">
                {experience?.companyName}
              </h5>
              <span className="text-[13px] mobile:text-[12px] text-gray-600">
                <span className="text-[13px] text-gray-600">
                  {formatDate(experience?.startDate)}
                  {experience?.startDate && " - "}
                  {experience?.currentlyWorking
                    ? "Present"
                    : formatDate(experience?.endDate)}
                </span>
              </span>
            </div>
            <div
              className="text-[13px] mobile:text-[12px] leading-tight exp-preview pb-1"
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
