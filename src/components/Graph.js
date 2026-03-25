import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFirestoreData } from '../hooks/useFirestoreData';

function Graph() {
  const { entries, loading } = useFirestoreData();

  const data = useMemo(() => {
    const last7Days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const completedCount = entries.filter(e => e.date === dateStr && e.status === 'Completed').length;
      last7Days.push({ name: dayName, value: completedCount });
    }
    return last7Days;
  }, [entries]);

  return (
    <div className="card mb-4 shadow-lg rounded p-3 gap-3 border-0" style={{ marginRight: '-1%' }}>
      <h5>Project Progress</h5>
      <div style={{ height: '300px', marginTop: '20px' }}>
        {loading ? (
          <p className="text-muted">Loading...</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <defs>
                <filter id="shadow" height="200%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#0d6efd" strokeWidth={3} filter="url(#shadow)" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default Graph;
