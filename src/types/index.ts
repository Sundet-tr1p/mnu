export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN'

export interface User {
  id: string
  email: string
  name: string
  surname: string
  role: UserRole
  createdAt: Date
}
