import React, { useState } from "react";
import {
  EditorProvider,
  Editor,
  Toolbar,
  BtnBold,
  BtnItalic,
  BtnUnderline,
  BtnStrikeThrough,
  Separator,
  BtnNumberedList,
  BtnBulletList,
  BtnLink,
} from "react-simple-wysiwyg";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Loader, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AIChatSession } from "@/lib/google-ai-model";

const prompt = `Given the job title "{jobTitle}",
 create 4-5 concise (maximum 100 characters) and personal bullet points in
  HTML stringify format that highlight my key
  skills, relevant technologies, and significant
   contributions in that role. Do not include
    the job title itself in the output. Provide
     only the bullet points inside an unordered
     list.`;

const RichTextEditorExperience = (props: {
  jobTitle: string | null;
  initialValue: string | null;
  onEditorChange: (e: any) => void;
}) => {
  const { jobTitle, initialValue, onEditorChange } = props;

  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(initialValue || "");

  const GenerateSummaryFromAI = async () => {
    try {
      if (!jobTitle) {
        toast({
          title: "Must provide Job Postion",
          variant: "destructive",
        });
        return;
      }
      setLoading(true);
      const PROMPT = prompt.replace("{jobTitle}", jobTitle);
      const result = await AIChatSession.sendMessage(PROMPT);
      const responseText = await result.response.text();

      const validJsonArray = JSON.parse(responseText);
      if (validJsonArray?.bulletPoints) {
        const validJsonArrayBullet = validJsonArray?.bulletPoints;
        setValue(validJsonArrayBullet);
        onEditorChange(validJsonArrayBullet);
      } else {
        throw new Error("Failed to generate summary");
      }
    } catch (error) {
      toast({
        title: "Failed to generate summary",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex item-center justify-between my-2">
        <Label>Work Summary <span className="text-red-500">*</span></Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex items-center gap-2 hover:motion-preset-pulse hover:motion-duration-1500"
          disabled={loading}
          onClick={GenerateSummaryFromAI}
        >
          <>
            <Sparkles size={14} className="text-primary" />
            Generate with Gemini
          </>
          {loading && <Loader size="13px" className="animate-spin" />}
        </Button>
      </div>
      <EditorProvider>
        <Editor
          value={value}
          containerProps={{
            style: {
              resize: "vertical",
              lineHeight: 1.2,
              fontSize: "13.5px",
            },
          }}
          onChange={(e) => {
            setValue(e.target.value);
            onEditorChange(e.target.value);
          }}
        >
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  );
};

export default RichTextEditorExperience;
