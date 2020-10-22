import { IPatient, Report, Task } from 'smartmarkers-lib'

export interface TasksData {
  patientId: string
  tasks: Task[]
}

export interface RootState {
  patients: IPatient[]
  tasksData: TasksData
  reports: Report[]
  selectedReport: Report | null
  selectedPatient: IPatient | null
  selectedTask: Task | null
}
