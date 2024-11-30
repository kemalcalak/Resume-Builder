import RichTextEditorExperience from "@/components/editorExperience";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const ExperienceForm = (props: { handleNext: () => void }) => {
  const { handleNext } = props;
  const { resumeInfo, onUpdate } = useResumeContext();
  const { mutateAsync, isPending } = useUpdateDocument();

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

  const handleChange = (
    e: { target: { name: string; value: string } },
    index: number
  ) => {
    const { name, value } = e.target;
    setExperienceList((prevState) => {
      const newExperienceList = [...prevState];
      newExperienceList[index] = {
        ...newExperienceList[index],
        [name]: value,
      };
      return newExperienceList;
    });
  };

  const addNewExperience = () => {
    setExperienceList([...experienceList, initialState]);
  };

  const removeExperience = (index: number) => {
    const updatedExperience = [...experienceList];
    updatedExperience.splice(index, 1);
    setExperienceList(updatedExperience);
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
                              !bg-black dark:!bg-gray-600 text-white
                              "
                    size="icon"
                    onClick={() => removeExperience(index)}
                  >
                    <X size="13px" />
                  </Button>
                )}
                <div>
                  <Label className="text-sm">Position Title</Label>
                  <Input
                    name="title"
                    required
                    placeholder=""
                    value={item?.title || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>

                <div>
                  <Label className="text-sm">Company Name</Label>
                  <Input
                    name="companyName"
                    required
                    placeholder=""
                    value={item?.companyName || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>

                <div>
                  <Label className="text-sm">City</Label>
                  <Input
                    name="city"
                    required
                    placeholder=""
                    value={item?.city || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>

                <div>
                  <Label className="text-sm">Country</Label>
                  <Input
                    name="state"
                    required
                    placeholder=""
                    value={item?.state || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>

                <div>
                  <Label className="text-sm">Start Date</Label>
                  <Input
                    name="startDate"
                    type="date"
                    required
                    placeholder=""
                    value={item?.startDate || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>

                <div>
                  <Label className="text-sm">End Date</Label>
                  <Input
                    name="endDate"
                    type="date"
                    required
                    placeholder=""
                    value={item?.endDate || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>

                <div className="col-span-2 mt-1">
                  {/* {Work Summary} */}
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
