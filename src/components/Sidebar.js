import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

function Sidebar({ currentPage, onPageChange }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'projects', label: 'Projects' },
    { id: 'daily-entries', label: 'Daily Entries' },
    { id: 'reports', label: 'Reports' },
    { id: 'settings', label: 'Settings' }
  ];

  const handleLogout = () => signOut(auth);

  return (
    <div className="d-flex flex-column bg-light" style={{ width: '250px', height: '100vh' }}>
      <div className="p-3">
        <h5>Daily Standup</h5>
      </div>
      <nav className="flex-grow-1">
        <ul className="nav nav-pills flex-column">
          {menuItems.map(item => (
            <li key={item.id} className="nav-item">
              <button
                className={`nav-link w-100 text-start ${currentPage === item.id ? 'active' : 'text-dark'}`}
                onClick={() => onPageChange(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-3 mt-auto">
        <button onClick={handleLogout} className="btn btn-outline-danger w-100">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;