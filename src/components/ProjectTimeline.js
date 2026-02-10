function ProjectTimeline() {
  const logs = [
    { id: 1, date: '2024-03-28', entry: 'Completed user authentication module' },
    { id: 2, date: '2024-03-27', entry: 'Fixed database connection issues' },
    { id: 3, date: '2024-03-26', entry: 'Implemented dashboard UI components' },
    { id: 4, date: '2024-03-25', entry: 'Code review and bug fixes' }
  ];

  return (
    <div className="card mb-4 p-3 border-0 shadow rounded">
      <h5 className="mb-4">Daily Project Logs</h5>
      <div className="d-flex">
        <div style={{ width: '150px' }}>
          <h6 className="fw-bold">Date</h6>
          {logs.map(log => (
            <div key={log.id} className="py-2 text-muted">{log.date}</div>
          ))}
        </div>
        <div className="flex-grow-1">
          <h6 className="fw-bold">Entry</h6>
          {logs.map(log => (
            <div key={log.id} className="py-2">{log.entry}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectTimeline;