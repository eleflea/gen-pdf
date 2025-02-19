import { getReports, getEndOfTermReports } from "@/app/actions/reports"
import { ManageReportsClient } from "./manage-reports-client"

export default async function ManageReports() {
  const [weeklyReports, endOfTermReports] = await Promise.all([
    getReports(),
    getEndOfTermReports(),
  ])

  if (weeklyReports.error || endOfTermReports.error) {
    return (
      <div className="container py-10">
        Error loading reports: {weeklyReports.error || endOfTermReports.error}
      </div>
    )
  }

  return (
    <ManageReportsClient
      initialWeeklyReports={weeklyReports.data}
      initialEndOfTermReports={endOfTermReports.data}
    />
  )
}

