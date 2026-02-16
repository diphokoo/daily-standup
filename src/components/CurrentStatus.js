import { useState, useEffect } from 'react';
import sprintData from '../data/sprintData.json';

function CurrentStatus({ selectedSprint, sprintDates }) {
  const [data, setData] = useState(null);
  const [previousData, setPreviousData] = useState(null);

  useEffect(() => {
    const sprint = sprintData.sprints.find(s => s.sprintNumber === parseInt(selectedSprint));
    const prevSprint = sprintData.sprints.find(s => s.sprintNumber === parseInt(selectedSprint) - 1);
    
    if (sprint && sprintDates) {
      const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Johannesburg' }));
      today.setHours(0, 0, 0, 0);
      
      let currentDate = new Date(sprintDates.startDate);
      const endDate = new Date(sprintDates.endDate);
      let dataIndex = 0;
      let totalCompleted = 0;
      let totalBlockers = 0;
      let workingDaysPassed = 0;
      
      while (currentDate <= endDate && currentDate <= today) {
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          const dayData = sprint.dailyData[dataIndex] || { completed: 0, blockers: 0 };
          totalCompleted += dayData.completed;
          totalBlockers += dayData.blockers;
          workingDaysPassed++;
          dataIndex++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      const tasksPostponed = sprint.totalTasks - totalCompleted - sprint.tasksToDo;
      const avgTasksPerDay = workingDaysPassed > 0 ? (totalCompleted / workingDaysPassed).toFixed(1) : 0;
      
      setData({ 
        ...sprint, 
        tasksCompleted: totalCompleted, 
        blockers: totalBlockers,
        tasksPostponed,
        avgTasksPerDay 
      });
    } else if (sprint) {
      setData(sprint);
    }
    
    setPreviousData(prevSprint);
  }, [selectedSprint, sprintDates]);

  if (!data || !previousData) return null;

  const cards = [
    {
      header: 'Tasks Completed',
      icon: 'bi-check-circle-fill',
      iconColor: 'text-success',
      bgColor: 'bg-success',
      value: data.tasksCompleted,
      body: 'In Last Sprint',
      footer: `${data.changeFromPrevious} from previous sprint`
    },
    {
      header: 'Tasks To Do',
      icon: 'bi-check-circle-fill',
      iconColor: 'text-primary',
      bgColor: 'bg-primary',
      value: data.tasksToDo,
      body: `+${data.newThisSprint} this sprint`,
      footer: `↑ ${data.newThisSprint} this sprint`
    },
    {
      header: 'Blockers',
      icon: 'bi-exclamation-triangle-fill',
      iconColor: 'text-warning',
      bgColor: 'bg-warning',
      value: data.blockers,
      body: `${data.repeatBlockers} Repeat Blockers`,
      footer: `${data.repeatBlockersChange} Repeated Blockers`
    },
    {
      header: 'More Down Errors',
      icon: 'bi-arrow-down-circle-fill',
      iconColor: 'text-secondary',
      bgColor: 'bg-secondary',
      value: data.moreDownErrors,
      body: 'From last sprint',
      footer: `${data.completionRate} completion rate`
    }
  ];

  return (
    <div className="mb-4">
      <div className="d-flex gap-3">
        {cards.map((card, index) => (
          <div key={index} className="card flex-fill shadow border-0">
            <div className="card-header bg-white border-0 d-flex align-items-center gap-2">
              <i className={`${card.icon} ${card.iconColor}`} style={{ fontSize: '1.2rem' }}></i>
              <h5 className="mb-0">{card.header}</h5>
            </div>
            <div className="card-body">
              <h2 className={`mb-2 ${card.iconColor}`}>{card.value}</h2>
              <span className="text-muted mb-0 subText">{card.body}</span>
            </div>
            <div className="card-footer bg-white border-0 text-muted">
              <small>{card.footer}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CurrentStatus;