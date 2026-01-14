import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import Login from './Login';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const handleLogout = () => signOut(auth);

  if (!user) {
    return <Login onLogin={() => {}} />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome, {user.email}</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>
    </div>
  );
}

export default App;
