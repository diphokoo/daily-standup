import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import entriesData from '../data/entriesData.json';

function Graph() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.example.com/data');
        if (!response.ok) throw new Error('API failed');
        const apiData = await response.json();
        setData(apiData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        
        // Group entries by date and count completed tasks
        const last7Days = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          
          const completedCount = entriesData.entries.filter(
            e => e.date === dateStr && e.status === 'Completed'
          ).length;
          
          last7Days.push({ name: dayName, value: completedCount });
        }
        
        setData(last7Days);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="card mb-4 shadow-lg rounded p-3 gap-3 border-0" style={{ marginRight: '-1%' }}>
      <h5>Project Progress</h5>
      <div style={{ height: '300px', marginTop: '20px' }}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <defs>
                <filter id="shadow" height="200%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
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