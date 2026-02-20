function ProjectTimeline({ selectedProjectId = 1, projects }) {
  const sprintData = require('../data/sprintData.json');
  const projectList = projects || sprintData.projects;
  const project = projectList.find(p => p.id === selectedProjectId);
  const logs = project ? project.timeline : [];

  return (
    <div className="card mb-4 p-3 border-0 shadow rounded">
      <h5 className="mb-4">Daily Project Logs - {project?.name}</h5>
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