import { useFirestoreData } from '../hooks/useFirestoreData';

function TodaysStats() {
  const { entries, sprints, loading } = useFirestoreData();

  if (loading) return <div className="d-flex gap-3 mb-4"><div className="col-md-7 card rounded p-3 shadow border-0"><p className="text-muted">Loading...</p></div></div>;

  const today = new Date().toISOString().split('T')[0];
  const completed = entries.filter(e => e.date === today && e.status === 'Completed').length;
  const toDo = entries.filter(e => e.status === 'To Do').length;

  const getCurrentSprint = () => {
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Johannesburg' }));
    now.setHours(0, 0, 0, 0);
    const sprintStartDate = new Date('2026-02-02');
    let sprintStart = new Date(sprintStartDate);
    let sprintNumber = 1;
    let found = false;

    for (let i = 0; i < 100 && !found; i++) {
      let workingDays = 0;
      let endDate = new Date(sprintStart);
      while (workingDays < 10) {
        endDate.setDate(endDate.getDate() + 1);
        if (endDate.getDay() !== 0 && endDate.getDay() !== 6) workingDays++;
      }
      if (now >= sprintStart && now <= endDate) { found = true; break; }
      sprintStart = new Date(endDate);
      sprintStart.setDate(sprintStart.getDate() + 1);
      while (sprintStart.getDay() === 0 || sprintStart.getDay() === 6) {
        sprintStart.setDate(sprintStart.getDate() + 1);
      }
      sprintNumber++;
      if (sprintNumber > sprints.length) { sprintNumber = sprints.length; break; }
    }
    return { sprint: sprints.find(s => s.sprintNumber === sprintNumber) || sprints[sprints.length - 1], sprintStart };
  };

  const { sprint: currentSprint, sprintStart } = getCurrentSprint();

  const calculateSprintProgress = () => {
    if (!currentSprint) return { completedPercentage: '0%' };
    const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Johannesburg' }));
    today.setHours(0, 0, 0, 0);
    let currentDate = new Date(sprintStart);
    let dataIndex = 0;
    let totalCompleted = 0;
    let workingDays = 0;

    while (workingDays < 10 && currentDate <= today) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        const dayData = currentSprint.dailyData[dataIndex] || { completed: 0 };
        totalCompleted += dayData.completed;
        workingDays++;
        dataIndex++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const completedPercentage = ((totalCompleted / currentSprint.totalTasks) * 100).toFixed(0) + '%';
    return { completedPercentage };
  };

  const { completedPercentage } = calculateSprintProgress();

  return (
    <div className="d-flex flex-column flex-md-row gap-3 mb-4">
      <div className="col-12 col-md-7 card rounded p-3 shadow border-0">
        <h5>Today's Stats</h5>
        <div className="d-flex gap-3 mt-3">
          <div className="flex-fill rounded p-2 loggedInContent">
            <h6>Completed</h6>
            <h3>{completed}</h3>
          </div>
          <div className="flex-fill rounded p-2 loggedInContent">
            <h6>To Do</h6>
            <h3>{toDo}</h3>
          </div>
        </div>
        <div className="mt-3">
          <div className="d-flex justify-content-between mb-2">
            <span>Sprint Progress</span>
            <span>{completedPercentage}</span>
          </div>
          <div className="progress" style={{ height: '10px' }}>
            <div
              className="progress-bar bg-primary"
              role="progressbar"
              style={{ width: completedPercentage }}
              aria-valuenow={parseInt(completedPercentage)}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-5 card rounded p-3 shadow border-0">
        <h5>Daily Entries</h5>
        <h6 className="mt-3">Gave updates to the team</h6>
        <p className="text-muted mt-3">11:30 AM</p>
      </div>
    </div>
  );
}

export default TodaysStats;
