import { Skeleton } from "@/components/ui/skeleton";
import { ResumeDataType } from "@/types/resume.type";
import React, { FC } from "react";

interface Propstype {
  resumeInfo: ResumeDataType | undefined;
  isLoading: boolean;
}

const SummaryPreview: FC<Propstype> = ({ resumeInfo, isLoading }) => {
  return (
    <div className="w-full min-h-10">
      {isLoading ? (
        <Skeleton className="h-6 w-full" />
      ) : (
        <p className="text-[13px] !leading-4">
          {resumeInfo?.summary ||
            "Enter a brief description of your profession background"}
        </p>
      )}
    </div>
  );
};

export default SummaryPreview;
