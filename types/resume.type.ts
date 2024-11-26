export type ExperienceType = {
  id?: number;
  docId?: number | null;
  title: string | null;
  companyName: string | null;
  city: string | null;
  state: string | null;
  startDate: string | null;
  endDate?: string | null;
  currentlyWorking: boolean;
  workSummary: string | null;
};

export type EducationType = {
  id?: number;
  docId?: number | null;
  universityName: string | null;
  startDate: string | null;
  endDate: string | null;
  degree: string | null;
  major: string | null;
  description: string | null;
};

export type ProjectType = {
  id?: number;
  docId?: number | null;
  projectName: string | null;
  projectSummary: string | null;
  startDate: string | null;
  endDate: string | null;
};

export type CertificateType = {
  id?: number;
  docId?: number | null;
  certificateName: string | null;
  teacher: string | null;
  whoGave: string | null;
  issueDate: string | null;
}

export type PersonalInfoType = {
  id?: number;
  docId?: number | null;
  firstName?: string | null;
  lastName?: string | null;
  jobTitle?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  linkedin?: string | null;
  github?: string | null;
  medium?: string | null;
};

export type StatusType = "archived" | "private" | "public" | undefined;

export type ResumeDataType = {
  id?: number;
  documentId?: string;
  title: string;
  status: StatusType;
  thumbnail?: string | null;
  personalInfo?: PersonalInfoType | null;
  themeColor?: string | null;
  currentPosition?: number | null;
  summary: string | null;
  experiences?: ExperienceType[] | null;
  educations?: EducationType[] | null;
  projects?: ProjectType[] | null;
  certificates?: CertificateType[] | null;
  updatedAt?: string;
};
