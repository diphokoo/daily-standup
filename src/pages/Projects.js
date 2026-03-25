import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import ProjectList from '../components/ProjectList';
import ProjectTimeline from '../components/ProjectTimeline';
import { useFirestoreData } from '../hooks/useFirestoreData';
import PageHeader from '../components/PageHeader';

function Projects() {
  const { projects: filteredProjects, loading, refetch } = useFirestoreData();
  const [showModal, setShowModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(1);
  const [formData, setFormData] = useState({ name: '', description: '', status: 'In Progress' });
  const [saving, setSaving] = useState(false);

  const projects = filteredProjects;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateProject = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const statusColors = { 'In Progress': 'bg-primary', 'Completed': 'bg-success', 'Overdue': 'bg-danger' };
    const newProject = {
      id: projects.length + 1,
      name: formData.name,
      createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      description: formData.description,
      status: formData.status,
      statusColor: statusColors[formData.status],
      daysRemaining: 30,
      progress: 0,
      sprints: [],
      timeline: [{ id: 1, date: new Date().toISOString().split('T')[0], entry: 'Project created' }]
    };

    try {
      setSaving(true);
      await addDoc(collection(db, `users/${user.uid}/projects`), newProject);
      await refetch();
      setSelectedProjectId(newProject.id);
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setSaving(false);
      setFormData({ name: '', description: '', status: 'In Progress' });
      setShowModal(false);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4 p-2 rounded d-flex justify-content-between align-items-center">
        <PageHeader page="Projects" />
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-lg me-2"></i>New Project
        </button>
      </div>

      {loading ? <p className="text-muted">Loading...</p> : (
        <>
          <ProjectList projects={projects} onSelectProject={setSelectedProjectId} selectedProjectId={selectedProjectId} />
          <ProjectTimeline selectedProjectId={selectedProjectId} projects={projects} />
        </>
      )}

      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">New Project</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Project Name</label>
                    <input type="text" name="name" className="form-control" placeholder="Enter project name" value={formData.name} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea name="description" className="form-control" rows="3" placeholder="Enter project description" value={formData.description} onChange={handleInputChange}></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select name="status" className="form-select" value={formData.status} onChange={handleInputChange}>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={saving}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleCreateProject} disabled={saving}>
                  {saving ? <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Creating...</> : 'Create Project'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;
