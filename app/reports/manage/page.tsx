import { getReports } from "@/app/actions/reports"
import { ManageReportsClient } from "./manage-reports-client"

export default async function ManageReports() {
  const { data: reports, error } = await getReports()

  if (error) {
    return <div className="container py-10">Error loading reports: {error}</div>
  }

  return <ManageReportsClient initialReports={reports} />
}

