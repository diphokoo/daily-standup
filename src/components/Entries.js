import { useState } from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useFirestoreData } from '../hooks/useFirestoreData';

function Entries() {
  const { entries, loading } = useFirestoreData();
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [editingEntry, setEditingEntry] = useState(null);
  const [editForm, setEditForm] = useState({ description: '', status: '', project: '' });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const generatePeriods = () => {
    const periods = [];
    const today = new Date();
    for (let i = 0; i < 4; i++) {
      const endDate = new Date(today);
      endDate.setDate(today.getDate() - (i * 14));
      const startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 13);
      periods.push({
        label: `${startDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })} to ${endDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}`,
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0]
      });
    }
    return periods;
  };

  const periods = generatePeriods();

  const filteredEntries = selectedPeriod
    ? entries.filter(entry => {
        const period = periods.find(p => p.label === selectedPeriod);
        return entry.date >= period.start && entry.date <= period.end;
      })
    : entries;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return 'bg-success';
      case 'To Do': return 'bg-primary';
      case 'Blockers': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setEditForm({ description: entry.description, status: entry.status, project: entry.project });
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user || !editingEntry) return;
    try {
      setSaving(true);
      await updateDoc(doc(db, `users/${user.uid}/entries`, editingEntry.docId), {
        description: editForm.description,
        status: editForm.status,
        project: editForm.project
      });
      setEditingEntry(null);
    } catch (error) {
      console.error('Error updating entry:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (entry) => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      setDeletingId(entry.docId);
      await deleteDoc(doc(db, `users/${user.uid}/entries`, entry.docId));
    } catch (error) {
      console.error('Error deleting entry:', error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="card p-3 shadow border-0">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Entries</h5>
        <select
          className="form-select w-auto"
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
        >
          <option value="">All Periods</option>
          {periods.map((period, index) => (
            <option key={index} value={period.label}>{period.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : (
        <div>
          {filteredEntries.map(entry => (
            <div key={entry.id} className="border-bottom py-3">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex gap-4 flex-grow-1">
                  <small className="text-muted" style={{ minWidth: '100px' }}>{entry.date}</small>
                  <small className="fw-bold" style={{ minWidth: '120px' }}>{entry.project}</small>
                  <small>{entry.description}</small>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className={`badge ${getStatusBadge(entry.status)}`}>{entry.status}</span>
                  <i className="bi bi-pencil text-secondary" style={{ cursor: 'pointer' }} onClick={() => handleEdit(entry)}></i>
                  <i
                    className="bi bi-trash text-danger"
                    style={{ cursor: deletingId === entry.docId ? 'not-allowed' : 'pointer' }}
                    onClick={() => handleDelete(entry)}
                  >
                    {deletingId === entry.docId && <span className="spinner-border spinner-border-sm ms-1" role="status"></span>}
                  </i>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingEntry && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setEditingEntry(null)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Entry</h5>
                <button type="button" className="btn-close" onClick={() => setEditingEntry(null)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Project</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editForm.project}
                    onChange={(e) => setEditForm(prev => ({ ...prev, project: e.target.value }))}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={editForm.status}
                    onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="Completed">Completed</option>
                    <option value="To Do">To Do</option>
                    <option value="Blockers">Blockers</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditingEntry(null)} disabled={saving}>Cancel</button>
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

export default Entries;
