import { JobList } from "@/components/job-list"
import type { Job } from "@/types/job"

const appliedJobs: Job[] = [
  { id: "1", company: "Tech Corp", position: "Software Engineer", dateApplied: "2023-05-01", status: "Applied" },
  { id: "2", company: "Data Inc", position: "Data Analyst", dateApplied: "2023-05-03", status: "Applied" },
  { id: "3", company: "Web Solutions", position: "Frontend Developer", dateApplied: "2023-05-05", status: "Applied" },
]

export default function AppliedPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Applied Jobs</h1>
      <JobList jobs={appliedJobs} />
    </div>
  )
}

