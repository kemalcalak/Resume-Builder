import React, { useCallback, useEffect, useState } from "react";
import { useResumeContext } from "@/context/resume-info-provider";
import { Button } from "@/components/ui/button";
import { Loader, Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import useUpdateDocument from "@/features/document/use-update-document";
import { generateThumbnail } from "@/lib/helper";
import { toast } from "@/hooks/use-toast";

// Define an interface for validation errors
interface ValidationErrors {
  certificateName?: string;
  teacher?: string;
  issuingOrganization?: string;
  issueDate?: string;
}

// Create a type that extracts only the keys we want to validate
type ValidatableCertificateKey = keyof ValidationErrors;

// Define a type for certificate entry with more explicit typing
interface CertificateEntry {
  id?: number;
  docId?: number | null;
  certificateName: string | null;
  teacher: string | null;
  whoGave: string | null;
  issueDate: string | null;
  errors: ValidationErrors;
}

const initialState: Omit<CertificateEntry, 'errors'> = {
  id: undefined,
  docId: undefined,
  certificateName: "",
  teacher: "",
  whoGave: "",
  issueDate: "",
};

const CertificateForm = (props: { handleNext: () => void }) => {
  const { handleNext } = props;
  const { resumeInfo, onUpdate } = useResumeContext();

  const { mutateAsync, isPending } = useUpdateDocument();

  // Modified state to include errors for each certificate entry
  const [certificateList, setCertificateList] = useState<CertificateEntry[]>(() => {
    return resumeInfo?.certificates?.length
      ? resumeInfo.certificates.map((cert) => ({
          ...cert,
          errors: {} as ValidationErrors,
        }))
      : [{ ...initialState, errors: {} as ValidationErrors }];
  });

  useEffect(() => {
    if (!resumeInfo) return;
    onUpdate({
      ...resumeInfo,
      certificates: certificateList.map((cert) => {
        // Remove errors before updating
        const { errors, ...certData } = cert;
        return certData;
      }),
    });
  }, [certificateList]);

  // Validation function with improved type safety
  const validateField = (
    name: ValidatableCertificateKey, 
    value: string | null | undefined, 
    certificateEntry: CertificateEntry
  ): ValidationErrors => {
    const errors: ValidationErrors = {};

    // Required field validation
    const requiredFields: ValidatableCertificateKey[] = [
      'certificateName', 
      'teacher', 
      'issuingOrganization',
      'issueDate'
    ];

    if (requiredFields.includes(name) && (!value || value.trim() === '')) {
      errors[name] = `${
        name.charAt(0).toUpperCase() + 
        name.slice(1).replace(/([A-Z])/g, ' $1')
      } is required`;
    }

    // Date validation
    if (name === 'issueDate') {
      if (value) {
        const issueDate = new Date(value);
        const currentDate = new Date();

        if (issueDate > currentDate) {
          errors.issueDate = "Issue date cannot be in the future";
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
  
    setCertificateList((prevState) => {
      const newCertificateList = [...prevState];
      const updatedCertificate = { 
        ...newCertificateList[index], 
        [name]: value 
      };
  
      // Validate all fields
      const allFieldErrors: ValidationErrors = {};
      const fieldsToValidate: ValidatableCertificateKey[] = [
        'certificateName', 
        'teacher', 
        'issuingOrganization',
        'issueDate'
      ];
  
      fieldsToValidate.forEach(field => {
        const fieldErrors = validateField(
          field, 
          updatedCertificate[field === 'issuingOrganization' ? 'whoGave' : field], 
          updatedCertificate
        );
        
        // Add errors for each field
        if (Object.keys(fieldErrors).length > 0) {
          allFieldErrors[field] = fieldErrors[field];
        }
      });
  
      // Add errors to the updated certificate object
      updatedCertificate.errors = {
        ...allFieldErrors
      };
  
      newCertificateList[index] = updatedCertificate;
      return newCertificateList;
    });
  };

  const addNewCertificate = () => {
    setCertificateList([
      ...certificateList, 
      { 
        ...initialState, 
        errors: {} as ValidationErrors 
      }
    ]);
  };

  const removeCertificate = (index: number) => {
    const updatedCertificate = [...certificateList];
    updatedCertificate.splice(index, 1);
    setCertificateList(updatedCertificate);
  };

  const handleSubmit = useCallback(
    async (e: { preventDefault: () => void }) => {
      e.preventDefault();

      // Comprehensive validation before submission
      const validatedCertificateList = certificateList.map((cert) => {
        const errors: ValidationErrors = {};

        // Validate all fields
        const fieldsToValidate: ValidatableCertificateKey[] = [
          'certificateName', 
          'teacher', 
          'issuingOrganization',
          'issueDate'
        ];

        fieldsToValidate.forEach(field => {
          const fieldErrors = validateField(
            field, 
            field === 'issuingOrganization' ? cert.whoGave : cert[field], 
            cert
          );
          Object.assign(errors, fieldErrors);
        });

        return {
          ...cert,
          errors,
        };
      });

      // Check if there are any validation errors
      const hasErrors = validatedCertificateList.some(
        (cert) => Object.keys(cert.errors).length > 0
      );

      // If there are errors, update the state and prevent submission
      if (hasErrors) {
        setCertificateList(validatedCertificateList);
        toast({
          title: "Validation Error",
          description: "Please correct the errors in the form",
          variant: "destructive",
        });
        return;
      }

      const thumbnail = await generateThumbnail();

      await mutateAsync(
        {
          currentPosition: 1,
          thumbnail: thumbnail,
          certificate: validatedCertificateList.map(cert => {
            const { errors, ...certData } = cert;
            return certData;
          }),
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Certificates updated successfully",
            });
            handleNext();
          },
          onError() {
            toast({
              title: "Error",
              description: "Failed to update certificates",
              variant: "destructive",
            });
          },
        }
      );
    },
    [resumeInfo]
  );

  return (
    <div>
      <div className="w-full">
        <h2 className="font-bold text-lg">Certifications</h2>
        <p className="text-sm text-muted-foreground">
          Showcase your professional development and specialized skills through your certifications.
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="border w-full h-auto divide-y-[1px] rounded-md px-3 pb-4 my-5">
          {certificateList.map((item, index) => (
            <div key={index}>
              <div className="relative grid grid-cols-2 mb-5 pt-4 gap-3">
                {certificateList?.length > 1 && (
                  <Button
                    variant="secondary"
                    type="button"
                    className="size-[20px] text-center
                              rounded-full absolute -top-3 -right-5
                              !bg-black dark:!bg-gray-600 text-white
                              "
                    size="icon"
                    onClick={() => removeCertificate(index)}
                  >
                    <X size="13px" />
                  </Button>
                )}
                <div className="col-span-2">
                  <Label className="text-sm">
                    Certification Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    name="certificateName"
                    placeholder="e.g., AWS Certified Solutions Architect"
                    value={item?.certificateName || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                  {item?.errors?.certificateName && (
                    <p className="text-red-500 text-xs mt-1">
                      {item.errors.certificateName}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-sm">
                    Instructor/Trainer Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    name="teacher"
                    placeholder="Name of the instructor or trainer"
                    value={item?.teacher || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                  {item?.errors?.teacher && (
                    <p className="text-red-500 text-xs mt-1">
                      {item.errors.teacher}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-sm">
                    Certification Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    name="issueDate"
                    type="date"
                    placeholder="Date of certification"
                    value={item?.issueDate || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                  {item?.errors?.issueDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {item.errors.issueDate}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <Label className="text-sm">
                    Issuing Organization <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    name="whoGave"
                    placeholder="Organization that issued the certification"
                    value={item?.whoGave || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                  {item?.errors?.issuingOrganization && (
                    <p className="text-red-500 text-xs mt-1">
                      {item.errors.issuingOrganization}
                    </p>
                  )}
                </div>
                
              </div>
              {index === certificateList.length - 1 &&
                certificateList.length < 10 && (
                  <div className="flex justify-end mt-4">
                    <Button
                      className="gap-1 mt-1 text-primary 
                          border-primary/50"
                      variant="outline"
                      type="button"
                      onClick={addNewCertificate}
                    >
                      <Plus size="15px" />
                      Add Another Certification
                    </Button>
                  </div>
                )}
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <Button className="mt-4" type="submit" disabled={isPending}>
            {isPending && <Loader size="15px" className="animate-spin" />}
            Save Certifications
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CertificateForm;