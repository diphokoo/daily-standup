import { useState, useEffect } from 'react';
import sprintData from '../data/sprintData.json';

function CurrentStatus({ selectedSprint }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const sprint = sprintData.sprints.find(s => s.sprintNumber === parseInt(selectedSprint));
    setData(sprint || sprintData.sprints[sprintData.sprints.length - 1]);
  }, [selectedSprint]);

  if (!data) return null;

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