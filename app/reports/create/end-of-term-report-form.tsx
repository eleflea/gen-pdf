"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { createEndOfTermReport } from "@/app/actions/reports";
import { useToast } from "@/hooks/use-toast";
import { cn, END_OF_TERM_QUESTIONS, getEndOfTermScoreDesc } from "@/lib/utils";

const scoreItemSchema = z.object({
  question: z.string().min(1, "Question is required"),
  score: z.number().min(1).max(5),
});

const formSchema = z.object({
  studentName: z.string().min(1, "Student name is required"),
  studentId: z.number().int().positive("Student ID must be a positive number"),
  organisation: z.string().min(1, "Organisation is required"),
  industrySupervisor: z.string().min(1, "Industry supervisor is required"),
  dateOfSubmit: z.date(),
  scoreItems: z
    .array(scoreItemSchema)
    .min(1, "At least one score item is required"),
  studentComments: z.string().min(1, "Student comments are required"),
  supervisorComments: z.string().min(1, "Supervisor comments are required"),
  studentSignature: z.string().min(1, "Student signature is required"),
  studentSignatureDate: z.date(),
});

export function EndOfTermReportForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentName: "",
      studentId: undefined,
      organisation: "",
      industrySupervisor: "",
      dateOfSubmit: new Date(),
      scoreItems: END_OF_TERM_QUESTIONS.map((question) => ({
        question,
        score: 1,
      })),
      studentComments: "",
      supervisorComments: "",
      studentSignature: "",
      studentSignatureDate: new Date(),
    },
  });

  const { fields, append } = useFieldArray({
    name: "scoreItems",
    control: form.control,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      const result = await createEndOfTermReport(values);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: "Success",
        description: "End of term report created successfully",
      });

      router.push("/reports/manage");
    } catch {
      toast({
        title: "Error",
        description: "Failed to create report",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="studentName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student Name</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>Student ID</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(Number.parseInt(e.target.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="organisation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organisation</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="industrySupervisor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry Supervisor</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Date of Submit */}
        <FormField
          control={form.control}
          name="dateOfSubmit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Submit</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
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
                    selected={field.value}
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

        {/* Scoring Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Scoring Items</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  question: "",
                  score: 1,
                })
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Score Item
            </Button>
          </div>

          {fields.map((field) => (
            <Card key={field.id}>
              <CardContent className="pt-6">
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name={`scoreItems.${fields.indexOf(field)}.question`}
                    render={({ field: questionField }) => (
                      <FormItem>
                        <FormLabel>Question</FormLabel>
                        <FormControl>
                          <Input {...questionField} readOnly={true} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`scoreItems.${fields.indexOf(field)}.score`}
                    render={({ field: scoreField }) => (
                      <FormItem>
                        <FormLabel>Score (1-5)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={5}
                            {...scoreField}
                            onChange={(e) =>
                              scoreField.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-sm text-muted-foreground">
                          {getEndOfTermScoreDesc(scoreField.value)}
                        </p>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comments */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="studentComments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{"Student's Comments"}</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="supervisorComments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{"Industry Supervisor's Comments"}</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Signatures */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="studentSignature"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student Signature</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="studentSignatureDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student Signature Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
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
                      selected={field.value}
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

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create End of Term Report"}
        </Button>
      </form>
    </Form>
  );
}
