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
import { useToast } from "@/hooks/use-toast";
import type { FormSchemaType } from "./mid-intern-reportschema";
import { FormSchema } from "./mid-intern-reportschema";
import { SelfAssessmentTable } from "./self-assessment-table";
import Image from "next/image";
import { createMidInternReport } from "@/app/actions/submitReport";

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
      selfAssessments: [
        { rating: undefined, comment: "" },
        { rating: undefined, comment: "" },
        { rating: undefined, comment: "" },
        { rating: undefined, comment: "" },
        { rating: undefined, comment: "" },
      ],
      studentComments: "",
      studentSignature: "",
    },
  });

  async function onSubmit(values: FormSchemaType) {
    setIsSubmitting(true);
    const formData = new FormData();

    // Ensure proper handling of JSON for self-assessment data
    Object.entries(values).forEach(([key, value]) => {
      if (key === "dateOfVisit" && value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (key === "selfAssessment" && Array.isArray(value)) {
        // Ensure the selfAssessment array is serialized properly
        formData.append(key, JSON.stringify(value)); // Store as a JSON string
      } else if (Array.isArray(value)) {
        value.forEach((item) => formData.append(key, JSON.stringify(item)));
      } else if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    const result = await createMidInternReport(formData);
    console.log("result", result);

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
    <div className="container mx-auto my-8 p-6 max-w-7xl border border-gray-200 rounded-lg bg-white shadow-sm">
      <div className="flex justify-end mb-6">
        <Image
          src="/swinburne.png"
          alt="Swinburne Logo"
          width={150}
          height={50}
        />
      </div>
      <h1 className="text-2xl font-bold">
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

          <SelfAssessmentTable form={form} />

          <FormField
            control={form.control}
            name="studentComments"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">
                  Student&apos;s Comments *
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Enter your comments here"
                    className="resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Signatures</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="studentSignature"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        className="border-0 border-b-2 border-black focus:ring-0 focus:border-black rounded-none px-4"
                      />
                    </FormControl>
                    <FormLabel className="absolute left-0 right-0 transform -translate-y-1/2 text-center">
                      Student*
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="mt-4 text-right text-sm text-gray-500">
            ICT80004 – Mid Internship Project Review Form
          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={() => console.log("Submit button manually clicked!")}
            >
              {isSubmitting ? "Submitting..." : "Submit Form"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
