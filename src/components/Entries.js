import { useState } from 'react';

function Entries() {
  const [selectedPeriod, setSelectedPeriod] = useState('');
  
  const generatePeriods = () => {
    const periods = [];
    const today = new Date();
    for (let i = 0; i < 4; i++) {
      const endDate = new Date(today);
      endDate.setDate(today.getDate() - (i * 14));
      const startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 13);
      periods.push({
        label: `${startDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })} to ${endDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}`,
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0]
      });
    }
    return periods;
  };

  const periods = generatePeriods();
  const today = new Date();
  
  const entries = [
    { id: 1, date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], project: 'Project Alpha', description: 'Completed API integration', status: 'Completed' },
    { id: 2, date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], project: 'Project Beta', description: 'Fixed authentication bug', status: 'Completed' },
    { id: 3, date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], project: 'Project Alpha', description: 'Updated documentation', status: 'To Do' },
    { id: 4, date: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], project: 'Project Gamma', description: 'Team meeting and planning', status: 'Blockers' },
    { id: 5, date: new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], project: 'Project Beta', description: 'Database optimization', status: 'Completed' },
    { id: 6, date: new Date(today.getTime() - 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], project: 'Project Alpha', description: 'UI improvements', status: 'To Do' }
  ];

  const filteredEntries = selectedPeriod
    ? entries.filter(entry => {
        const period = periods.find(p => p.label === selectedPeriod);
        return entry.date >= period.start && entry.date <= period.end;
      })
    : entries;

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Completed': return 'bg-success';
      case 'To Do': return 'bg-primary';
      case 'Blockers': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="card p-3 shadow border-0">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Entries</h5>
        <select 
          className="form-select w-auto" 
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
        >
          <option value="">All Periods</option>
          {periods.map((period, index) => (
            <option key={index} value={period.label}>{period.label}</option>
          ))}
        </select>
      </div>
      <div>
        {filteredEntries.map(entry => (
          <div key={entry.id} className="border-bottom py-3">
            <div className="d-flex justify-content-between align-items-start">
              <div className="flex-grow-1">
                <div className="d-flex gap-4">
                  <small className="text-muted" style={{ minWidth: '100px' }}>{entry.date}</small>
                  <small className="fw-bold" style={{ minWidth: '120px' }}>{entry.project}</small>
                  <small>{entry.description}</small>
                </div>
              </div>
              <span className={`badge ${getStatusBadge(entry.status)}`}>
                {entry.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Entries;