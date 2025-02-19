"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeeklyReportForm } from "./weekly-report-form";
import { EndOfTermReportForm } from "./end-of-term-report-form";

export default function CreateReport() {
  return (
    <div className="container max-w-3xl py-10">
      <h1 className="text-2xl font-bold mb-8">Create Report</h1>
      <Tabs defaultValue="weekly">
        <TabsList className="mb-8">
          <TabsTrigger value="weekly">Weekly Report</TabsTrigger>
          <TabsTrigger value="end-of-term">End of Term Report</TabsTrigger>
        </TabsList>
        <TabsContent value="weekly">
          <WeeklyReportForm />
        </TabsContent>
        <TabsContent value="end-of-term">
          <EndOfTermReportForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
