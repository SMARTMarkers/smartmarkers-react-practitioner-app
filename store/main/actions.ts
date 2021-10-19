import { Report, IPatient, Task } from "../../smartmarkers-router";

import * as types from "./types";

export const setPatients = (patients: IPatient[]) => ({
  type: types.SET_PATIENTS_LIST,
  patients,
});

export const setTasksData = (tasks: Task[]) => ({
  type: types.SET_TASKS,
  tasks,
});

export const setReports = (reports: Report[]) => ({
  type: types.SET_REPORTS,
  reports,
});

export const setSelectedReport = (report: Report | null) => ({
  type: types.SET_SELECTED_REPORT,
  report,
});

export const setSelectedPatient = (patient: IPatient | null) => ({
  type: types.SET_SELECTED_PATIENT,
  patient,
});

export const setSelectedTask = (task: Task | null) => ({
  type: types.SET_SELECTED_TASK,
  task,
});
