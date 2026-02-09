function Blockers() {
  return (
    <div className="d-flex gap-3 mb-4">
      <div className="col-md-7 card rounded p-3 shadow border-0">
        <h5>Today's Stats</h5>
        
        <p className="text-muted mt-3"> None</p>
      </div>

      <div className="col-md-5 card rounded p-3 shadow border-0">
          <h5>Daily Entries</h5>

          <h5 className="mt-3 fw-bold"><i className="bi bi-check-circle-fill text-success me-2"></i>On Track</h5>

      </div>
    </div>
  );
}

export default Blockers;