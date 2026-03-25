import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useFirestoreData } from '../hooks/useFirestoreData';
import { useProject } from '../context/ProjectContext';

function Sidebar({ currentPage, onPageChange }) {
  const { projects } = useFirestoreData();
  const { selectedProjectId, setSelectedProjectId } = useProject();

  const allMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2', mobileOnly: true },
    { id: 'projects', label: 'Projects', icon: 'bi-folder', mobileOnly: true },
    { id: 'daily-entries', label: 'Daily Entries', icon: 'bi-journal-text', mobileOnly: true },
    { id: 'reports', label: 'Reports', icon: 'bi-bar-chart', mobileOnly: false },
    { id: 'settings', label: 'Settings', icon: 'bi-gear', mobileOnly: true }
  ];

  const mobileItems = allMenuItems.filter(i => i.mobileOnly);
  const handleLogout = () => signOut(auth);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="d-none d-md-flex flex-column sidebar position-fixed" style={{ width: '12rem', height: '100vh' }}>
        <div className="p-3">
          <h5>Daily Standup</h5>
        </div>
        <div className="px-3 pb-2">
          <small className="text-white-50">Project</small>
          <select
            className="form-select form-select-sm mt-1"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            style={{ backgroundColor: '#415163', color: 'white', border: 'none', boxShadow: 'none' }}
          >
            <option value="all" style={{ backgroundColor: '#415163', color: 'white' }}>All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id} style={{ backgroundColor: '#415163', color: 'white' }}>{p.name}</option>
            ))}
          </select>
        </div>
        <nav className="flex-grow-1">
          <ul className="nav nav-pills flex-column">
            {allMenuItems.map(item => (
              <li key={item.id} className="nav-item">
                <button
                  className={`nav-link w-100 text-start ${currentPage === item.id ? 'active' : 'text-white'}`}
                  onClick={() => onPageChange(item.id)}
                >
                  <i className={`${item.icon} me-2`}></i>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-3 mt-auto">
          <button onClick={handleLogout} className="btn btn-outline-secondary w-100">
            <i className="bi-box-arrow-right me-2"></i>
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Top Bar */}
      <div className="d-flex d-md-none sidebar position-fixed w-100 top-0 px-3 py-2 align-items-center justify-content-between" style={{ zIndex: 1000 }}>
        <h6 className="mb-0 text-white">Daily Standup</h6>
        <select
          className="form-select form-select-sm w-auto"
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
          style={{ backgroundColor: '#415163', color: 'white', border: 'none', boxShadow: 'none' }}
        >
          <option value="all" style={{ backgroundColor: '#415163', color: 'white' }}>All Projects</option>
          {projects.map(p => (
            <option key={p.id} value={p.id} style={{ backgroundColor: '#415163', color: 'white' }}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="d-flex d-md-none fixed-bottom sidebar" style={{ zIndex: 1000 }}>
        {mobileItems.map(item => (
          <button
            key={item.id}
            className={`btn flex-fill py-2 d-flex flex-column align-items-center ${currentPage === item.id ? 'text-white fw-bold' : 'text-white-50'}`}
            style={{ fontSize: '0.65rem', background: 'none', border: 'none' }}
            onClick={() => onPageChange(item.id)}
          >
            <i className={`${item.icon} mb-1`} style={{ fontSize: '1.2rem' }}></i>
            {item.label}
          </button>
        ))}
        <button
          className="btn flex-fill py-2 d-flex flex-column align-items-center text-white-50"
          style={{ fontSize: '0.65rem', background: 'none', border: 'none' }}
          onClick={handleLogout}
        >
          <i className="bi-box-arrow-right mb-1" style={{ fontSize: '1.2rem' }}></i>
          Logout
        </button>
      </div>
    </>
  );
}

export default Sidebar;
