import React, { useCallback, useEffect, useState } from "react";
import { useResumeContext } from "@/context/resume-info-provider";
import { Button } from "@/components/ui/button";
import { Loader, Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import useUpdateDocument from "@/features/document/use-update-document";
import { generateThumbnail } from "@/lib/helper";
import { toast } from "@/hooks/use-toast";
import RichTextEditorProject from "@/components/editorProject";

// Define an interface for validation errors
interface ValidationErrors {
  projectName?: string;
  projectSummary?: string;
  startDate?: string;
  endDate?: string;
}

// Create a type that extracts only the keys we want to validate
type ValidatableProjectKey = keyof ValidationErrors;

// Define a type for project entry with more explicit typing
interface ProjectEntry {
  id?: number;
  docId?: number | null;
  projectName: string | null;
  projectSummary: string | null;
  startDate: string | null;
  endDate: string | null;
  errors: ValidationErrors;
}

const initialState: Omit<ProjectEntry, 'errors'> = {
  id: undefined,
  docId: undefined,
  projectName: "",
  projectSummary: "",
  startDate: "",
  endDate: "",
};

const ProjectForm = (props: { handleNext: () => void }) => {
  const { handleNext } = props;
  const { resumeInfo, onUpdate } = useResumeContext();

  const { mutateAsync, isPending } = useUpdateDocument();

  // Modified state to include errors for each project entry
  const [projectList, setProjectList] = useState<ProjectEntry[]>(() => {
    return resumeInfo?.projects?.length
      ? resumeInfo.projects.map((project) => ({
          ...project,
          errors: {} as ValidationErrors,
        }))
      : [{ ...initialState, errors: {} as ValidationErrors }];
  });

  useEffect(() => {
    if (!resumeInfo) return;
    onUpdate({
      ...resumeInfo,
      projects: projectList.map((project) => {
        // Remove errors before updating
        const { errors, ...projectData } = project;
        return projectData;
      }),
    });
  }, [projectList]);

  // Validation function with improved type safety
  const validateField = (
    name: ValidatableProjectKey, 
    value: string | null | undefined, 
    projectEntry: ProjectEntry
  ): ValidationErrors => {
    const errors: ValidationErrors = {};

    // Required field validation
    const requiredFields: ValidatableProjectKey[] = [
      'projectName', 
      'projectSummary'
    ];

    if (requiredFields.includes(name) && (!value || value.trim() === '')) {
      errors[name] = `${
        name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1')
      } is required`;
    }

    // Date validation
    if (name === 'startDate' || name === 'endDate') {
      const startDate = name === 'startDate' ? value : projectEntry.startDate;
      const endDate = name === 'endDate' ? value : projectEntry.endDate;

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
  
    setProjectList((prevState) => {
      const newProjectList = [...prevState];
      const updatedProject = { 
        ...newProjectList[index], 
        [name]: value 
      };
  
      // Tüm alanlar için validasyonu çalıştır
      const allFieldErrors: ValidationErrors = {};
      const fieldsToValidate: ValidatableProjectKey[] = [
        'projectName', 
        'projectSummary', 
        'startDate', 
        'endDate'
      ];
  
      fieldsToValidate.forEach(field => {
        const fieldErrors = validateField(
          field, 
          updatedProject[field], 
          updatedProject
        );
        
        // Her alan için hata varsa ekle
        if (Object.keys(fieldErrors).length > 0) {
          allFieldErrors[field] = fieldErrors[field];
        }
      });
  
      // Güncellenmiş proje nesnesine hataları ekle
      updatedProject.errors = {
        ...allFieldErrors
      };
  
      newProjectList[index] = updatedProject;
      return newProjectList;
    });
  };

  const addNewProject = () => {
    setProjectList([
      ...projectList, 
      { 
        ...initialState, 
        errors: {} as ValidationErrors 
      }
    ]);
  };

  const removeProject = (index: number) => {
    const updatedProject = [...projectList];
    updatedProject.splice(index, 1);
    setProjectList(updatedProject);
  };

  const handEditor = (value: string, name: string, index: number) => {
    setProjectList((prevState) => {
      const newProjectList = [...prevState];
      const updatedProject = {
        ...newProjectList[index],
        [name]: value,
      };
  
      const allFieldErrors: ValidationErrors = {};
      const fieldsToValidate: ValidatableProjectKey[] = [
        'projectName', 
        'projectSummary', 
        'startDate', 
        'endDate'
      ];
  
      fieldsToValidate.forEach(field => {
        const fieldErrors = validateField(
          field, 
          updatedProject[field], 
          updatedProject
        );
        
        // Her alan için hata varsa ekle
        if (Object.keys(fieldErrors).length > 0) {
          allFieldErrors[field] = fieldErrors[field];
        }
      });
  
      // Güncellenmiş proje nesnesine hataları ekle
      updatedProject.errors = {
        ...allFieldErrors
      };
  
      newProjectList[index] = updatedProject;
      return newProjectList;
    });
  };

  const handleSubmit = useCallback(
    async (e: { preventDefault: () => void }) => {
      e.preventDefault();

      // Comprehensive validation before submission
      const validatedProjectList = projectList.map((project) => {
        const errors: ValidationErrors = {};

        // Validate all fields
        const fieldsToValidate: ValidatableProjectKey[] = [
          'projectName', 
          'projectSummary'
        ];

        fieldsToValidate.forEach(field => {
          const fieldErrors = validateField(
            field, 
            project[field], 
            project
          );
          Object.assign(errors, fieldErrors);
        });

        return {
          ...project,
          errors,
        };
      });

      // Check if there are any validation errors
      const hasErrors = validatedProjectList.some(
        (project) => Object.keys(project.errors).length > 0
      );

      // If there are errors, update the state and prevent submission
      if (hasErrors) {
        setProjectList(validatedProjectList);
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
          project: validatedProjectList.map(project => {
            // Remove errors before sending to backend
            const { errors, ...projectData } = project;
            return projectData;
          }),
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Project updated successfully",
            });
            handleNext();
          },
          onError() {
            toast({
              title: "Error",
              description: "Failed to update project",
              variant: "destructive",
            });
          },
        }
      );
    },
    [resumeInfo, projectList]
  );

  return (
    <div>
      <div className="w-full">
        <h2 className="font-bold text-lg">Project</h2>
        <p className="text-sm text-muted-foreground">
          Add your key projects and highlight your significant achievements and
          contributions
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div
          className="border w-full h-auto
              divide-y-[1px] rounded-md px-3 pb-4 my-5
              "
        >
          {projectList?.map((item, index) => (
            <div key={index}>
              <div
                className="relative grid grid-cols-2
                  mb-5 pt-4 gap-3
                  "
              >
                {projectList?.length > 1 && (
                  <Button
                    variant="secondary"
                    type="button"
                    disabled={isPending}
                    className="size-[20px] text-center
                rounded-full absolute -top-3 -right-5
                !bg-black dark:!bg-gray-600 text-white
                "
                    size="icon"
                    onClick={() => removeProject(index)}
                  >
                    <X size="13px" />
                  </Button>
                )}

                <div className="col-span-2">
                  <Label className="text-sm">
                    Project Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    name="projectName"
                    placeholder=""
                    value={item?.projectName || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                  {item?.errors?.projectName && (
                    <p className="text-red-500 text-xs mt-1">
                      {item.errors.projectName}
                    </p>
                  )}
                </div>

                <div className="col-span-2 mt-1">
                  <RichTextEditorProject
                    projectName={item.projectName || ""}
                    initialValue={item.projectSummary || ""}
                    onEditorChange={(value: string) =>
                      handEditor(value, "projectSummary", index)
                    }
                  />
                  {item?.errors?.projectSummary && (
                    <p className="text-red-500 text-xs mt-1">
                      {item.errors.projectSummary}
                    </p>
                  )}
                </div>
              </div>

              {index === projectList.length - 1 &&
                projectList.length < 5 && (
                  <div className="flex justify-end mt-4">
                    <Button
                      className="gap-1 mt-1 text-primary 
                          border-primary/50"
                      variant="outline"
                      type="button"
                      disabled={isPending}
                      onClick={addNewProject}
                    >
                      <Plus size="15px" />
                      Add More Project
                    </Button>
                  </div>
                )}
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <Button 
            className="hover:motion-preset-confetti" 
            type="submit" 
            disabled={isPending}
          >
            {isPending && <Loader size="15px" className="animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;