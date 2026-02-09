import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
        setData([
          { name: 'Mon', value: 12 },
          { name: 'Tue', value: 19 },
          { name: 'Wed', value: 15 },
          { name: 'Thu', value: 25 },
          { name: 'Fri', value: 22 },
          { name: 'Sat', value: 30 },
          { name: 'Sun', value: 28 }
        ]);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="card mb-4 shadow rounded p-3 gap-3 border-0" style={{ marginRight: '-1%' }}>
      <h5>Project Progress</h5>
      <div style={{ height: '300px', marginTop: '20px' }}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default Graph;