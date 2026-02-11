import EntriesSummary from '../components/EntriesSummary';
import Entries from '../components/Entries';

function DailyEntries() {
  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="text-start mt-2">
          Daily Entries
        </h4>
        <button className="btn btn-primary text-end">
          <i className="bi bi-plus-lg me-2"></i>
          New Entry
        </button>
      </div>
      <span className="text-muted d-block mb-4">Tracking over 14-day period</span>
      <EntriesSummary />
      <Entries />
    </div>
  );
}

export default DailyEntries;