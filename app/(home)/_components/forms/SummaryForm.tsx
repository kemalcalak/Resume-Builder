"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useResumeContext } from "@/context/resume-info-provider";
import useUpdateDocument from "@/features/document/use-update-document";
import { toast } from "@/hooks/use-toast";
import { AIChatSession } from "@/lib/google-ai-model";
import { generateThumbnail } from "@/lib/helper";
import { ResumeDataType } from "@/types/resume.type";
import { Loader, Sparkles, X } from "lucide-react";
import React, { useCallback, useState } from "react";

interface GeneratesSummaryType {
  junior: string;
  mid: string;
  senior: string;
}

interface FormErrors {
  summary?: string;
}

const prompt = `Hey there! I'm working on crafting the perfect resume summary for a {jobTitle} position. Could you help me create three versions that capture different career stages?

I want a summary that:
- Highlights my technical skills 
- Showcases my technologies
- Demonstrates my professional journey
- Shows how I bring value to team projects

Please respond in this exact JSON format:
{
  "junior": "Energetic tech enthusiast with passion for [specific technologies], eager to contribute innovative solutions.",
  "mid": "Skilled technology professional delivering impactful projects, combining technical expertise with collaborative problem-solving.",
  "senior": "Strategic technology leader driving innovation, mentoring teams, and delivering enterprise-level solutions."
}

Tailored specifically to a {jobTitle} role.`;

const SummaryForm = (props: { handleNext: () => void }) => {
  const { handleNext } = props;
  const { resumeInfo, onUpdate } = useResumeContext();
  const { mutateAsync, isPending } = useUpdateDocument();

  const [loading, setLoading] = useState(false);
  const [aiGeneratedSummary, setAiGeneratedSummary] = useState<GeneratesSummaryType | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!resumeInfo?.summary?.trim()) {
      newErrors.summary = "Summary is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: { target: { value: string } }) => {
    const { value } = e.target;
    const resumeDataInfo = resumeInfo as ResumeDataType;
    const updatedInfo = {
      ...resumeDataInfo,
      summary: value,
    };
    onUpdate(updatedInfo);
    
    // Clear errors when user starts typing
    if (errors.summary) {
      setErrors({});
    }
  };

  const handleSubmit = useCallback(
    async (e: { preventDefault: () => void }) => {
      e.preventDefault();
      if (!resumeInfo) return;

      // Validate before submission
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
        ? resumeInfo?.currentPosition + 1
        : 1;

      try {
        await mutateAsync(
          {
            currentPosition: currentNo,
            thumbnail: thumbnail,
            summary: resumeInfo?.summary,
          },
          {
            onSuccess: () => {
              toast({
                title: "Success",
                description: "Summary updated successfully",
              });
              handleNext();
            },
            onError() {
              toast({
                title: "Error",
                description: "Failed to update summary",
                variant: "destructive",
              });
            },
          }
        );
      } catch (error) {
        setErrors({ summary: "Failed to save summary. Please try again." });
      }
    },
    [resumeInfo, mutateAsync, handleNext]
  );

  const GenerateSummaryFromAI = async () => {
    try {
      const jobTitle = resumeInfo?.personalInfo?.jobTitle;
      if (!jobTitle) {
        setErrors({ summary: "Job title is required to generate AI summary" });
        return;
      }
      setLoading(true);
      const PROMPT = prompt.replaceAll("{jobTitle}", jobTitle);
      const result = await AIChatSession.sendMessage(PROMPT);
      const responseText = await result.response.text();
      const generatedSummary = JSON?.parse(responseText);
      setAiGeneratedSummary(generatedSummary);
      setShowSuggestions(true);
    } catch (error) {
      toast({
        title: "Failed to generate summary",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = useCallback(
    (summary: string) => {
      if (!resumeInfo) return;
      const resumeDataInfo = resumeInfo as ResumeDataType;
      const updatedInfo = {
        ...resumeDataInfo,
        summary: summary,
      };
      onUpdate(updatedInfo);
      setAiGeneratedSummary(null);
      setShowSuggestions(false);
      setErrors({}); // Clear any existing errors
    },
    [onUpdate, resumeInfo]
  );

  const isSubmitDisabled = () => {
    return isPending || 
           loading || 
           resumeInfo?.status === "archived" || 
           Boolean(errors.summary);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold">Resume Summary</h2>
        <p className="text-sm text-muted-foreground">
          Write a concise summary that highlights your  profile
        </p>
      </div>

      {!showSuggestions ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Your Summary <span className="text-red-500">*</span></Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={GenerateSummaryFromAI}
              disabled={loading || isPending}
            >
              <Sparkles size={14} className="text-primary" />
              Generate with Gemini
            </Button>
          </div>

          <div className="space-y-1">
            <Textarea
              className={`min-h-[200px] ${errors.summary ? 'border-red-500' : ''}`}
              placeholder="Write your professional summary here..."
              value={resumeInfo?.summary || ""}
              onChange={handleChange}
            />
            {errors.summary && (
              <p className="text-red-500 text-xs mt-1">{errors.summary}</p>
            )}
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
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-semibold">AI Summary Suggestions</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowSuggestions(false)}
            >
              <X size={20} />
            </Button>
          </div>

          {aiGeneratedSummary && Object.entries(aiGeneratedSummary).map(
            ([experienceType, summary], index) => (
              <div 
                key={index}
                className="border rounded-lg p-4 hover:bg-accent transition-colors cursor-pointer"
                onClick={() => handleSelect(summary)}
              >
                <div className="text-sm font-semibold mb-2 capitalize">
                  {experienceType} Level
                </div>
                <p className="text-sm">{summary}</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default SummaryForm;