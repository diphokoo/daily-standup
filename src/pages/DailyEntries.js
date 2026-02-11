function DailyEntries() {
  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="text-start mt-2">
          Daily Entries
        </h4>
        <button className="btn btn-primary text-end">
          <i className="bi bi-plus-lg me-2"></i>
          New Entry
        </button>
      </div>
      <span className="text-muted">Tracking over 14-day period</span>
    </div>
  );
}

export default DailyEntries;