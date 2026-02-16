import { useState, useEffect } from 'react';
import sprintData from '../data/sprintData.json';

function SprintProgress({ selectedSprint, sprintDates }) {
  const [data, setData] = useState(null);
  const [dailyDominance, setDailyDominance] = useState([]);

  useEffect(() => {
    const sprint = sprintData.sprints.find(s => s.sprintNumber === parseInt(selectedSprint));
    
    if (sprint && sprintDates) {
      const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Johannesburg' }));
      today.setHours(0, 0, 0, 0);
      
      let currentDate = new Date(sprintDates.startDate);
      const endDate = new Date(sprintDates.endDate);
      let dataIndex = 0;
      let totalCompleted = 0;
      const dominanceData = [];
      
      while (currentDate <= endDate && currentDate <= today) {
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          const dayData = sprint.dailyData[dataIndex] || { completed: 0, blockers: 0 };
          totalCompleted += dayData.completed;
          
          // Determine dominant category for the day
          let dominant = 'completed';
          if (dayData.blockers > dayData.completed && dayData.blockers > sprint.tasksToDo / 10) {
            dominant = 'blockers';
          } else if (sprint.tasksToDo / 10 > dayData.completed && sprint.tasksToDo / 10 > dayData.blockers) {
            dominant = 'todo';
          }
          
          dominanceData.push(dominant);
          dataIndex++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      const tasksPostponed = sprint.totalTasks - totalCompleted - sprint.tasksToDo;
      const completedPercentage = ((totalCompleted / sprint.totalTasks) * 100).toFixed(1);
      const postponedPercentage = ((tasksPostponed / sprint.totalTasks) * 100).toFixed(1);
      const todoPercentage = ((sprint.tasksToDo / sprint.totalTasks) * 100).toFixed(1);
      
      setData({ 
        ...sprint, 
        tasksCompleted: totalCompleted,
        tasksPostponed,
        completedPercentage,
        postponedPercentage,
        todoPercentage
      });
      setDailyDominance(dominanceData);
    } else if (sprint) {
      setData(sprint);
    }
  }, [selectedSprint, sprintDates]);

  if (!data) return null;

  const getDominanceColor = (type) => {
    switch(type) {
      case 'completed': return 'bg-success';
      case 'blockers': return 'bg-warning';
      case 'todo': return 'bg-primary';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="d-flex gap-3 mb-4">
      <div className="card shadow border-0" style={{ flex: '7' }}>
        <div className="card-header bg-white border-0">
          <h5 className="mb-0">Sprint Progress</h5>
        </div>
        <div className="card-body">
          <div className="mb-4">
            <div className="d-flex justify-content-between mb-2">
              <span>{data.tasksCompleted} Tasks Completed</span>
              <span className="text-muted">{data.tasksCompleted}/{data.totalTasks} ({data.completedPercentage}% completed)</span>
            </div>
            <div className="progress" style={{ height: '20px' }}>
              <div 
                className="progress-bar bg-success" 
                role="progressbar" 
                style={{ width: `${data.completedPercentage}%` }}
                aria-valuenow={data.completedPercentage} 
                aria-valuemin="0" 
                aria-valuemax="100"
              ></div>
            </div>
          </div>

          <div>
            <div className="d-flex justify-content-between mb-2">
              <span>{data.tasksPostponed} Tasks Postponed</span>
              <span className="text-muted">{data.tasksPostponed}/{data.totalTasks} ({data.postponedPercentage}% postponed)</span>
            </div>
            <div className="progress" style={{ height: '20px' }}>
              <div 
                className="progress-bar bg-warning" 
                role="progressbar" 
                style={{ width: `${data.postponedPercentage}%` }}
                aria-valuenow={data.postponedPercentage} 
                aria-valuemin="0" 
                aria-valuemax="100"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow border-0" style={{ flex: '3' }}>
        <div className="card-header bg-white border-0">
          <h6 className="mb-0">Block Analytics</h6>
          <small className="text-muted">Your performance for the sprint</small>
        </div>
        <div className="card-body">
          <div className="d-flex flex-wrap gap-2">
            {dailyDominance.map((type, index) => (
              <div 
                key={index}
                className={`${getDominanceColor(type)} rounded`}
                style={{ width: '40px', height: '40px' }}
                title={`Day ${index + 1}: ${type}`}
              ></div>
            ))}
          </div>
          <div className="mt-3">
            <small className="d-block"><span className="badge bg-success me-2"></span>Tasks Completed</small>
            <small className="d-block"><span className="badge bg-primary me-2"></span>Tasks To Do</small>
            <small className="d-block"><span className="badge bg-warning me-2"></span>Blockers</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SprintProgress;