import ProjectList from '../components/ProjectList';
import ProjectTimeline from '../components/ProjectTimeline';

function Projects() {
  return (
    <div className="p-4">
      <div className='mb-4 p-2 rounded d-flex justify-content-between align-items-center'>
        <h3 className="mb-4 text-start">Projects</h3>
        <button className="btn btn-primary text-end">
          <i className="bi bi-plus-lg me-2"></i>
          New Project
        </button>
      </div>
      
      <ProjectList />
      <ProjectTimeline />
    </div>
  );
}

export default Projects;