"use client";

import { resumeData } from "@/lib/dummy";
import { ResumeDataType } from "@/types/resume.type";
import { useParams } from "next/navigation";
import {
  createContext,
  useState,
  FC,
  ReactNode,
  useEffect,
  useContext,
} from "react";

type ResumeContextType = {
  resumeInfo: ResumeDataType | undefined;
  onupdate: (data: ResumeDataType) => void;
};

export const ResumeInfoContext = createContext<ResumeContextType | undefined>(
  undefined
);

export const ResumeInfoProvider: FC<{ children: ReactNode }> = ({children }) => {
  const param = useParams();
  const documentId = param.documentId;
  const [resumeInfo, setResumeInfo] = useState<ResumeDataType>();
  useEffect(() => {
    setResumeInfo(resumeData);
  }, []);
  const onUpdate = (data: ResumeDataType) => {
    setResumeInfo(data);
  };
  return (
    <ResumeInfoContext.Provider value={{ resumeInfo,onUpdate}}>
      {children}
    </ResumeInfoContext.Provider>
  );
};

export const useResumeContext = () => {
  const context = useContext(ResumeInfoContext);
  if (!context) {
    throw new Error("useResumeContext must be used within ResumeInfoProvider");
  }
    return context;
};
