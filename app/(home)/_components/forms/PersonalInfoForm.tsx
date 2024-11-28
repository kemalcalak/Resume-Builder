import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useResumeContext } from "@/context/resume-info-provider";
import { PersonalInfoType } from "@/types/resume.type";
import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import PersonalInfoSkeletonLoader from "@/components/skeleton-loader/personal-info-loader";
import { generateThumbnail } from "@/lib/helper";
import useUpdateDocument from "@/features/document/use-update-document";
import { toast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";

const initialState = {
  id: undefined,
  firstName: "",
  lastName: "",
  jobTitle: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  linkedin: "",
  github: "",
  medium: "",
};

const PersonalInfoForm = (props: { handleNext: () => void }) => {
  const { handleNext } = props;
  const { resumeInfo, isLoading, onUpdate } = useResumeContext();
  const { mutateAsync, isPending } = useUpdateDocument();
  const [personalInfo, setPersonalInfo] =
    useState<PersonalInfoType>(initialState);

  useEffect(() => {
    if (resumeInfo?.personalInfo) {
      setPersonalInfo({
        ...resumeInfo.personalInfo,
      });
    }
  }, [resumeInfo?.personalInfo]);

  const handleChange = useCallback(
    (e: { target: { name: string; value: string } }) => {
      const { name, value } = e.target;

      setPersonalInfo({ ...personalInfo, [name]: value });

      if (!resumeInfo) return;

      onUpdate({
        ...resumeInfo,
        personalInfo: {
          ...resumeInfo.personalInfo,
          [name]: value,
        },
      });
    },
    [resumeInfo, onUpdate]
  );

  const handleSubmit = useCallback(
    async (e: { preventDefault: () => void }) => {
      e.preventDefault();
      const thumbnail = await generateThumbnail();
      const currentNo = resumeInfo?.currentPosition
        ? resumeInfo.currentPosition + 1
        : 1;
      await mutateAsync(
        {
          currentPosition: currentNo,
          thumbnail: thumbnail,
          personalInfo: personalInfo,
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Personal Information updated successfully",
            });
            handleNext();
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: "Failed to update personal information",
              variant: "destructive",
            });
          },
        }
      );
    },
    [personalInfo, resumeInfo]
  );

  if (isLoading) {
    return <PersonalInfoSkeletonLoader />;
  }

  return (
    <div>
      <div className="w-full">
        <h2 className="font-bold text-lg">Personal Information</h2>
        <p className="text-sm">Get Started with personal information</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 mt-5 gap-3">
          <div>
            <Label className="text-sm">First Name</Label>
            <Input
              name="firstName"
              required
              autoComplete="off"
              placeholder="Enter your first name"
              value={personalInfo.firstName || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label className="text-sm">Last Name</Label>
            <Input
              name="lastName"
              required
              autoComplete="off"
              placeholder="Enter your last name"
              value={personalInfo.lastName || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label className="text-sm">Job Title</Label>
            <Input
              name="jobTitle"
              required
              autoComplete="off"
              placeholder="Enter your current job title"
              value={personalInfo.jobTitle || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label className="text-sm">Phone Number</Label>
            <Input
              name="phone"
              required
              autoComplete="off"
              placeholder="Enter your phone number"
              value={personalInfo.phone || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-span-2">
            <Label className="text-sm">Address</Label>
            <Input
              name="address"
              required
              autoComplete="off"
              placeholder="Enter your full address"
              value={personalInfo.address || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-span-2">
            <Label className="text-sm">E-Mail Address</Label>
            <Input
              name="email"
              required
              autoComplete="off"
              placeholder="Enter your email address"
              value={personalInfo.email || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label className="text-sm">LinkedIn Account</Label>
            <Input
              name="linkedin"
              autoComplete="off"
              placeholder="in/yourprofile (optional)"
              value={personalInfo.linkedin || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label className="text-sm">GitHub Account</Label>
            <Input
              name="github"
              autoComplete="off"
              placeholder="github.com/username (optional)"
              value={personalInfo.github || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label className="text-sm">Medium Account</Label>
            <Input
              name="medium"
              autoComplete="off"
              placeholder="medium.com/@username (optional)"
              value={personalInfo.medium || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label className="text-sm">Website</Label>
            <Input
              name="website"
              autoComplete="off"
              placeholder="yourwebsite.com (optional)"
              value={personalInfo.website || ""}
              onChange={handleChange}
            />
          </div>
        </div>
        <Button
          className="mt-4"
          type="submit"
          disabled={isPending || resumeInfo?.status === "archived"}
        >
          {isPending && <Loader size="15px" className="animate-spin" />}
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default PersonalInfoForm;
