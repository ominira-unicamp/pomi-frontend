import { pomiApi } from '@/api/client'

export const {
  listStudentTagInterests,
  putStudentTagInterest,
  deleteStudentTagInterest,
} = pomiApi.studentInterests
