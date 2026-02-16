import { useState, useEffect } from 'react';
import CurrentStatus from '../components/CurrentStatus';
import SprintCompletion from '../components/SprintCompletion';
import SprintProgress from '../components/SprintProgress';

function Reports() {
  const sprintStartDate = new Date('2026-02-02T00:00:00+02:00'); // Monday, 2 Feb 2026 SAST
  const workingDaysPerSprint = 10;
  
  const addWorkingDays = (startDate, days) => {
    let currentDate = new Date(startDate);
    let addedDays = 0;
    
    while (addedDays < days) {
      currentDate.setDate(currentDate.getDate() + 1);
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        addedDays++;
      }
    }
    return currentDate;
  };
  
  const isWithinSprint = (date, startDate, endDate) => {
    return date >= startDate && date <= endDate;
  };
  
  const generateSprints = () => {
    const sprints = [];
    const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Johannesburg' }));
    today.setHours(0, 0, 0, 0);
    let sprintNumber = 1;
    let currentSprintNumber = 1;
    let currentStartDate = new Date(sprintStartDate);
    
    for (let i = 0; i < 20; i++) {
      const startDate = new Date(currentStartDate);
      const endDate = addWorkingDays(startDate, workingDaysPerSprint - 1);
      
      if (isWithinSprint(today, startDate, endDate)) {
        currentSprintNumber = sprintNumber;
      }
      
      if (sprintNumber >= currentSprintNumber - 1 && sprintNumber <= currentSprintNumber) {
        sprints.push({
          number: sprintNumber,
          startDate: startDate,
          endDate: endDate,
          label: `Sprint ${sprintNumber}`
        });
      }
      
      currentStartDate = new Date(endDate);
      currentStartDate.setDate(endDate.getDate() + 1);
      while (currentStartDate.getDay() === 0 || currentStartDate.getDay() === 6) {
        currentStartDate.setDate(currentStartDate.getDate() + 1);
      }
      
      sprintNumber++;
    }
    
    return { sprints, currentSprintNumber };
  };
  
  const { sprints, currentSprintNumber } = generateSprints();
  const [selectedSprint, setSelectedSprint] = useState(currentSprintNumber);
  const [sprintDateRange, setSprintDateRange] = useState('');
  
  useEffect(() => {
    const sprint = sprints.find(s => s.number === parseInt(selectedSprint));
    if (sprint) {
      setSprintDateRange(`${sprint.startDate.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Africa/Johannesburg' })} - ${sprint.endDate.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Africa/Johannesburg' })}`);
    }
  }, [selectedSprint, sprints]);

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="text-start">
          <h4 className="mt-2">
            Reports
          </h4>     
        </div>
        <div className="text-end d-flex gap-2">
          <span className="text-muted mt-2">{sprintDateRange}</span>
          <select 
            className="form-select w-auto" 
            value={selectedSprint}
            onChange={(e) => setSelectedSprint(e.target.value)}
          >
            {sprints.map(sprint => (
              <option key={sprint.number} value={sprint.number}>
                {sprint.number === currentSprintNumber ? 'Current Sprint' : `Sprint ${sprint.number}`}
              </option>
            ))}
          </select>
          <button className="btn btn-primary">
            Generate
          </button>
        </div>
      </div>
      <span className="text-muted d-block subText mb-4">Tracking over 10 working days</span>
      <CurrentStatus />
      <SprintCompletion />
      <SprintProgress />
    </div>
  );
}

export default Reports;