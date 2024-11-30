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

const initialState = {
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
  const [projectList, setProjectList] = useState(() => {
    return resumeInfo?.projects?.length ? resumeInfo.projects : [initialState];
  });

  useEffect(() => {
    if (!resumeInfo) return;
    onUpdate({
      ...resumeInfo,
      projects: projectList,
    });
  }, [projectList]);

  const handleChange = (
    e: { target: { name: string; value: string } },
    index: number
  ) => {
    const { name, value } = e.target;

    setProjectList((prevState) => {
      const newProjectList = [...prevState];
      newProjectList[index] = {
        ...newProjectList[index],
        [name]: value,
      };
      return newProjectList;
    });
  };

  const addNewProject = () => {
    setProjectList([...projectList, initialState]);
  };

  const removeProject = (index: number) => {
    const updatedProject = [...projectList];
    updatedProject.splice(index, 1);
    setProjectList(updatedProject);
  };

  const handEditor = (value: string, name: string, index: number) => {
    setProjectList((prevState) => {
      const newProjectList = [...prevState];
      newProjectList[index] = {
        ...newProjectList[index],
        [name]: value,
      };
      return newProjectList;
    });
  };

  const handleSubmit = useCallback(
    async (e: { preventDefault: () => void }) => {
      e.preventDefault();
      projectList.forEach((item, index) => {
        item.startDate = "2021-01-01";
        item.endDate = "2021-01-01";
      });

      const thumbnail = await generateThumbnail();
      const currentNo = resumeInfo?.currentPosition
        ? resumeInfo.currentPosition + 1
        : 1;

      await mutateAsync(
        {
          currentPosition: currentNo,
          thumbnail: thumbnail,
          project: projectList,
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
        <div className="border w-full h-auto divide-y-[1px] rounded-md px-3 pb-4 my-5">
          {projectList.map((item, index) => (
            <div key={index}>
              <div className="relative grid grid-cols-2 mb-5 pt-4 gap-3">
                {projectList?.length > 1 && (
                  <Button
                    variant="secondary"
                    type="button"
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
                  <Label className="text-sm">Project Name</Label>
                  <Input
                    name="projectName"
                    required
                    placeholder=""
                    value={item?.projectName || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>

                <div className="col-span-2 mt-1">
                  {/* {project Summary} */}
                  <RichTextEditorProject
                    projectName={item.projectName}
                    initialValue={item.projectSummary || ""}
                    onEditorChange={(value: string) =>
                      handEditor(value, "projectSummary", index)
                    }
                  />
                </div>
              </div>
              {index === projectList.length - 1 && projectList.length < 5 && (
                <div className="flex justify-end mt-4">
                  <Button
                    className="gap-1 mt-1 text-primary 
                          border-primary/50"
                    variant="outline"
                    type="button"
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

export default ProjectForm;
