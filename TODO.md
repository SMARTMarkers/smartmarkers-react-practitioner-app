### Issues


### lib: 

- Name of the library should be `smartmarkers` and not `smartmarkers-lib`
- Move file to different folders
    - src/models/internal/Task.ts --> src/task/Task.ts
    - src/models/internal/TaskSchedule.ts --> src/task/TaskSchedule.ts
    - src/models/internal/Session.ts --> src/session/Session.ts
    - src/models/internal/ResultBundle.ts --> src/session/ResultBundle.ts

### Patient App:

- Remove Practitioner related screens from the Patient app: `PractitionerDashboard..`
- Rename: `HistoryScreen` --> `TaskScreen`
- Can we pass the item `Task` object to the `HistoryScreen`
    - I had to add `instrumentTitle` to only pass the title of the instrument. If there is a way to pass the the complete `Task` item; then could have used: `task.instrument.title`
- Remove: ChoosePatientScreen


### Bugs:

- `Instrument Could Not be Resolved`
    - When starting a SessionWizard for an Instrument, if the instrument (`Questionnaire`) could not be resolved (pulled from the FHIR servers) a message show say that there was a problem. 
- Questionnaire Rendering Engine
    - Need "NEXT" "Back" "CANCEL" buttons
- `SessionWizard`:
    - At "Select For Submission" screen, the toggle does not show in Android
 


### Finally:


- __Session State__
- Move smartmarkers react library into its separate repo `smartmarkers-react`
- Move patient app to separate repo --> `patient-app-react`
- Move practitioner app to separate repo --> `practitioner-app-react`
- ?? add `smartmarkers-react` as a submodule to the above 2 apps ??
