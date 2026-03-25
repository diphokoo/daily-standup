import { useState } from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useFirestoreData } from '../hooks/useFirestoreData';

function ProjectList({ projects: propProjects, onSelectProject, selectedProjectId }) {
  const { filteredProjects, loading } = useFirestoreData();
  const projects = propProjects || filteredProjects;
  const [editingProject, setEditingProject] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', status: '' });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  if (loading && !propProjects) return <p className="text-muted">Loading...</p>;

  const statusColors = { 'In Progress': 'bg-primary', 'Completed': 'bg-success', 'Overdue': 'bg-danger' };

  const handleEdit = (e, project) => {
    e.stopPropagation();
    setEditingProject(project);
    setEditForm({ name: project.name, description: project.description, status: project.status });
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      setSaving(true);
      await updateDoc(doc(db, `users/${user.uid}/projects`, editingProject.docId), {
        name: editForm.name,
        description: editForm.description,
        status: editForm.status,
        statusColor: statusColors[editForm.status]
      });
      setEditingProject(null);
    } catch (error) {
      console.error('Error updating project:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (e, project) => {
    e.stopPropagation();
    const user = auth.currentUser;
    if (!user) return;
    try {
      setDeletingId(project.docId);
      await deleteDoc(doc(db, `users/${user.uid}/projects`, project.docId));
    } catch (error) {
      console.error('Error deleting project:', error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mb-4">
      <div className="d-flex flex-column flex-md-row gap-3">
        {projects.map(project => (
          <div
            key={project.id}
            className="card flex-fill border-0 shadow rounded p-3"
            style={{ cursor: 'pointer', border: selectedProjectId === project.id ? '2px solid #0d6efd' : 'none' }}
            onClick={() => onSelectProject(project.id)}
          >
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h5 className="mb-0">{project.name}</h5>
              <div className="d-flex gap-2" onClick={e => e.stopPropagation()}>
                <i className="bi bi-pencil text-secondary" style={{ cursor: 'pointer' }} onClick={(e) => handleEdit(e, project)}></i>
                <i
                  className="bi bi-trash text-danger"
                  style={{ cursor: deletingId === project.docId ? 'not-allowed' : 'pointer' }}
                  onClick={(e) => handleDelete(e, project)}
                >
                  {deletingId === project.docId && <span className="spinner-border spinner-border-sm ms-1" role="status"></span>}
                </i>
              </div>
            </div>
            <span className="text-muted mt-2">Created {project.createdDate}</span>
            <p className="mb-2 mt-3">{project.description}</p>
            <span className={`badge ${project.statusColor} w-25 p-2`}>{project.status}</span>
            <span style={{ fontSize: '0.875rem' }} className="text-muted mt-3">
              {project.daysRemaining > 0 ? `${project.daysRemaining} days remaining` :
               project.daysRemaining === 0 ? 'Completed' :
               `${Math.abs(project.daysRemaining)} days overdue`}
            </span>
            <div className="progress mt-2" style={{ height: '8px' }}>
              <div className="progress-bar" role="progressbar" style={{ width: `${project.progress}%` }}
                aria-valuenow={project.progress} aria-valuemin="0" aria-valuemax="100"></div>
            </div>
          </div>
        ))}
      </div>

      {editingProject && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setEditingProject(null)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Project</h5>
                <button type="button" className="btn-close" onClick={() => setEditingProject(null)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={editForm.status}
                    onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditingProject(null)} disabled={saving}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Saving...</> : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectList;
