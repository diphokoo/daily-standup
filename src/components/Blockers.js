import { useFirestoreData } from '../hooks/useFirestoreData';

function Blockers() {
  const { entries, loading } = useFirestoreData();

  const blockers = loading ? '-' : entries.filter(e => e.status === 'Blockers').length;
  const isOnTrack = !loading && entries.filter(e => e.status === 'Blockers').length === 0;

  return (
    <div className="d-flex flex-column flex-md-row gap-3 mb-4">
      <div className="col-12 col-md-7 card rounded p-3 shadow border-0">
        <h5>Blockers</h5>
        <p className="text-muted mt-3">{loading ? 'Loading...' : blockers > 0 ? `${blockers} blocker(s)` : 'None'}</p>
      </div>
      <div className="col-12 col-md-5 card rounded p-3 shadow border-0">
        <h5>Status</h5>
        <h5 className="mt-3 fw-bold">
          {loading ? '...' : isOnTrack
            ? <><i className="bi bi-check-circle-fill text-success me-2"></i>On Track</>
            : <><i className="bi bi-exclamation-triangle-fill text-warning me-2"></i>Needs Attention</>
          }
        </h5>
      </div>
    </div>
  );
}

export default Blockers;
