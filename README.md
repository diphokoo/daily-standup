# Daily Standup & Weekly Planner

A React application powered by Firebase Authentication and Cloud Firestore for project tracking, daily stand-ups, weekly task planning, and productivity reporting.

## Weekly Planner

The Weekly Planner is integrated into the existing app and uses the signed-in user's Firestore space at `users/{uid}/plannerTasks`. It includes:

- Monday-to-Sunday week view with previous/next week navigation and a shortcut back to the current week.
- Create, edit, and delete planned tasks.
- Assign tasks to an existing project and date.
- Set start/end times, planned hours, actual hours, and work location.
- Track status (`Planned`, `In Progress`, `Completed`, `On Hold`) and completion percentage.
- Weekly summaries for task completion, planned hours, actual hours, and remaining planned hours.
- Responsive layout for desktop, tablet, and mobile screens.

Existing project, daily-entry, dashboard, and report screens are retained. The planner stores its tasks in a separate Firestore subcollection, so it does not overwrite existing daily entries or projects.

## Run locally

1. Install Node.js (LTS recommended).
2. From the project directory, run `npm install`.
3. Run `npm start` to start the development server.
4. Run `npm run build` to create a production build.

The app uses the Firebase project configuration in `src/firebase.js`. Ensure the relevant Firebase Authentication and Cloud Firestore settings and security rules are enabled for your deployment.

## Existing Create React App scripts

- `npm start` — starts the development server.
- `npm test` — runs the test runner.
- `npm run build` — creates an optimized production build.
- `npm run eject` — ejects Create React App configuration (one-way operation).


## How Projects, Weekly Planner, and Daily Entries work together

The app follows one workflow:

1. **Projects** — create and organise the projects you are working on.
2. **Weekly Planner** — schedule dated tasks, assign them to a project, set times and planned/actual hours, and track status and progress. The planner respects the project filter in the sidebar.
3. **Daily Entries** — when you have worked on a planned task, select **Log work to Daily Entries** on that planner task. The app creates a daily entry with the task date, project, description, status, and planned/actual hours, then records the link back to the planner task to prevent logging it again.
4. Use the navigation buttons on each page to move between the three parts of the workflow. Daily entries created from planner tasks show a link back to the Weekly Planner.

Planner tasks are stored in `users/{uid}/plannerTasks`; projects and daily entries continue to use `users/{uid}/projects` and `users/{uid}/entries`. The new links store the associated project document ID and planner task ID where available. Ensure your Firestore rules allow a signed-in user to read and write only their own subcollections.
