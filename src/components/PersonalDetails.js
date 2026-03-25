import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { useProject } from '../context/ProjectContext';
import { useFirestoreData } from '../hooks/useFirestoreData';

function PersonalDetails() {
  const [user, setUser] = useState(null);
  const { projects } = useFirestoreData();
  const { selectedProjectId } = useProject();

  const selectedProject = selectedProjectId === 'all' ? null : projects.find(p => p.id === selectedProjectId);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="mb-4 p-2 rounded d-flex justify-content-between align-items-center">
      <h4 className="h4 mb-3 text-start">Personal Details</h4>
      <h4 className="h5 mb-1 text-end">
        <span>{user?.displayName || user?.email || 'User'}</span>
        {selectedProject && <span className="text-muted ms-2">· <span>{selectedProject.name}</span></span>}
      </h4>
    </div>
  );
}

export default PersonalDetails;
