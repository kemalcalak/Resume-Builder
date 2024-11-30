import React, { FC } from "react";
import SkeletonLoader from "@/components/skeleton-loader";
import { INITIAL_THEME_COLOR } from "@/lib/helper";
import { ResumeDataType } from "@/types/resume.type";

interface Propstype {
  resumeInfo: ResumeDataType | undefined;
  isLoading: boolean;
}

const CertificationsPreview: FC<Propstype> = ({ resumeInfo, isLoading }) => {
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
        Certificates
      </h5>
      <hr
        className="border-[1.5px]"
        style={{
          borderColor: themeColor,
        }}
      />

      <div className="flex flex-col gap-4 mobile:gap-3 min-h-9">
        {resumeInfo?.certificates?.map((certificate, index) => (
          <div 
            key={index} 
          >
            <div className="flex justify-between">
              <div className="flex items-left">
                <div className="flex items-left">
                  <span 
                    className="text-[13px] mobile:text-[12px] text-gray-600 mr-2"
                  >
                    {formatDate(certificate?.issueDate)}
                  </span>
                  <h5
                    className="text-[13px] mobile:text-[12px] font-bold"
                    style={{ color: themeColor }}
                  >
                    {certificate?.certificateName}{" "}
                  </h5>
                </div>
                {certificate?.teacher && (
                  <h5 className="text-[13px] mobile:text-[12px] text-gray-700 mx-1">
                    {" - "}
                  </h5>
                )}
                {certificate?.teacher && (
                  <h5 className="text-[13px] mobile:text-[12px] text-gray-700">
                    
                  {certificate?.teacher}
                  </h5>
                )}
              </div>
              
              <div className="items-end">
                <div></div>
                <h5
                  className="text-[13px] mobile:text-[12px] font-bold"
                  style={{ color: themeColor }}
                >
                  {certificate?.whoGave}
                </h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificationsPreview;