import { H3Event } from 'h3'
import { getAllJobs, jobToPublic } from '../../../utils/eop-core'

export default defineEventHandler(async (event: H3Event) => {
  const jobs = getAllJobs()
  return jobs.map((job) => jobToPublic(job))
})

