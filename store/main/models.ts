import { IPatient, Report, Task } from 'smartmarkers'

export interface RootState {
  patients: IPatient[]
  tasks: Task[]
  reports: Report[]
  selectedReport: Report | null
  selectedPatient: IPatient | null
  selectedTask: Task | null
}
