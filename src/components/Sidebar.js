import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

function Sidebar({ currentPage, onPageChange }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { id: 'projects', label: 'Projects', icon: 'bi-folder' },
    { id: 'daily-entries', label: 'Daily Entries', icon: 'bi-journal-text' },
    { id: 'reports', label: 'Reports', icon: 'bi-bar-chart' },
    { id: 'settings', label: 'Settings', icon: 'bi-gear' }
  ];

  const handleLogout = () => signOut(auth);

  return (
    <div className="d-flex flex-column sidebar" style={{ width: '12rem', height: '100vh' }}>
      <div className="p-3">
        <h5>Daily Standup</h5>
      </div>
      <nav className="flex-grow-1">
        <ul className="nav nav-pills flex-column">
          {menuItems.map(item => (
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
  );
}

export default Sidebar;