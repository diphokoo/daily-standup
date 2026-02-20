import sprintData from '../data/sprintData.json';
import entriesData from '../data/entriesData.json';

function TodaysStats() {
  const today = new Date().toISOString().split('T')[0];
  const todayEntries = entriesData.entries.filter(e => e.date === today);
  const completed = todayEntries.filter(e => e.status === 'Completed').length;
  const toDo = entriesData.entries.filter(e => e.status === 'To Do').length;

  const getCurrentSprint = () => {
    const today = new Date();
    const sprintStartDate = new Date('2026-02-02');
    const daysSinceStart = Math.floor((today - sprintStartDate) / (1000 * 60 * 60 * 24));
    const sprintNumber = Math.floor(daysSinceStart / 14) + 1;
    return sprintData.sprints.find(s => s.sprintNumber === sprintNumber) || sprintData.sprints[sprintData.sprints.length - 1];
  };

  const currentSprint = getCurrentSprint();
  
  // Calculate sprint progress using same logic as Reports
  const calculateSprintProgress = () => {
    const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Johannesburg' }));
    today.setHours(0, 0, 0, 0);
    const sprintStartDate = new Date('2026-02-02');
    
    let currentDate = new Date(sprintStartDate);
    let dataIndex = 0;
    let totalCompleted = 0;
    
    // Find current sprint dates
    const sprintNumber = currentSprint.sprintNumber;
    let sprintStart = new Date(sprintStartDate);
    for (let i = 1; i < sprintNumber; i++) {
      let workingDays = 0;
      while (workingDays < 10) {
        sprintStart.setDate(sprintStart.getDate() + 1);
        if (sprintStart.getDay() !== 0 && sprintStart.getDay() !== 6) {
          workingDays++;
        }
      }
      sprintStart.setDate(sprintStart.getDate() + 1);
      while (sprintStart.getDay() === 0 || sprintStart.getDay() === 6) {
        sprintStart.setDate(sprintStart.getDate() + 1);
      }
    }
    
    currentDate = new Date(sprintStart);
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
    return { totalCompleted, completedPercentage };
  };
  
  const { completedPercentage } = calculateSprintProgress();

  return (
    <div className="d-flex gap-3 mb-4">
      <div className="col-md-7 card rounded p-3 shadow border-0">
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

      <div className="col-md-5 card rounded p-3 shadow border-0">
          <h5>Daily Entries</h5>

          <h6 className="mt-3"> Gave updates to the team </h6>

          <p className="text-muted mt-3"> 11:30 AM </p>
      </div>
    </div>
  );
}

export default TodaysStats;