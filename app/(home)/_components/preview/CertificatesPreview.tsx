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
            className="bg-white shadow-sm rounded-lg p-3 mobile:p-2 mobile:rounded-md"
          >
            <div className="flex flex-col mobile:flex-col">
              <div className="flex flex-col mb-2">
                <div className="flex items-center mb-1">
                  <span 
                    className="text-[13px] mobile:text-[12px] text-gray-600 mr-2"
                  >
                    {certificate?.issueDate}
                  </span>
                  <h5
                    className="text-sm mobile:text-[14px] font-bold"
                    style={{ color: themeColor }}
                  >
                    {certificate?.certificateName}
                  </h5>
                </div>
                {certificate?.teacher && (
                  <h5 className="text-sm mobile:text-[13px] text-gray-700 mb-1">
                    {certificate?.teacher}
                  </h5>
                )}
              </div>
              
              <div className="flex justify-between items-end">
                <div></div>
                <h5
                  className="text-sm mobile:text-[13px] font-bold text-right"
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