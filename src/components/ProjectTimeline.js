import { useFirestoreData } from '../hooks/useFirestoreData';

function ProjectTimeline({ selectedProjectId = 1, projects: propProjects }) {
  const { filteredProjects, loading } = useFirestoreData();
  const projects = propProjects || filteredProjects;
  const project = projects.find(p => p.id === selectedProjectId);
  const logs = project?.timeline || [];

  return (
    <div className="card mb-4 p-3 border-0 shadow rounded">
      <h5 className="mb-4">Daily Project Logs - {project?.name}</h5>
      {loading && !propProjects ? (
        <p className="text-muted">Loading...</p>
      ) : (
        <div className="row fw-bold border-bottom pb-2 mb-2">
          <div className="col-3">Date</div>
          <div className="col-9">Entry</div>
        </div>
      )}
      {logs.map(log => (
        <div key={log.id} className="row border-bottom py-2">
          <div className="col-3 text-muted">{log.date}</div>
          <div className="col-9">{log.entry}</div>
        </div>
      ))}
    </div>
  );
}

export default ProjectTimeline;
