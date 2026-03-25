import { useFirestoreData } from '../hooks/useFirestoreData';

function EntriesSummary() {
  const { entries, loading } = useFirestoreData();

  const completed = entries.filter(e => e.status === 'Completed').length;
  const toDo = entries.filter(e => e.status === 'To Do').length;
  const blockers = entries.filter(e => e.status === 'Blockers').length;

  const summary = [
    { label: 'Completed', value: completed, iconColor: 'text-primary', icon: 'bi bi-check-circle-fill' },
    { label: 'To Do', value: toDo, iconColor: 'text-success', icon: 'bi bi-check-circle-fill' },
    { label: 'Blockers', value: blockers, iconColor: 'text-warning', icon: 'bi bi-exclamation-triangle-fill' }
  ];

  return (
    <div className="d-flex flex-column flex-md-row gap-3 mb-4">
      {summary.map((item, index) => (
        <div key={index} className="card border-0 shadow flex-fill p-3">
          <div className="d-flex align-items-center gap-3 mb-2">
            <i className={`${item.icon} ${item.iconColor}`} style={{ fontSize: '1.2rem' }}></i>
            <h3 className="mb-0">{loading ? '-' : item.value}</h3>
          </div>
          <h6 className="text-muted">{item.label}</h6>
        </div>
      ))}
    </div>
  );
}

export default EntriesSummary;
