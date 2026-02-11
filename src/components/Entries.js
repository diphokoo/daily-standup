import { useState } from 'react';

function Entries() {
  const [selectedDate, setSelectedDate] = useState('');
  
  const entries = [
    { id: 1, date: '2024-03-28', task: 'Completed API integration', status: 'Done' },
    { id: 2, date: '2024-03-27', task: 'Fixed authentication bug', status: 'Done' },
    { id: 3, date: '2024-03-26', task: 'Updated documentation', status: 'In Progress' },
    { id: 4, date: '2024-03-25', task: 'Team meeting and planning', status: 'Done' }
  ];

  const filteredEntries = selectedDate 
    ? entries.filter(entry => entry.date === selectedDate)
    : entries;

  return (
    <div className="card p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Entries</h5>
        <input 
          type="date" 
          className="form-control w-auto" 
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>
      <div>
        {filteredEntries.map(entry => (
          <div key={entry.id} className="border-bottom py-3">
            <div className="d-flex justify-content-between">
              <div>
                <h6>{entry.task}</h6>
                <small className="text-muted">{entry.date}</small>
              </div>
              <span className={`badge ${entry.status === 'Done' ? 'bg-success' : 'bg-warning'}`}>
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