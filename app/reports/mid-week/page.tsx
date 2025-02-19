"use client";

import type React from "react";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { prisma } from "@/lib/prisma";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type FormData = {
  studentName: string;
  studentId: string;
  organization: string;
  supervisor: string;
  dateOfVisit: Date | undefined;
  selfAssessment: string[];
  studentComments: string;
  studentSignature: string;
};

type FormErrors = {
  [K in keyof FormData]?: string;
};

export default function InternshipReviewForm() {
  const [formData, setFormData] = useState<FormData>({
    studentName: "",
    studentId: "",
    organization: "",
    supervisor: "",
    dateOfVisit: undefined,
    selfAssessment: ["", "", "", "", ""],
    studentComments: "",
    studentSignature: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false); // Track submission status

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelfAssessmentChange = (index: number, value: string) => {
    const newSelfAssessment = [...formData.selfAssessment];
    newSelfAssessment[index] = value;
    setFormData((prev) => ({ ...prev, selfAssessment: newSelfAssessment }));
    if (errors.selfAssessment) {
      setErrors((prev) => ({ ...prev, selfAssessment: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};

    if (!formData.studentName)
      newErrors.studentName = "Student Name is required";
    if (!formData.studentId) newErrors.studentId = "Student ID is required";
    if (!formData.organization)
      newErrors.organization = "Organization Name is required";
    if (!formData.supervisor)
      newErrors.supervisor = "Industry Supervisor Name is required";
    if (!formData.dateOfVisit)
      newErrors.dateOfVisit = "Date of Visit is required";
    if (formData.selfAssessment.some((item) => !item))
      newErrors.selfAssessment = "All self-assessment fields are required";
    if (!formData.studentComments)
      newErrors.studentComments = "Write some comment";
    if (!formData.studentSignature)
      newErrors.studentSignature =
        "Signature Required. Please provide your signature to proceed";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        const response = await fetch("/submitReports", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        console.log("form data,", response);
        if (response.ok) {
          // Show success message
          setIsSubmitted(true);

          // Reset form and errors after successful submission
          setFormData({
            studentName: "",
            studentId: "",
            organization: "",
            supervisor: "",
            dateOfVisit: undefined,
            selfAssessment: ["", "", "", "", ""],
            studentComments: "",
            studentSignature: "",
          });
          setErrors({});
        } else {
          const errorData = await response.json();
          console.error("Error submitting form:", errorData);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
  };

  return (
    <div className="container mx-auto my-8 p-6 max-w-4xl border border-gray-200 rounded-lg bg-white shadow-sm">
      <h1 className="text-2xl font-bold mb-2">
        ICT80004 Mid-Internship Project Review Form - Check In
      </h1>
      <p className="text-gray-500 mb-6">
        To be discussed during the mid-semester visit and submitted to Canvas by
        week 8.
      </p>
      {isSubmitted && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          Form submitted successfully!
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="studentName">Student Name *</Label>
            <Input
              id="studentName"
              name="studentName"
              value={formData.studentName}
              onChange={handleInputChange}
              placeholder="Enter student name"
              className={errors.studentName ? "border-red-500" : ""}
            />
            {errors.studentName && (
              <p className="text-red-500 text-sm mt-1">{errors.studentName}</p>
            )}
          </div>
          <div>
            <Label htmlFor="studentId">ID *</Label>
            <Input
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleInputChange}
              placeholder="Enter student ID"
              className={errors.studentId ? "border-red-500" : ""}
            />
            {errors.studentId && (
              <p className="text-red-500 text-sm mt-1">{errors.studentId}</p>
            )}
          </div>
          <div>
            <Label htmlFor="organization">Organization *</Label>
            <Input
              id="organization"
              name="organization"
              value={formData.organization}
              onChange={handleInputChange}
              placeholder="Enter organization"
              className={errors.organization ? "border-red-500" : ""}
            />
            {errors.organization && (
              <p className="text-red-500 text-sm mt-1">{errors.organization}</p>
            )}
          </div>
          <div>
            <Label htmlFor="supervisor">Industry Supervisor *</Label>
            <Input
              id="supervisor"
              name="supervisor"
              value={formData.supervisor}
              onChange={handleInputChange}
              placeholder="Enter supervisor name"
              className={errors.supervisor ? "border-red-500" : ""}
            />
            {errors.supervisor && (
              <p className="text-red-500 text-sm mt-1">{errors.supervisor}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="dateOfVisit">Date of Visit *</Label>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.dateOfVisit && "text-muted-foreground",
                    errors.dateOfVisit && "border-red-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dateOfVisit ? (
                    format(formData.dateOfVisit, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.dateOfVisit}
                  onSelect={(date) => {
                    setFormData((prev) => ({ ...prev, dateOfVisit: date }));
                    if (errors.dateOfVisit) {
                      setErrors((prev) => ({
                        ...prev,
                        dateOfVisit: undefined,
                      }));
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.dateOfVisit && (
              <p className="text-red-500 text-sm mt-1">{errors.dateOfVisit}</p>
            )}
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          Student Self-Assessment: Rate how well you are achieving the following
          knowledge by ticking on the appropriate box. *
        </h2>

        <div className="space-y-6">
          {[
            "Awareness of a range of issues associated with professional practice",
            "Professional and personal skills",
            "Practical skills and theoretical knowledge into an IT industry context",
            "Understanding of business processes and organizational structures",
            "Professional contacts and networks within the IT industry",
          ].map((item, index) => (
            <div key={index} className="space-y-2">
              <p className="font-medium">
                {index + 1}. {item}
              </p>
              <RadioGroup
                value={formData.selfAssessment[index]}
                onValueChange={(value) =>
                  handleSelfAssessmentChange(index, value)
                }
                className={
                  errors.selfAssessment
                    ? "border border-red-500 rounded-md p-2"
                    : ""
                }
              >
                <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id={`none-${index}`} />
                    <Label htmlFor={`none-${index}`}>None</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="some" id={`some-${index}`} />
                    <Label htmlFor={`some-${index}`}>Some</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="well" id={`well-${index}`} />
                    <Label htmlFor={`well-${index}`}>Well</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          ))}
        </div>
        {errors.selfAssessment && (
          <p className="text-red-500 text-sm mt-1">{errors.selfAssessment}</p>
        )}

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Student Comments (to be completed prior to the mid-semester visit)
              *
            </h3>
            <Textarea
              name="studentComments"
              value={formData.studentComments}
              onChange={handleInputChange}
              placeholder="Enter your comments here"
              className={cn(
                "min-h-[100px]",
                errors.studentComments && "border-red-500"
              )}
            />
            {errors.studentComments && (
              <p className="text-red-500 text-sm mt-1">
                {errors.studentComments}
              </p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">
              Industry Supervisor Comments (to be completed prior or during the
              mid-semester visit)
            </h3>
            <Textarea
              placeholder="Supervisor's comments"
              className="min-h-[100px]"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">
              Academic Supervisor Comments (to be completed during the
              mid-semester visit)
            </h3>
            <Textarea
              placeholder="Academic supervisor's comments"
              className="min-h-[100px]"
            />
          </div>
        </div>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-xl font-semibold mb-4">Signatures</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="studentSignature">Student *</Label>
            <Input
              id="studentSignature"
              placeholder="Student Signature"
              name="studentSignature"
              value={formData.studentSignature}
              onChange={handleInputChange}
              className={errors.studentSignature ? "border-red-500" : ""}
            />
            {errors.studentSignature && (
              <p className="text-red-500 text-sm mt-1">
                {errors.studentSignature}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="industrySupervisorSignature">
              Industry Supervisor
            </Label>
            <Input
              id="industrySupervisorSignature"
              placeholder="Industry Supervisor Signature"
            />
          </div>
          <div>
            <Label htmlFor="academicSupervisorSignature">
              Academic Supervisor
            </Label>
            <Input
              id="academicSupervisorSignature"
              placeholder="Academic Supervisor Signature"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <Button variant="outline" type="button">
            Cancel
          </Button>
          <Button type="submit">Submit Form</Button>
        </div>
      </form>
    </div>
  );
}
