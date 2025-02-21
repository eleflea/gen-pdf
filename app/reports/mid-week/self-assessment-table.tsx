import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import type { UseFormReturn } from "react-hook-form";
import type { FormSchemaType } from "./mid-intern-reportschema";

interface SelfAssessmentTableProps {
  form: UseFormReturn<FormSchemaType>;
}

export function SelfAssessmentTable({ form }: SelfAssessmentTableProps) {
  const assessmentItems = [
    "Awareness of a range of issues associated with professional practice",
    "Professional and personal skills",
    "Practical skills and theoretical knowledge into an IT industry context",
    "Understanding of business processes and organizational structures",
    "Professional contacts and networks within the IT industry",
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Student Self-Assessment: Rate how well you are achieving the following
        knowledge by ticking on the appropriate box. (Complete this prior to the
        mid semester visit)
      </h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">
              Your perception and knowledge
            </th>
            <th className="border p-2 text-center">
              I&apos;m getting the opportunities
            </th>
            <th className="border p-2 text-center">
              I&apos;d love to have more opportunities
            </th>
            <th className="border p-2 text-left">
              Give one example in relation to your rating
            </th>
          </tr>
        </thead>
        <tbody>
          {assessmentItems.map((item, index) => (
            <tr key={index} className="border">
              <td className="border p-2">{item}</td>
              <td className="border p-2 text-center">
                <FormField
                  control={form.control}
                  name={`selfAssessments.${index}.rating`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex justify-center"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="getting" />
                            </FormControl>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </td>
              <td className="border p-2 text-center">
                <FormField
                  control={form.control}
                  name={`selfAssessments.${index}.rating`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex justify-center"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="wantMore" />
                            </FormControl>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </td>
              <td className="border p-2">
                <FormField
                  control={form.control}
                  name={`selfAssessments.${index}.comment`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="w-full md:w-[300px] border-0 resize-none m-0 p-0"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
