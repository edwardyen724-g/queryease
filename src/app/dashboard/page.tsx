import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchQueryStatus } from '../../lib/api';
import { QueryStatus } from '../../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [queryStatus, setQueryStatus] = useState<QueryStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getQueryStatus = async () => {
      try {
        const status = await fetchQueryStatus(user?.id);
        setQueryStatus(status);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      getQueryStatus();
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Transform Your Query Management Experience</h1>
      <h2>Timed Caching Configurations</h2>
      <p>Optimize performance based on your settings.</p>
      <h2>Visualization Dashboard</h2>
      <div>
        <h3>Query Status</h3>
        <ul>
          {queryStatus.map((status) => (
            <li key={status.id}>
              <strong>Query:</strong> {status.query}
              <strong>Status:</strong> {status.status}
              <strong>Response Time:</strong> {status.responseTime} ms
            </li>
          ))}
        </ul>
      </div>
      <h2>Debugging Tools</h2>
      <p>API request/response logs are available for your queries.</p>
      <h2>Integration Wizards</h2>
      <p>Easily embed support into your existing projects.</p>
      <h2>Pre-built Templates</h2>
      <p>Based on best practices for common querying patterns.</p>
    </div>
  );
};

export default Dashboard;