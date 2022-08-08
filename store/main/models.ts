import { IPatient, Report, Task } from "../../smartmarkers-router";

export interface RootState {
  patients: IPatient[];
  tasks: Task[];
  reports: Report[];
  selectedReport: Report | null;
  selectedPatient: IPatient | null;
  selectedTask: Task | null;
}
