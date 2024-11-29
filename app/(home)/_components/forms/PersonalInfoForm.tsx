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

// Validation functions
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string) => {
  const phoneRegex =
    /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
};

// Function to extract username from URLs
const extractUsername = (url: string, platform: 'linkedin' | 'github' | 'medium') => {
  if (!url) return '';

  try {
    // Remove trailing slashes
    url = url.replace(/\/+$/, '');

    switch (platform) {
      case 'linkedin':
        const linkedinMatch = url.match(/\/in\/([^\/]+)$/i);
        return linkedinMatch ? linkedinMatch[1] : url;
      
      case 'github':
        const githubMatch = url.match(/\/([^\/]+)$/);
        return githubMatch ? githubMatch[1] : url;
      
      case 'medium':
        const mediumMatch = url.match(/\/@([^\/]+)$/);
        return mediumMatch ? mediumMatch[1] : url;
      
      default:
        return url;
    }
  } catch (error) {
    return url;
  }
};

const PersonalInfoForm = (props: { handleNext: () => void }) => {
  const { handleNext } = props;
  const { resumeInfo, isLoading, onUpdate } = useResumeContext();
  const { mutateAsync, isPending } = useUpdateDocument();
  const [personalInfo, setPersonalInfo] =
    useState<PersonalInfoType>(initialState);

  // Define required fields with their display labels
  const requiredFields = [
    { key: "firstName", label: "First name" },
    { key: "lastName", label: "Last name" },
    { key: "jobTitle", label: "Job title" },
    { key: "phone", label: "Phone number" },
    { key: "email", label: "E-Mail address" },
    { key: "address", label: "Address" },
  ] as const;

  // Error state with precise typing
  const [errors, setErrors] = useState<{
    [Key in (typeof requiredFields)[number]["key"]]?: string;
  }>({});

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

      // Clear previous errors when typing
      if (errors[name as keyof typeof errors]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }

      // Special handling for specific fields
      let processedValue = value;
      switch (name) {
        case 'phone':
          // Allow only digits, spaces, +, -, (), .
          processedValue = value.replace(/[^\d\s+\-().]/g, "");
          break;
        case 'linkedin':
          processedValue = extractUsername(value, 'linkedin');
          break;
        case 'github':
          processedValue = extractUsername(value, 'github');
          break;
        case 'medium':
          processedValue = extractUsername(value, 'medium');
          break;
        case 'website':
          const websiteMatch = value.match(/^(https?:\/\/)?(www\.)?([^\/]+)/i);
          processedValue = websiteMatch ? websiteMatch[3] : value;
          break;
      }

      setPersonalInfo((prev) => ({ ...prev, [name]: processedValue }));

      if (!resumeInfo) return;

      onUpdate({
        ...resumeInfo,
        personalInfo: {
          ...resumeInfo.personalInfo,
          [name]: processedValue,
        },
      });
    },
    [resumeInfo, onUpdate, errors]
  );

  const handleSubmit = useCallback(
    async (e: { preventDefault: () => void }) => {
      e.preventDefault();

      // Validation
      const newErrors: typeof errors = {};

      // Validate required fields
      requiredFields.forEach((field) => {
        if (!personalInfo[field.key]) {
          newErrors[field.key] = `${field.label} can not be left blank`;
        }
      });

      // Email validation
      if (personalInfo.email && !validateEmail(personalInfo.email)) {
        newErrors.email = "Invalid email address";
      }

      // Phone validation
      if (personalInfo.phone && !validatePhone(personalInfo.phone)) {
        newErrors.phone = "Invalid phone number";
      }

      // If there are errors, set them and prevent submission
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      try {
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
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    },
    [personalInfo, resumeInfo, handleNext, mutateAsync]
  );

  if (isLoading) {
    return <PersonalInfoSkeletonLoader />;
  }

  return (
    <div>
      <div className="w-full">
        <h2 className="font-bold text-lg">Personal Information</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 mt-5 gap-3">
          <div>
            <Label className="text-sm">First Name</Label>
            <Input
              name="firstName"
              autoComplete="off"
              placeholder="Enter your first name"
              value={personalInfo.firstName || ""}
              onChange={handleChange}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>
          <div>
            <Label className="text-sm">Last Name</Label>
            <Input
              name="lastName"
              autoComplete="off"
              placeholder="Enter your last name"
              value={personalInfo.lastName || ""}
              onChange={handleChange}
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>
          <div>
            <Label className="text-sm">Job Title</Label>
            <Input
              name="jobTitle"
              autoComplete="off"
              placeholder="Enter your current job title"
              value={personalInfo.jobTitle || ""}
              onChange={handleChange}
            />
            {errors.jobTitle && (
              <p className="text-red-500 text-xs mt-1">{errors.jobTitle}</p>
            )}
          </div>
          <div>
            <Label className="text-sm">Phone Number</Label>
            <Input
              name="phone"
              autoComplete="off"
              placeholder="Enter phone number (+, -, ())"
              value={personalInfo.phone || ""}
              onChange={handleChange}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>
          <div className="sm:col-span-2">
            <Label className="text-sm">Address</Label>
            <Input
              name="address"
              autoComplete="off"
              placeholder="Enter your full address"
              value={personalInfo.address || ""}
              onChange={handleChange}
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>
          <div className="sm:col-span-2">
            <Label className="text-sm">E-Mail Address</Label>
            <Input
              name="email"
              autoComplete="off"
              placeholder="Enter your email address"
              value={personalInfo.email || ""}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
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
        <div className="flex justify-end mt-4">
          <Button
            type="submit"
            disabled={isPending || resumeInfo?.status === "archived"}
          >
            {isPending && <Loader size="15px" className="animate-spin mr-2" />}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoForm;