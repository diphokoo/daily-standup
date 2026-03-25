import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import EntriesSummary from '../components/EntriesSummary';
import Entries from '../components/Entries';
import { useFirestoreData } from '../hooks/useFirestoreData';
import PageHeader from '../components/PageHeader';

function DailyEntries() {
  const { projects } = useFirestoreData();
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ date: '', description: '', status: '', project: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;
    try {
      setSaving(true);
      await addDoc(collection(db, `users/${user.uid}/entries`), {
        ...formData,
        id: Date.now()
      });
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setSaving(false);
      setFormData({ date: '', description: '', status: '', project: '' });
      setShowModal(false);
    }
  };

  return (
    <div className="p-4">
      <PageHeader page="Daily Entries">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-lg me-2"></i>New Entry
        </button>
      </PageHeader>
      <span className="text-muted d-block mb-4">Tracking over 14-day period</span>
      <EntriesSummary />
      <Entries />

      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">New Daily Entry</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input type="date" name="date" className="form-control" value={formData.date} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <input type="text" name="description" className="form-control" placeholder="What did you work on?" value={formData.description} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Project</label>
                    <select name="project" className="form-select" value={formData.project} onChange={handleChange} required>
                      <option value="">Select Project</option>
                      {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select name="status" className="form-select" value={formData.status} onChange={handleChange} required>
                      <option value="">Select Status</option>
                      <option value="Completed">Completed</option>
                      <option value="To Do">To Do</option>
                      <option value="Blockers">Blockers</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={saving}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Saving...</> : 'Save Entry'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DailyEntries;
