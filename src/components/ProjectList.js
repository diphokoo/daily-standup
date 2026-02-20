import sprintData from '../data/sprintData.json';

function ProjectList({ projects, onSelectProject, selectedProjectId }) {
  const projectList = projects || sprintData.projects;

  return (
    <div className="mb-4">
      <div className="d-flex gap-3">
        {projectList.map(project => (
          <div 
            key={project.id} 
            className={`card flex-fill border-0 shadow rounded p-3 ${selectedProjectId === project.id ? 'border-primary' : ''}`}
            style={{ cursor: 'pointer', border: selectedProjectId === project.id ? '2px solid #0d6efd' : 'none' }}
            onClick={() => onSelectProject(project.id)}
          >
            <h5>{project.name}</h5>
            <span className="text-muted mt-3">
              Created {project.createdDate}
            </span>
            
            <p className="mb-2 mt-3">{project.description}</p>
         
            <span className={`badge ${project.statusColor} w-25 p-2`}>{project.status}</span>

            <span style={{ fontSize: '0.875rem' }} className="text-muted mt-3">
              {project.daysRemaining > 0 ? `${project.daysRemaining} days remaining` : 
               project.daysRemaining === 0 ? 'Completed' : 
               `${Math.abs(project.daysRemaining)} days overdue`}
            </span>

            <div className="progress mt-0" style={{ height: '8px' }}>
              <div className="progress-bar" role="progressbar" style={{ width: `${project.progress}%` }} 
                   aria-valuenow={project.progress} aria-valuemin="0" aria-valuemax="100"></div>
            </div>
         
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectList;