import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import Login from './Login';
import Register from './Register';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import DailyEntries from './pages/DailyEntries';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && !showSuccessModal) {
        // If user just registered, show modal instead of logging in
        if (showRegister) {
          setShowSuccessModal(true);
          auth.signOut();
        } else {
          setUser(currentUser);
        }
      } else if (!currentUser) {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [showRegister, showSuccessModal]);

  const handleLogout = () => signOut(auth);

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setShowRegister(false);
  };

  if (loading) return null;

  if (showSuccessModal) {
    return (
      <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-success">Success!</h5>
            </div>
            <div className="modal-body text-center">
              <p className="fs-5">You've successfully registered.</p>
              <p>Now log in</p>
            </div>
            <div className="modal-footer">
              <button onClick={handleCloseModal} className="btn btn-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return showRegister ? 
      <Register onBackToLogin={() => setShowRegister(false)} /> : 
      <Login onLogin={() => {}} onShowRegister={() => setShowRegister(true)} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'projects': return <Projects />;
      case 'daily-entries': return <DailyEntries />;
      case 'reports': return <Reports />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="d-flex">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="flex-grow-1 loggedInContent">
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
