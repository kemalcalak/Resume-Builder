import React, { useCallback, useEffect, useState } from "react";
import { useResumeContext } from "@/context/resume-info-provider";
import useUpdateDocument from "@/features/document/use-update-document";
import { INITIAL_THEME_COLOR, THEME_COLORS } from "@/constant/colors";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Palette, ChevronDown, Check } from "lucide-react";
import { generateThumbnail } from "@/lib/helper";
import { toast } from "@/hooks/use-toast";
import useDebounce from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

const ThemeColor = () => {
  const { resumeInfo, onUpdate } = useResumeContext();
  const { mutateAsync } = useUpdateDocument();

  const [selectedColor, setSelectedColor] = useState(INITIAL_THEME_COLOR);

  const debouncedColor = useDebounce<string>(selectedColor, 1000);

  useEffect(() => {
    if (debouncedColor) onSave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedColor]);

  const onColorSelect = useCallback(
    (color: string) => {
      setSelectedColor(color);

      if (!resumeInfo) return;
      onUpdate({
        ...resumeInfo,
        themeColor: color,
      });
    },
    [resumeInfo, onUpdate]
  );

  const onSave = useCallback(async () => {
    if (!selectedColor) return;
    if (selectedColor === INITIAL_THEME_COLOR) return;
    const thumbnail = await generateThumbnail();

    await mutateAsync(
      {
        themeColor: selectedColor,
        thumbnail: thumbnail,
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Theme updated successfully",
          });
        },
        onError() {
          toast({
            title: "Error",
            description: "Failed to update theme",
            variant: "destructive",
          });
        },
      }
    );
  }, [selectedColor]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={resumeInfo?.status === "archived"}
          variant="secondary"
          className="bg-white border gap-1
                   dark:bg-gray-800 !p-2
                    lg:w-auto lg:p-4"
        >
          <div className="flex items-center gap-1">
            <Palette size="17px" />
            <span className="hidden lg:flex">Theme</span>
          </div>
          <ChevronDown size="14px" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="bg-background"
      >
        <h2 className="mb-2 text-sm font-bold">
          Select Theme Color
        </h2>

        <div className="grid grid-cols-5 gap-3">
          {THEME_COLORS.map((color: string) => (
            <div
              role="button"
              key={color}
              onClick={() => onColorSelect(color)}
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center transition-all relative",
                "hover:scale-110 hover:border-2 hover:border-black/50",
                selectedColor === color 
                  ? "border-2 border-black scale-110 shadow-lg" 
                  : "border border-transparent"
              )}
              style={{ background: color }}
            >
              {selectedColor === color && (
                <div 
                  className="absolute inset-0 flex items-center justify-center" 
                  style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                >
                  <Check 
                    size={16} 
                    className="text-white drop-shadow-md" 
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ThemeColor;