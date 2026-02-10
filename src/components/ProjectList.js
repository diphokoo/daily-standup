function ProjectList() {
  const projects = [
    {
      id: 1,
      name: 'Project Alpha',
      createdDate: 'Mar 28, 2025',
      description: 'Developing an analytics and insight dashboard',
      status: 'In Progress',
      statusColor: 'bg-primary',
      daysRemaining: 19,
      progress: 65
    },
    {
      id: 2,
      name: 'Project Beta',
      createdDate: 'Feb 15, 2025',
      description: 'Building a customer management system',
      status: 'Completed',
      statusColor: 'bg-success',
      daysRemaining: 0,
      progress: 100
    },
    {
      id: 3,
      name: 'Project Gamma',
      createdDate: 'Apr 10, 2025',
      description: 'Implementing automated testing framework',
      status: 'Overdue',
      statusColor: 'bg-danger',
      daysRemaining: -5,
      progress: 45
    }
  ];

  return (
    <div className="mb-4">
      <div className="d-flex gap-3">
        {projects.map(project => (
          <div key={project.id} className="card flex-fill border-0 shadow rounded p-3">
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