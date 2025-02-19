"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { FormSchemaType } from "./mid-intern-reportschema";

import * as z from "zod";
import { createMidInternReport } from "@/app/actions/submitReport";

const FormSchema = z.object({
  studentName: z.string().min(2, "Student Name is required"),
  studentId: z.string().min(1, "Student ID is required"),
  organization: z.string().min(1, "Organization Name is required"),
  supervisor: z.string().min(1, "Industry Supervisor Name is required"),
  dateOfVisit: z.date().nullable(),
  selfAssessment: z
    .array(z.string().min(1, "All self-assessment fields are required"))
    .length(5, "All self-assessment fields are required"),
  studentComments: z.string().min(1, "Write some comment"),
  studentSignature: z.string().min(1, "Signature is required"),
});

export default function InternshipReviewForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      studentName: "",
      studentId: "",
      organization: "",
      supervisor: "",
      dateOfVisit: null,
      selfAssessment: ["", "", "", "", ""],
      studentComments: "",
      studentSignature: "",
      supervisorComments: "",
      supervisorSignature: "",
    },
  });

  async function onSubmit(values: FormSchemaType) {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === "dateOfVisit" && value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (Array.isArray(value)) {
        value.forEach((item) => formData.append(key, item));
      } else if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    const result = await createMidInternReport(formData);

    if (result.success) {
      toast({
        title: "Success",
        description: "Mid-Intern report created successfully",
      });
      router.push("/reports/manage/midinternReport");
    } else {
      toast({
        title: "Error",
        description: "Failed to create mid-intern report",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  }

  return (
    <div className="container mx-auto my-8 p-6 max-w-4xl border border-gray-200 rounded-lg bg-white shadow-sm">
      <h1 className="text-2xl font-bold mb-2">
        ICT80004 Mid-Internship Project Review Form - Check In
      </h1>
      <p className="text-gray-500 mb-6">
        To be discussed during the mid-semester visit and submitted to Canvas by
        week 8.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="studentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Name *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter student name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student ID *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter student ID" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter organization" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supervisor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry Supervisor *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter supervisor name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfVisit"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Visit</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Student Self-Assessment</h2>
            <p className="text-sm text-gray-500">
              Rate how well you are achieving the following knowledge by
              selecting the appropriate option.
            </p>
            {[
              "Awareness of a range of issues associated with professional practice",
              "Professional and personal skills",
              "Practical skills and theoretical knowledge into an IT industry context",
              "Understanding of business processes and organizational structures",
              "Professional contacts and networks within the IT industry",
            ].map((item, index) => (
              <FormField
                key={index}
                control={form.control}
                name={`selfAssessment.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{item}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="none" />
                          </FormControl>
                          <FormLabel className="font-normal">None</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="some" />
                          </FormControl>
                          <FormLabel className="font-normal">Some</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="well" />
                          </FormControl>
                          <FormLabel className="font-normal">Well</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
          <FormField
            control={form.control}
            name="studentComments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student Comments *</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Enter your comments here" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="studentSignature"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student Signature *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Student Signature" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="supervisorComments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supervisor Comments</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter supervisor comments here"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supervisorSignature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supervisor Signature</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Supervisor Signature" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Form"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
