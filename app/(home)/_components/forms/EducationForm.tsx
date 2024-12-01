import React, { useCallback, useEffect, useState } from "react";
import { useResumeContext } from "@/context/resume-info-provider";
import { Button } from "@/components/ui/button";
import { Loader, Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import useUpdateDocument from "@/features/document/use-update-document";
import { generateThumbnail } from "@/lib/helper";
import { toast } from "@/hooks/use-toast";
import RichTextEditorEducation from "@/components/editorEducation";

// Define an interface for validation errors
interface ValidationErrors {
  universityName?: string;
  degree?: string;
  major?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

// Create a type that extracts only the keys we want to validate
type ValidatableEducationKey = keyof ValidationErrors;

// Define a type for education entry with more explicit typing
interface EducationEntry {
  id?: number;
  docId?: number | null;
  universityName: string | null;
  startDate: string | null;
  endDate: string | null;
  degree: string | null;
  major: string | null;
  description: string | null;
  errors: ValidationErrors;
}

const initialState: Omit<EducationEntry, 'errors'> = {
  id: undefined,
  docId: undefined,
  universityName: "",
  startDate: "",
  endDate: "",
  degree: "",
  major: "",
  description: "",
};

const EducationForm = (props: { handleNext: () => void }) => {
  const { handleNext } = props;
  const { resumeInfo, onUpdate } = useResumeContext();

  const { mutateAsync, isPending } = useUpdateDocument();

  // Modified state to include errors for each education entry
  const [educationList, setEducationList] = useState<EducationEntry[]>(() => {
    return resumeInfo?.educations?.length
      ? resumeInfo.educations.map((edu) => ({
          ...edu,
          errors: {} as ValidationErrors,
        }))
      : [{ ...initialState, errors: {} as ValidationErrors }];
  });

  useEffect(() => {
    if (!resumeInfo) return;
    onUpdate({
      ...resumeInfo,
      educations: educationList.map((edu) => {
        // Remove errors before updating
        const { errors, ...educationData } = edu;
        return educationData;
      }),
    });
  }, [educationList]);

  // Validation function with improved type safety
  const validateField = (
    name: ValidatableEducationKey, 
    value: string | null | undefined, 
    educationEntry: EducationEntry
  ): ValidationErrors => {
    const errors: ValidationErrors = {};

    // Required field validation
    const requiredFields: ValidatableEducationKey[] = [
      'universityName', 
      'degree', 
      'major', 
      'startDate', 
      'endDate'
    ];

    if (requiredFields.includes(name) && (!value || value.trim() === '')) {
      errors[name] = `${
        name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1')
      } is required`;
    }

    // Date validation
    if (name === 'startDate' || name === 'endDate') {
      const startDate = name === 'startDate' ? value : educationEntry.startDate;
      const endDate = name === 'endDate' ? value : educationEntry.endDate;

      if (startDate && endDate) {
        if (new Date(endDate) < new Date(startDate)) {
          errors.startDate = "Start date cannot be after end date";
          errors.endDate = "End date cannot be before start date";
        }
      }
    }

    return errors;
  };

  const handleChange = (
    e: { target: { name: string; value: string } },
    index: number
  ) => {
    const { name, value } = e.target;
  
    // Validatable keys için type guard
    const isValidatableKey = (key: string): key is ValidatableEducationKey => {
      return [
        'universityName', 
        'degree', 
        'major', 
        'startDate', 
        'endDate', 
        'description'
      ].includes(key);
    };
  
    setEducationList((prevState) => {
      const newEducationList = [...prevState];
      const updatedEducation = { 
        ...newEducationList[index], 
        [name]: value 
      } as EducationEntry;
  
      // Her alan için mutlaka validasyon yap
      if (isValidatableKey(name)) {
        // Tüm gerekli alanları her seferinde kontrol et
        const fieldsToValidate: ValidatableEducationKey[] = [
          'universityName', 
          'degree', 
          'major', 
          'startDate', 
          'endDate'
        ];
  
        const allErrors: ValidationErrors = {};
        fieldsToValidate.forEach(field => {
          const fieldErrors = validateField(
            field, 
            updatedEducation[field], 
            updatedEducation
          );
          Object.assign(allErrors, fieldErrors);
        });
        
        updatedEducation.errors = allErrors;
      }
  
      newEducationList[index] = updatedEducation;
      return newEducationList;
    });
  };

  const addNewEducation = () => {
    setEducationList([
      ...educationList, 
      { 
        ...initialState, 
        errors: {} as ValidationErrors 
      }
    ]);
  };

  const removeEducation = (index: number) => {
    const updatedEducation = [...educationList];
    updatedEducation.splice(index, 1);
    setEducationList(updatedEducation);
  };

  const handEditor = (value: string, name: string, index: number) => {
    setEducationList((prevState) => {
      const newEducationList = [...prevState];
      newEducationList[index] = {
        ...newEducationList[index],
        [name]: value,
      };
      return newEducationList;
    });
  };

  const handleSubmit = useCallback(
    async (e: { preventDefault: () => void }) => {
      e.preventDefault();

      // Comprehensive validation before submission
      const validatedEducationList = educationList.map((edu) => {
        const errors: ValidationErrors = {};

        // Validate all fields
        const fieldsToValidate: ValidatableEducationKey[] = [
          'universityName', 
          'degree', 
          'major', 
          'startDate', 
          'endDate'
        ];

        fieldsToValidate.forEach(field => {
          const fieldErrors = validateField(
            field, 
            edu[field], 
            edu
          );
          Object.assign(errors, fieldErrors);
        });

        return {
          ...edu,
          errors,
        };
      });

      // Check if there are any validation errors
      const hasErrors = validatedEducationList.some(
        (edu) => Object.keys(edu.errors).length > 0
      );

      // If there are errors, update the state and prevent submission
      if (hasErrors) {
        setEducationList(validatedEducationList);
        toast({
          title: "Validation Error",
          description: "Please correct the errors in the form",
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
          education: validatedEducationList.map(edu => {
            // Remove errors before sending to backend
            const { errors, ...educationData } = edu;
            return educationData;
          }),
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Education updated successfully",
            });
            handleNext();
          },
          onError() {
            toast({
              title: "Error",
              description: "Failed to update education",
              variant: "destructive",
            });
          },
        }
      );
    },
    [resumeInfo, educationList]
  );

  return (
    <div>
      <div className="w-full">
        <h2 className="font-bold text-lg">Education</h2>
        <p className="text-sm text-muted-foreground">
          Add your educational background details
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div
          className="border w-full h-auto
              divide-y-[1px] rounded-md px-3 pb-4 my-5
              "
        >
          {educationList?.map((item, index) => (
            <div key={index}>
              <div
                className="relative grid gride-cols-2
                  mb-5 pt-4 gap-3
                  "
              >
                {educationList?.length > 1 && (
                  <Button
                    variant="secondary"
                    type="button"
                    disabled={isPending}
                    className="size-[20px] text-center
                rounded-full absolute -top-3 -right-5
                !bg-black dark:!bg-gray-600 text-white
                "
                    size="icon"
                    onClick={() => removeEducation(index)}
                  >
                    <X size="13px" />
                  </Button>
                )}

                <div className="col-span-2">
                  <Label className="text-sm">
                    Institution Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    name="universityName"
                    placeholder="e.g., Harvard University"
                    value={item?.universityName || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                  {item?.errors?.universityName && (
                    <p className="text-red-500 text-xs mt-1">
                      {item.errors.universityName}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-sm">
                    Degree Type <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    name="degree"
                    placeholder="e.g., Bachelor of Science"
                    value={item?.degree || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                  {item?.errors?.degree && (
                    <p className="text-red-500 text-xs mt-1">
                      {item.errors.degree}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-sm">
                    Field of Study <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    name="major"
                    placeholder="e.g., Computer Science"
                    value={item?.major || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                  {item?.errors?.major && (
                    <p className="text-red-500 text-xs mt-1">
                      {item.errors.major}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-sm">
                    Program Start Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    name="startDate"
                    type="date"
                    placeholder="Select start date"
                    value={item?.startDate || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                  {item?.errors?.startDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {item.errors.startDate}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-sm">
                    Program End Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    name="endDate"
                    type="date"
                    placeholder="Select end date"
                    value={item?.endDate || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                  {item?.errors?.endDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {item.errors.endDate}
                    </p>
                  )}
                </div>
                <div className="col-span-2 mt-1">
                  <RichTextEditorEducation
                    major={item.major || ""}
                    initialValue={item.description || ""}
                    onEditorChange={(value: string) =>
                      handEditor(value, "description", index)
                    }
                  />
                </div>
              </div>

              {index === educationList.length - 1 &&
                educationList.length < 5 && (
                  <div className="flex justify-end mt-4">
                    <Button
                      className="gap-1 mt-1 text-primary 
                          border-primary/50"
                      variant="outline"
                      type="button"
                      disabled={isPending}
                      onClick={addNewEducation}
                    >
                      <Plus size="15px" />
                      Add More Education
                    </Button>
                  </div>
                )}
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <Button className="hover:motion-preset-confetti" type="submit" disabled={isPending}>
            {isPending && <Loader size="15px" className="animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EducationForm;