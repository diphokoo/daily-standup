import { useState, useEffect } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import sprintData from '../data/sprintData.json';

function SprintCompletion({ selectedSprint, sprintDates }) {
  const [data, setData] = useState(null);
  const [previousData, setPreviousData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [showCompleted, setShowCompleted] = useState(true);
  const [showBlockers, setShowBlockers] = useState(true);

  useEffect(() => {
    const sprint = sprintData.sprints.find(s => s.sprintNumber === parseInt(selectedSprint));
    const prevSprint = sprintData.sprints.find(s => s.sprintNumber === parseInt(selectedSprint) - 1);
    
    if (sprint && sprintDates) {
      const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Johannesburg' }));
      today.setHours(0, 0, 0, 0);
      
      const generatedData = [];
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      let currentDate = new Date(sprintDates.startDate);
      const endDate = new Date(sprintDates.endDate);
      let dataIndex = 0;
      let totalCompleted = 0;
      let workingDaysPassed = 0;
      
      while (currentDate <= endDate && currentDate <= today) {
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          const dayData = sprint.dailyData[dataIndex] || { completed: 0, blockers: 0 };
          generatedData.push({
            day: daysOfWeek[dayOfWeek],
            completed: dayData.completed,
            blockers: dayData.blockers
          });
          totalCompleted += dayData.completed;
          workingDaysPassed++;
          dataIndex++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      const avgTasksPerDay = workingDaysPassed > 0 ? (totalCompleted / workingDaysPassed).toFixed(1) : 0;
      const tasksPostponed = sprint.totalTasks - totalCompleted - sprint.tasksToDo;
      
      setData({ ...sprint, avgTasksPerDay, tasksCompleted: totalCompleted, tasksPostponed });
      setChartData(generatedData);
    } else if (sprint) {
      setData(sprint);
    }
    
    setPreviousData(prevSprint);
  }, [selectedSprint, sprintDates]);

  if (!data) return null;

  const postponedChange = previousData 
    ? ((data.tasksPostponed - previousData.tasksPostponed) / previousData.tasksPostponed * 100).toFixed(1)
    : 0;
  const avgChange = previousData 
    ? (data.avgTasksPerDay - previousData.avgTasksPerDay).toFixed(1)
    : 0;

  return (
    <div className="d-flex gap-3 mb-4">
      <div className="card shadow border-0" style={{ flex: '7' }}>
        <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Sprint Completion & Blocker Trend</h5>
          <div className="d-flex gap-2">
            <button 
              className={`btn btn-sm ${showCompleted ? 'btn-success' : 'btn-outline-secondary'}`}
              onClick={() => setShowCompleted(!showCompleted)}
            >
              <i className="bi bi-check-circle me-1"></i>Tasks
            </button>
            <button 
              className={`btn btn-sm ${showBlockers ? 'btn-warning' : 'btn-outline-secondary'}`}
              onClick={() => setShowBlockers(!showBlockers)}
            >
              <i className="bi bi-exclamation-triangle me-1"></i>Blockers
            </button>
          </div>
        </div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" label={{ value: 'Days', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Tasks', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              {showCompleted && <Area type="monotone" dataKey="completed" stroke="#198754" fill="#19875440" name="Tasks Completed" />}
              {showBlockers && <Area type="monotone" dataKey="blockers" stroke="#ffc107" fill="#ffc10740" name="Blockers" />}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ flex: '3', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="card shadow border-0" style={{ flex: '1' }}>
          <div className="card-header bg-white border-0">
            <h6 className="mb-0">Tasks Postponed</h6>
          </div>
          <div className="card-body">
            <h2 className="mb-2">{data.tasksPostponed} <span className="text-muted" style={{ fontSize: '0.9rem' }}>- {data.totalTasks} Total Tasks</span></h2>
          </div>
          <div className="card-footer bg-white border-0 text-muted">
            <small>
              {postponedChange > 0 ? <i className="bi bi-arrow-up text-danger me-1"></i> : 
               postponedChange < 0 ? <i className="bi bi-arrow-down text-success me-1"></i> : 
               <i className="bi bi-dash me-1"></i>}
              {Math.abs(postponedChange)}% from previous sprint
            </small>
          </div>
        </div>

        <div className="card shadow border-0" style={{ flex: '1' }}>
          <div className="card-header bg-white border-0">
            <h6 className="mb-0">Avg Tasks Per Day</h6>
          </div>
          <div className="card-body">
            <h2 className="mb-2 text-primary">{data.avgTasksPerDay}</h2>
          </div>
          <div className="card-footer bg-white border-0 text-muted">
            <small>
              {avgChange > 0 ? <i className="bi bi-arrow-up text-success me-1"></i> : 
               avgChange < 0 ? <i className="bi bi-arrow-down text-danger me-1"></i> : 
               <i className="bi bi-dash me-1"></i>}
              by <span>{Math.abs(avgChange)}</span> from previous sprint
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SprintCompletion;