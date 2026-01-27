import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

function PersonalDetails() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="mb-4 p-2 rounded d-flex justify-content-between align-items-center">
      <h3 className="h4 mb-3 text-start">Personal Details</h3>
      <h4 className="h5 mb-1 text-end">{user?.displayName || user?.email || 'User'}</h4>
    </div>
  );
}

export default PersonalDetails;