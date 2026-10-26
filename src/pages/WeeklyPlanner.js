import { useEffect, useMemo, useState } from 'react';
import {
  addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useFirestoreData } from '../hooks/useFirestoreData';
import PageHeader from '../components/PageHeader';
import { useProject } from '../context/ProjectContext';

const pad = (value) => String(value).padStart(2, '0');
const dateKey = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const parseDate = (value) => {
  const [year, month, day] = (value || dateKey(new Date())).split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
};
const mondayOf = (date) => {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return monday;
};
const addDays = (date, amount) => {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
};
const formatDate = (date, options = { day: 'numeric', month: 'short' }) =>
  date.toLocaleDateString('en-ZA', options);
const emptyTask = (date, project = '') => ({
  title: '', description: '', project, date, startTime: '09:00', endTime: '10:00',
  plannedHours: '1', actualHours: '', location: 'Office', status: 'Planned', progress: 0
});
const hoursBetween = (start, end) => {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const hours = (eh * 60 + em - (sh * 60 + sm)) / 60;
  return hours > 0 ? hours : 0;
};

function WeeklyPlanner({ onPageChange = () => {} }) {
  const { projects } = useFirestoreData();
  const { selectedProjectId } = useProject();
  const selectedProject = projects.find((project) => String(project.id) === String(selectedProjectId) || project.docId === selectedProjectId);
  const selectedProjectName = selectedProject?.name || ''; 
  const [user, setUser] = useState(auth.currentUser);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weekStart, setWeekStart] = useState(() => mondayOf(new Date()));
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(() => emptyTask(dateKey(new Date())));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    const tasksQuery = query(collection(db, `users/${user.uid}/plannerTasks`), orderBy('date'));
    return onSnapshot(tasksQuery, (snapshot) => {
      setTasks(snapshot.docs.map((item) => ({ ...item.data(), docId: item.id })));
      setLoading(false);
      setError('');
    }, (snapshotError) => {
      console.error('Unable to load planner tasks:', snapshotError);
      setError('Tasks could not be loaded. Check your connection and Firestore permissions.');
      setLoading(false);
    });
  }, [user]);

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)), [weekStart]);
  const startKey = dateKey(weekDays[0]);
  const endKey = dateKey(weekDays[6]);
  const weekTasks = useMemo(
    () => tasks.filter((task) => task.date >= startKey && task.date <= endKey && (!selectedProjectName || task.project === selectedProjectName)),
    [tasks, startKey, endKey, selectedProjectName]
  );
  const plannedHours = weekTasks.reduce((sum, task) => sum + (Number(task.plannedHours) || 0), 0);
  const actualHours = weekTasks.reduce((sum, task) => sum + (Number(task.actualHours) || 0), 0);
  const completedCount = weekTasks.filter((task) => task.status === 'Completed' || Number(task.progress) >= 100).length;
  const completion = weekTasks.length ? Math.round((completedCount / weekTasks.length) * 100) : 0;

  const openNewTask = (date = dateKey(new Date())) => {
    setEditingId(null);
    setForm(emptyTask(date, selectedProjectName));
    setError('');
    setShowForm(true);
  };
  const openEditTask = (task) => {
    setEditingId(task.docId);
    setForm({
      title: task.title || '', description: task.description || '', project: task.project || '',
      date: task.date || dateKey(new Date()), startTime: task.startTime || '09:00',
      endTime: task.endTime || '10:00', plannedHours: String(task.plannedHours ?? ''),
      actualHours: String(task.actualHours ?? ''), location: task.location || 'Office',
      status: task.status || 'Planned', progress: Number(task.progress) || 0
    });
    setError('');
    setShowForm(true);
  };
  const changeField = (event) => {
    const { name, value } = event.target;
    setForm((current) => {
      const next = { ...current, [name]: value };
      if (name === 'startTime' || name === 'endTime') {
        const computed = hoursBetween(name === 'startTime' ? value : next.startTime, name === 'endTime' ? value : next.endTime);
        if (computed > 0 && !current.actualHours) next.plannedHours = String(Number(computed.toFixed(2)));
      }
      if (name === 'status' && value === 'Completed') next.progress = 100;
      if (name === 'progress' && Number(value) >= 100) next.status = 'Completed';
      if (name === 'progress' && Number(value) < 100 && current.status === 'Completed') next.status = 'In Progress';
      return next;
    });
  };
  const saveTask = async (event) => {
    event.preventDefault();
    if (!user) return;
    setSaving(true);
    setError('');
    const payload = {
      title: form.title.trim(), description: form.description.trim(), project: form.project,
      projectId: projects.find((project) => project.name === form.project)?.docId || '',
      date: form.date, startTime: form.startTime, endTime: form.endTime,
      plannedHours: Number(form.plannedHours) || 0, actualHours: form.actualHours === '' ? 0 : Number(form.actualHours),
      location: form.location, status: form.status, progress: Math.max(0, Math.min(100, Number(form.progress) || 0)),
      updatedAt: new Date().toISOString()
    };
    try {
      if (editingId) await updateDoc(doc(db, `users/${user.uid}/plannerTasks`, editingId), payload);
      else await addDoc(collection(db, `users/${user.uid}/plannerTasks`), { ...payload, createdAt: new Date().toISOString() });
      setShowForm(false);
      setEditingId(null);
    } catch (saveError) {
      console.error('Unable to save planner task:', saveError);
      setError('Could not save this task. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  const removeTask = async (task) => {
    if (!user || !window.confirm(`Delete "${task.title}" from your planner?`)) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/plannerTasks`, task.docId));
    } catch (deleteError) {
      console.error('Unable to delete planner task:', deleteError);
      setError('Could not delete this task. Please try again.');
    }
  };
  const changeStatus = async (task, status) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, `users/${user.uid}/plannerTasks`, task.docId), {
        status, progress: status === 'Completed' ? 100 : (Number(task.progress) >= 100 ? 0 : Number(task.progress) || 0),
        updatedAt: new Date().toISOString()
      });
    } catch (updateError) {
      console.error('Unable to update task:', updateError);
      setError('Could not update the task status.');
    }
  };
  const logTaskAsEntry = async (task) => {
    if (!user || task.linkedEntryId) return;
    setError('');
    try {
      const entryRef = await addDoc(collection(db, `users/${user.uid}/entries`), {
        date: task.date,
        description: task.description ? `${task.title} — ${task.description}` : task.title,
        project: task.project || 'Personal / no project',
        projectId: task.projectId || projects.find((project) => project.name === task.project)?.docId || '',
        status: task.status === 'Completed' ? 'Completed' : 'To Do',
        plannerTaskId: task.docId,
        plannerTaskTitle: task.title,
        plannedHours: Number(task.plannedHours) || 0,
        actualHours: Number(task.actualHours) || 0,
        createdAt: new Date().toISOString()
      });
      await updateDoc(doc(db, `users/${user.uid}/plannerTasks`, task.docId), {
        linkedEntryId: entryRef.id,
        updatedAt: new Date().toISOString()
      });
      onPageChange('daily-entries');
    } catch (logError) {
      console.error('Unable to create daily entry from planner task:', logError);
      setError('Could not log this task as a daily entry. Please try again.');
    }
  };
  const previousWeek = () => setWeekStart((current) => addDays(current, -7));
  const nextWeek = () => setWeekStart((current) => addDays(current, 7));
  const goToThisWeek = () => setWeekStart(mondayOf(new Date()));

  return (
    <div className="p-3 p-lg-4 planner-page">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <PageHeader page="Weekly Planner" />
          <p className="text-muted mb-0">Plan your week, track time, and measure progress.{selectedProjectName ? ` Showing ${selectedProjectName}.` : ' Showing all projects.'}</p>
        </div>
        <div className="d-flex gap-2 flex-wrap"><button className="btn btn-outline-secondary" onClick={() => onPageChange('projects')}><i className="bi bi-folder2 me-2" />Projects</button><button className="btn btn-outline-secondary" onClick={() => onPageChange('daily-entries')}><i className="bi bi-journal-text me-2" />Daily entries</button><button className="btn btn-primary" onClick={() => openNewTask(dateKey(new Date()))}><i className="bi bi-plus-lg me-2" />Add task</button></div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3"><div className="planner-stat"><span>Tasks this week</span><strong>{weekTasks.length}</strong><small>{completedCount} completed</small></div></div>
        <div className="col-6 col-xl-3"><div className="planner-stat"><span>Planned hours</span><strong>{plannedHours.toFixed(1)}<em>h</em></strong><small>Scheduled workload</small></div></div>
        <div className="col-6 col-xl-3"><div className="planner-stat"><span>Actual hours</span><strong>{actualHours.toFixed(1)}<em>h</em></strong><small>Time spent</small></div></div>
        <div className="col-6 col-xl-3"><div className="planner-stat"><span>Completion</span><strong>{completion}<em>%</em></strong><div className="progress mt-2" style={{ height: 5 }}><div className="progress-bar" style={{ width: `${completion}%` }} /></div></div></div>
      </div>

      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <div>
          <h2 className="h5 mb-1">Your week</h2>
          <span className="text-muted small">{formatDate(weekDays[0], { day: 'numeric', month: 'long', year: 'numeric' })} – {formatDate(weekDays[6], { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
        <div className="btn-group" role="group" aria-label="Choose week">
          <button className="btn btn-outline-secondary" onClick={previousWeek} aria-label="Previous week"><i className="bi bi-chevron-left" /></button>
          <button className="btn btn-outline-secondary" onClick={goToThisWeek}>Today</button>
          <button className="btn btn-outline-secondary" onClick={nextWeek} aria-label="Next week"><i className="bi bi-chevron-right" /></button>
        </div>
      </div>

      {error && <div className="alert alert-warning" role="alert">{error}</div>}
      {loading ? <div className="py-5 text-center"><span className="spinner-border spinner-border-sm me-2" />Loading your plan…</div> : (
        <div className="planner-week-grid">
          {weekDays.map((day) => {
            const key = dateKey(day);
            const dayTasks = weekTasks.filter((task) => task.date === key).sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
            const isToday = key === dateKey(new Date());
            return (
              <section className={`planner-day ${isToday ? 'planner-day-today' : ''}`} key={key}>
                <div className="planner-day-heading">
                  <div><span>{day.toLocaleDateString('en-ZA', { weekday: 'short' })}</span><strong>{day.getDate()}</strong></div>
                  <button className="btn btn-sm btn-light" onClick={() => openNewTask(key)} aria-label={`Add task for ${key}`}><i className="bi bi-plus" /></button>
                </div>
                <div className="planner-day-tasks">
                  {dayTasks.length === 0 && <p className="planner-empty">Nothing planned</p>}
                  {dayTasks.map((task) => (
                    <article className={`planner-task ${task.status === 'Completed' ? 'planner-task-complete' : ''}`} key={task.docId}>
                      <div className="d-flex align-items-start justify-content-between gap-1">
                        <button className="planner-task-title" onClick={() => openEditTask(task)}>{task.title}</button>
                        <button className="btn btn-sm text-muted p-0" onClick={() => removeTask(task)} aria-label={`Delete ${task.title}`}><i className="bi bi-trash3" /></button>
                      </div>
                      <div className="planner-task-time"><i className="bi bi-clock me-1" />{task.startTime || '—'} – {task.endTime || '—'}</div>
                      {task.project && <div className="planner-task-project"><i className="bi bi-folder2 me-1" />{task.project}</div>}
                      <div className="planner-task-meta"><span><i className="bi bi-geo-alt me-1" />{task.location || 'Unspecified'}</span><span>{Number(task.plannedHours || 0).toFixed(1)}h planned</span></div>
                      <div className="progress my-2" style={{ height: 4 }}><div className="progress-bar" style={{ width: `${Math.max(0, Math.min(100, Number(task.progress) || 0))}%` }} /></div>
                      <div className="d-flex align-items-center justify-content-between gap-1">
                        <span className={`planner-status status-${String(task.status || 'Planned').toLowerCase().replace(/\s+/g, '-')}`}>{task.status || 'Planned'}</span>
                        <select className="form-select form-select-sm planner-status-select" aria-label={`Update ${task.title} status`} value={task.status || 'Planned'} onChange={(event) => changeStatus(task, event.target.value)}>
                          <option>Planned</option><option>In Progress</option><option>Completed</option><option>On Hold</option>
                        </select>
                      </div>
                      <div className="mt-2">
                        {task.linkedEntryId ? (
                          <button className="btn btn-sm btn-outline-success w-100" onClick={() => onPageChange('daily-entries')}><i className="bi bi-check2-circle me-1" />Logged in Daily Entries</button>
                        ) : (
                          <button className="btn btn-sm btn-outline-primary w-100" onClick={() => logTaskAsEntry(task)}><i className="bi bi-journal-plus me-1" />Log work to Daily Entries</button>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
                <button className="planner-add-day" onClick={() => openNewTask(key)}><i className="bi bi-plus me-1" />Add task</button>
              </section>
            );
          })}
        </div>
      )}

      <div className="card border-0 shadow-sm mt-4">
        <div className="card-body">
          <h2 className="h6 mb-3">Weekly productivity</h2>
          <div className="row g-3">
            <div className="col-md-4"><div className="d-flex justify-content-between"><span className="text-muted">Task completion</span><strong>{completedCount}/{weekTasks.length}</strong></div><div className="progress mt-2"><div className="progress-bar bg-success" style={{ width: `${completion}%` }} /></div></div>
            <div className="col-md-4"><div className="d-flex justify-content-between"><span className="text-muted">Time recorded</span><strong>{actualHours.toFixed(1)}h / {plannedHours.toFixed(1)}h</strong></div><div className="progress mt-2"><div className="progress-bar" style={{ width: `${plannedHours ? Math.min(100, actualHours / plannedHours * 100) : 0}%` }} /></div></div>
            <div className="col-md-4"><span className="text-muted d-block">Remaining planned hours</span><strong className="fs-5">{Math.max(0, plannedHours - actualHours).toFixed(1)}h</strong></div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="modal show d-block planner-task-modal" tabIndex="-1" role="dialog" aria-modal="true" style={{ backgroundColor: 'rgba(12, 20, 30, .55)', zIndex: 1100 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow">
              <div className="modal-header"><div><h5 className="modal-title">{editingId ? 'Edit task' : 'Plan a task'}</h5><p className="text-muted small mb-0">Add the task details and track your time.</p></div><button type="button" className="btn-close" onClick={() => setShowForm(false)} aria-label="Close" /></div>
              <form onSubmit={saveTask}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12"><label className="form-label">Task title *</label><input className="form-control" name="title" value={form.title} onChange={changeField} placeholder="e.g. Finish dashboard improvements" required maxLength="140" /></div>
                    <div className="col-12"><label className="form-label">Description / notes</label><textarea className="form-control" rows="2" name="description" value={form.description} onChange={changeField} placeholder="What needs to be done?" /></div>
                    <div className="col-md-6"><label className="form-label">Project</label><select className="form-select" name="project" value={form.project} onChange={changeField}><option value="">Personal / no project</option>{projects.map((project) => <option key={project.docId || project.id} value={project.name}>{project.name}</option>)}</select><div className="form-text">Tasks are linked to the selected project and can be logged as daily entries.</div></div>
                    <div className="col-md-6"><label className="form-label">Date *</label><input className="form-control" type="date" name="date" value={form.date} onChange={changeField} required /></div>
                    <div className="col-sm-6 col-md-3"><label className="form-label">Start time</label><input className="form-control" type="time" name="startTime" value={form.startTime} onChange={changeField} /></div>
                    <div className="col-sm-6 col-md-3"><label className="form-label">End time</label><input className="form-control" type="time" name="endTime" value={form.endTime} onChange={changeField} /></div>
                    <div className="col-sm-6 col-md-3"><label className="form-label">Planned hours</label><input className="form-control" type="number" min="0" max="24" step="0.25" name="plannedHours" value={form.plannedHours} onChange={changeField} /></div>
                    <div className="col-sm-6 col-md-3"><label className="form-label">Actual hours</label><input className="form-control" type="number" min="0" max="24" step="0.25" name="actualHours" value={form.actualHours} onChange={changeField} placeholder="Not recorded" /></div>
                    <div className="col-md-4"><label className="form-label">Work location</label><select className="form-select" name="location" value={form.location} onChange={changeField}><option>Office</option><option>Home</option><option>On site</option><option>Hybrid</option><option>Other</option></select></div>
                    <div className="col-md-4"><label className="form-label">Status</label><select className="form-select" name="status" value={form.status} onChange={changeField}><option>Planned</option><option>In Progress</option><option>Completed</option><option>On Hold</option></select></div>
                    <div className="col-md-4"><label className="form-label">Completion (%)</label><input className="form-control" type="number" min="0" max="100" step="5" name="progress" value={form.progress} onChange={changeField} /><div className="form-text">Set to 100% when finished.</div></div>
                  </div>
                </div>
                <div className="modal-footer"><button type="button" className="btn btn-light" onClick={() => setShowForm(false)} disabled={saving}>Cancel</button><button type="submit" className="btn btn-primary" disabled={saving || !form.title.trim()}>{saving ? 'Saving…' : editingId ? 'Save changes' : 'Add to planner'}</button></div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WeeklyPlanner;
