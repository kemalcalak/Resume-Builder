import React, { useCallback, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { DownloadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { formatFileName } from "@/lib/helper";
import { StatusType } from "@/types/resume.type";
import { useTheme } from "next-themes";

const Download = (props: {
  title: string;
  isLoading: boolean;
  status?: StatusType;
}) => {
  const { title, status, isLoading } = props;
  const [loading, setLoading] = useState(false);
  const { theme, systemTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    // Determine the actual system theme
    setCurrentTheme(theme === "system" ? systemTheme : theme);
  }, [theme, systemTheme]);

  const handleDownload = useCallback(async () => {
    const resumeElement = document.getElementById("resume-preview-id");
    if (!resumeElement) {
      toast({
        title: "Error",
        description: "Could not download",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const fileName = formatFileName(title);
    try {
      // Dark theme control
      if (currentTheme === "dark") {
        toast({
          title: "Error",
          description: "Please switch to light mode to download",
          variant: "destructive",
        });
        return;
      }

      const canvas = await html2canvas(resumeElement, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 210; // A4 size in mm
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error generating PDF",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [title, currentTheme]);

  return (
    <Button
      disabled={isLoading || loading || status === "archived" ? true : false}
      variant="secondary"
      className="bg-white border gap-1
                   dark:bg-gray-800 !p-2
                    min-w-9 lg:min-w-auto lg:p-4"
      onClick={handleDownload}
    >
      <div className="flex items-center gap-1">
        <DownloadCloud size="17px" />
        <span className="hidden lg:flex">
          {loading ? "Generating PDF" : "Download Resume"}
        </span>
      </div>
    </Button>
  );
};

export default Download;
