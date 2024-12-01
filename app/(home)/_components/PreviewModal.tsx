import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useResumeContext } from "@/context/resume-info-provider";
import { Eye, FileText, X } from "lucide-react";
import React from "react";
import ResumePreview from "./ResumePreview";

const PreviewModal = () => {
  const { resumeInfo, isLoading } = useResumeContext();

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            disabled={
              isLoading || resumeInfo?.status === "archived" ? true : false
            }
            variant="secondary"
            className="bg-white border gap-1
                   dark:bg-gray-800 
                   !p-2 w-9
                   lg:w-auto lg:p-2
                   flex items-center justify-center"
          >
            <div className="flex items-center gap-1">
              <Eye size="17px" />
              <span className="hidden lg:flex">Preview</span>
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent
          className="
            sm:max-w-4xl 
            p-0
            w-[95vw]
            max-w-[210mm]
            max-h-[90vh]
            lg:max-h-[95vh]
            overflow-y-auto
            rounded-lg
          "
        >
          <DialogHeader
            className="
              sticky top-0 
              backdrop-blur 
              bg-white/90
              dark:bg-black/90 
              z-10 
              flex flex-row 
              items-center 
              justify-between
              px-4 
              py-3
              border-b
            "
          >
            <DialogTitle
              className="
                flex 
                items-center 
                gap-2 
                text-lg 
                font-semibold
              "
            >
              <FileText
                size="20px"
                className="stroke-primary"
              />
              <span className="truncate max-w-[70vw]">
                {resumeInfo?.title || 'Resume Preview'}
              </span>
            </DialogTitle>
            <DialogClose 
              className="
                rounded-sm 
                opacity-70 
                hover:opacity-100 
                focus:outline-none 
                focus:ring-2 
                focus:ring-ring 
                focus:ring-offset-2
              "
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          <div className="w-full h-full px-2 sm:px-4 pb-4">
            <ResumePreview />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PreviewModal;