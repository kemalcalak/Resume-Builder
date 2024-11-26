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
    <div className="w-full my-5">
      <h5
        className="text-center font-bold
      "
        style={{ color: themeColor }}
      >
        Certificates
      </h5>
      <hr
        className="
          border-[1.5px] mb-1
          "
        style={{
          borderColor: themeColor,
        }}
      />

      <div className="flex flex-col gap-2 min-h-9">
        {resumeInfo?.certificates?.map((certificate, index) => (
          <div key={index}>
            <div className="flex items-start justify-between">
              <div className="flex">
              <span className="text-[13px] pr-2">{certificate?.issueDate}</span>
              <h5
                className="flex text-sm font-bold"
                style={{ color: themeColor }}
              >
                {certificate?.certificateName},
              </h5>
              <h5 className="flex text-sm">
                {certificate?.teacher}
              </h5>
              </div>
              <h5
                className="flex text-sm font-bold"
                style={{ alignItems: "end" }}
              >
                {certificate?.whoGave}
              </h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificationsPreview;
