import { useState, useEffect, useCallback } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useProject } from '../context/ProjectContext';

export function useFirestoreData() {
  const [projects, setProjects] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [allEntries, setAllEntries] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(true);

  const ctx = useProject();
  const selectedProjectId = ctx ? ctx.selectedProjectId : 'all';

  const refetch = useCallback(() => {}, []);

  useEffect(() => {
    let unsubscribers = [];

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      unsubscribers.forEach(u => u());
      unsubscribers = [];

      if (!user) { setLoading(false); return; }

      const userPath = `users/${user.uid}`;
      setLoading(true);
      let loadedCount = 0;
      const totalListeners = 4;

      const onLoad = () => {
        loadedCount++;
        if (loadedCount >= totalListeners) setLoading(false);
      };

      unsubscribers.push(
        onSnapshot(query(collection(db, `${userPath}/projects`), orderBy('id')), snap => {
          setProjects(snap.docs.map(d => ({ ...d.data(), docId: d.id })));
          onLoad();
        }),
        onSnapshot(query(collection(db, `${userPath}/sprints`), orderBy('sprintNumber')), snap => {
          setSprints(snap.docs.map(d => ({ ...d.data(), docId: d.id })));
          onLoad();
        }),
        onSnapshot(query(collection(db, `${userPath}/entries`), orderBy('date', 'desc')), snap => {
          setAllEntries(snap.docs.map(d => ({ ...d.data(), docId: d.id })));
          onLoad();
        }),
        onSnapshot(collection(db, `${userPath}/settings`), snap => {
          if (!snap.empty) setProjectName(snap.docs[0].data().projectName || '');
          onLoad();
        })
      );
    });

    return () => {
      unsubscribeAuth();
      unsubscribers.forEach(u => u());
    };
  }, []);

  const entries = selectedProjectId === 'all'
    ? allEntries
    : allEntries.filter(e => e.project === projects.find(p => p.id === selectedProjectId)?.name);

  const filteredProjects = selectedProjectId === 'all'
    ? projects
    : projects.filter(p => p.id === selectedProjectId);

  return { projects, filteredProjects, sprints, entries, projectName, loading, refetch };
}
