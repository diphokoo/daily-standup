import { useFirestoreData } from '../hooks/useFirestoreData';
import { useProject } from '../context/ProjectContext';

function PageHeader({ page, children }) {
  const { projects } = useFirestoreData();
  const { selectedProjectId } = useProject();

  const selectedProject = selectedProjectId === 'all' ? null : projects.find(p => p.id === selectedProjectId);
  const heading = selectedProject ? `${selectedProject.name} - ${page}` : `All Projects - ${page}`;

  return (
    <div className="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center gap-2 mb-3">
      <h5 className="mb-0 mt-2">{heading}</h5>
      {children && <div className="d-flex align-items-center gap-2">{children}</div>}
    </div>
  );
}

export default PageHeader;
