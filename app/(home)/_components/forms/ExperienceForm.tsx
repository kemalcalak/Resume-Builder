import RichTextEditorExperience from "@/components/editorExperience";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useResumeContext } from "@/context/resume-info-provider";
import useUpdateDocument from "@/features/document/use-update-document";
import { toast } from "@/hooks/use-toast";
import { generateThumbnail } from "@/lib/helper";
import { Loader, Plus, X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

const initialState = {
  id: undefined,
  title: "",
  companyName: "",
  city: "",
  state: "",
  startDate: "",
  endDate: "",
  workSummary: "",
  currentlyWorking: false,
};

interface FormErrors {
  title?: string;
  companyName?: string;
  city?: string;
  state?: string;
  startDate?: string;
  endDate?: string;
  workSummary?: string;
  dateRange?: string;
}

const ExperienceForm = (props: { handleNext: () => void }) => {
  const { handleNext } = props;
  const { resumeInfo, onUpdate } = useResumeContext();
  const { mutateAsync, isPending } = useUpdateDocument();
  const [errors, setErrors] = useState<FormErrors[]>([]);

  const [experienceList, setExperienceList] = useState(() => {
    return resumeInfo?.experiences?.length
      ? resumeInfo.experiences
      : [initialState];
  });

  useEffect(() => {
    if (!resumeInfo) return;
    onUpdate({
      ...resumeInfo,
      experiences: experienceList,
    });
  }, [experienceList]);

  const validateDates = (startDate: string | null, endDate: string | null | undefined, currentlyWorking: boolean): boolean => {
    // If either date is empty and not currently working, skip validation
    if (!startDate || (!endDate && !currentlyWorking)) return true;
    
    const start = new Date(startDate);
    const end = currentlyWorking ? new Date() : new Date(endDate || '');
    
    // Set hours to 0 for accurate date comparison
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    
    return start <= end;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>, // Updated type definition
    index: number
  ) => {
    const { name, value } = e.target;
    setExperienceList((prevState) => {
      const newExperienceList = [...prevState];
      const updatedExperience = {
        ...newExperienceList[index],
        [name]: value,
      };
  
      // Check date validation when either date changes
      if (name === "startDate" || name === "endDate") {
        const startDate = name === "startDate" ? value : updatedExperience.startDate || '';
        const endDate = name === "endDate" ? value : updatedExperience.endDate || '';
        
        const isValidDateRange = validateDates(
          startDate,
          endDate,
          updatedExperience.currentlyWorking
        );
  
        setErrors(prev => {
          const newErrors = [...prev];
          if (!isValidDateRange) {
            newErrors[index] = {
              ...newErrors[index],
              dateRange: "Start date cannot be later than end date"
            };
          } else {
            const { dateRange, ...rest } = newErrors[index] || {};
            newErrors[index] = rest;
          }
          return newErrors;
        });
      }
  
      newExperienceList[index] = updatedExperience;
      return newExperienceList;
    });
    
    // Clear specific field error when user starts typing
    setErrors(prev => {
      const newErrors = [...prev];
      if (newErrors[index]) {
        delete newErrors[index][name as keyof FormErrors];
      }
      return newErrors;
    });
  };

  const handleCurrentlyWorking = (checked: boolean, index: number) => {
    setExperienceList((prevState) => {
      const newExperienceList = [...prevState];
      const today = new Date().toISOString().split('T')[0];
      
      newExperienceList[index] = {
        ...newExperienceList[index],
        currentlyWorking: checked,
        endDate: checked ? today : '',
      };
  
      // Validate dates after updating currently working status
      const isValidDateRange = validateDates(
        newExperienceList[index].startDate || '' ,
        checked ? today : '',
        checked
      );
  
      setErrors(prev => {
        const newErrors = [...prev];
        if (!isValidDateRange) {
          newErrors[index] = {
            ...newErrors[index],
            dateRange: "Start date cannot be later than end date"
          };
        } else {
          const { dateRange, ...rest } = newErrors[index] || {};
          newErrors[index] = rest;
        }
        return newErrors;
      });
  
      return newExperienceList;
    });
  };

  const addNewExperience = () => {
    setExperienceList([...experienceList, initialState]);
    setErrors([...errors, {}]);
  };

  const removeExperience = (index: number) => {
    const updatedExperience = [...experienceList];
    updatedExperience.splice(index, 1);
    setExperienceList(updatedExperience);
    
    const updatedErrors = [...errors];
    updatedErrors.splice(index, 1);
    setErrors(updatedErrors);
  };

  const handEditor = (value: string, name: string, index: number) => {
    setExperienceList((prevState) => {
      const newExperienceList = [...prevState];
      newExperienceList[index] = {
        ...newExperienceList[index],
        [name]: value,
      };
      return newExperienceList;
    });
  };

  const validateForm = () => {
    const newErrors: FormErrors[] = [];
    let isValid = true;

    experienceList.forEach((experience, index) => {
      const experienceErrors: FormErrors = {};

      if (!experience.title) {
        experienceErrors.title = "Position title is required";
        isValid = false;
      }
      if (!experience.companyName) {
        experienceErrors.companyName = "Company name is required";
        isValid = false;
      }
      if (!experience.city) {
        experienceErrors.city = "City is required";
        isValid = false;
      }
      if (!experience.state) {
        experienceErrors.state = "Country is required";
        isValid = false;
      }
      if (!experience.startDate) {
        experienceErrors.startDate = "Start date is required";
        isValid = false;
      }
      if (!experience.currentlyWorking && !experience.endDate) {
        experienceErrors.endDate = "End date is required";
        isValid = false;
      }

      // Validate date range
      const isValidDateRange = validateDates(
        experience.startDate,
        experience.endDate,
        experience.currentlyWorking
      );
      
      if (!isValidDateRange) {
        experienceErrors.dateRange = "Start date cannot be later than end date";
        isValid = false;
      }

      newErrors[index] = experienceErrors;
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = useCallback(
    async (e: { preventDefault: () => void }) => {
      e.preventDefault();

      if (!validateForm()) {
        toast({
          title: "Error",
          description: "Please fill in all required fields correctly",
          variant: "destructive",
        });
        return;
      }

      const thumbnail = await generateThumbnail();
      const currentNo = resumeInfo?.currentPosition
        ? resumeInfo.currentPosition + 1
        : 1;

      await mutateAsync(
        {
          currentPosition: currentNo,
          thumbnail: thumbnail,
          experience: experienceList,
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Experience updated successfully",
            });
            handleNext();
          },
          onError() {
            toast({
              title: "Error",
              description: "Failed to update experience",
              variant: "destructive",
            });
          },
        }
      );
    },
    [resumeInfo, experienceList]
  );

  return (
    <div>
      <div className="w-full">
        <h2 className="font-bold text-lg ">Experience</h2>
        <p className="text-sm text-muted-foreground">
          Enter your work experience and professional achievements to showcase
          your career journey
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="border w-full h-auto divide-y-[1px] rounded-md px-3 pb-4 my-5">
          {experienceList.map((item, index) => (
            <div key={index}>
              <div className="relative grid grid-cols-2 mb-5 pt-4 gap-3">
                {experienceList?.length > 1 && (
                  <Button
                    variant="secondary"
                    type="button"
                    className="size-[20px] text-center
                              rounded-full absolute -top-3 -right-5
                              !bg-black dark:!bg-gray-600 text-white"
                    size="icon"
                    onClick={() => removeExperience(index)}
                  >
                    <X size="13px" />
                  </Button>
                )}
                <div>
                  <Label className="text-sm">Job Title <span className="text-red-500">*</span></Label>
                  <Input
                    name="title"
                    placeholder="e.g., Software Engineer"
                    value={item?.title || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                  {errors[index]?.title && (
                    <p className="text-red-500 text-xs mt-1">{errors[index].title}</p>
                  )}
                </div>
  
                <div>
                  <Label className="text-sm">Organization Name <span className="text-red-500">*</span></Label>
                  <Input
                    name="companyName"
                    placeholder="e.g., Google Inc."
                    value={item?.companyName || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                  {errors[index]?.companyName && (
                    <p className="text-red-500 text-xs mt-1">{errors[index].companyName}</p>
                  )}
                </div>
  
                <div>
                  <Label className="text-sm">City <span className="text-red-500">*</span></Label>
                  <Input
                    name="city"
                    placeholder="e.g., San Francisco"
                    value={item?.city || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                  {errors[index]?.city && (
                    <p className="text-red-500 text-xs mt-1">{errors[index].city}</p>
                  )}
                </div>
  
                <div>
                  <Label className="text-sm">Country <span className="text-red-500">*</span></Label>
                  <Input
                    name="state"
                    placeholder="e.g., United States"
                    value={item?.state || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                  {errors[index]?.state && (
                    <p className="text-red-500 text-xs mt-1">{errors[index].state}</p>
                  )}
                </div>
  
                <div>
                  <Label className="text-sm">Start Date <span className="text-red-500">*</span></Label>
                  <Input
                    name="startDate"
                    type="date"
                    placeholder="Select start date"
                    value={item?.startDate || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                  {errors[index]?.startDate && (
                    <p className="text-red-500 text-xs mt-1">{errors[index].startDate}</p>
                  )}
                </div>
  
                <div>
                  <Label className="text-sm">End Date <span className="text-red-500">*</span></Label>
                  <Input
                    name="endDate"
                    type="date"
                    placeholder="Select end date"
                    value={item?.endDate || ""}
                    onChange={(e) => handleChange(e, index)}
                    disabled={item.currentlyWorking}
                  />
                  {errors[index]?.endDate && (
                    <p className="text-red-500 text-xs mt-1">{errors[index].endDate}</p>
                  )}
                </div>
  
                {errors[index]?.dateRange && (
                  <div className="col-span-2">
                    <p className="text-red-500 text-xs mt-1">{errors[index].dateRange}</p>
                  </div>
                )}
  
                <div className="col-span-2 flex items-center gap-2 mt-2">
                  <Checkbox
                    id={`currently-working-${index}`}
                    checked={item.currentlyWorking}
                    onCheckedChange={(checked) => 
                      handleCurrentlyWorking(checked as boolean, index)
                    }
                  />
                  <Label 
                    htmlFor={`currently-working-${index}`}
                    className="text-sm font-normal"
                  >
                    I currently work here
                  </Label>
                </div>
  
                <div className="col-span-2 mt-1">
                  <RichTextEditorExperience
                    jobTitle={item.title}
                    initialValue={item.workSummary || ""}
                    onEditorChange={(value: string) =>
                      handEditor(value, "workSummary", index)
                    }
                  />
                </div>
              </div>
              {index === experienceList.length - 1 &&
                experienceList.length < 5 && (
                  <div className="flex justify-end mt-4">
                    <Button
                      className="gap-1 mt-1 text-primary 
                          border-primary/50"
                      variant="outline"
                      type="button"
                      onClick={addNewExperience}
                    >
                      <Plus size="15px" />
                      Add More Experience
                    </Button>
                  </div>
                )}
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <Button
            type="submit"
            className="hover:motion-preset-confetti"
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

export default ExperienceForm;