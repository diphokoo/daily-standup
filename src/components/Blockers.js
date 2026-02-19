import sprintData from '../data/sprintData.json';
import entriesData from '../data/entriesData.json';

function Blockers() {
  const blockers = entriesData.entries.filter(e => e.status === 'Blockers').length;

  return (
    <div className="d-flex gap-3 mb-4">
      <div className="col-md-7 card rounded p-3 shadow border-0">
        <h5>Blockers</h5>
        
        <p className="text-muted mt-3">{blockers > 0 ? `${blockers} blockers` : 'None'}</p>
      </div>

      <div className="col-md-5 card rounded p-3 shadow border-0">
          <h5>Daily Entries</h5>

          <h5 className="mt-3 fw-bold"><i className="bi bi-check-circle-fill text-success me-2"></i>On Track</h5>

      </div>
    </div>
  );
}

export default Blockers;