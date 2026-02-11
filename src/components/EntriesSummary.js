function EntriesSummary() {
  const summary = [
    { label: 'Completed', value: 42, iconColor: 'text-primary', icon: 'bi bi-check-circle-fill' },
    { label: 'To Do', value: 12, iconColor: 'text-success', icon: 'bi bi-check-circle-fill' },
    { label: 'Blockers', value: 5, iconColor: 'text-warning', icon: 'bi-exclamation-triangle-fill' }
  ];

  return (
    <div className="d-flex gap-3 mb-4">
      {summary.map((item, index) => (
        <div key={index} className="card border-0 flex-fill p-3">
          <div className="d-flex align-items-center gap-3 mb-2">
            <i className={`${item.icon} ${item.iconColor}`} style={{ fontSize: '1.2rem' }}></i>
            <h3 className="mb-0">{item.value}</h3>
          </div>
          <h6 className="text-muted">{item.label}</h6>
        </div>
      ))}
    </div>
  );
}

export default EntriesSummary;