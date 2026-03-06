import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useUser } from '../../context/UserContext';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const [queries, setQueries] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
          .from('queries')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        setQueries(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, [user]);

  if (loading) return <div>Loading your queries...</div>;
  if (error) return <div>Error fetching queries: {error}</div>;

  return (
    <div>
      <h1>Transform Your Query Management Experience</h1>
      <h2>Your Queries</h2>
      {queries.length === 0 ? (
        <p>No queries found. Start adding some!</p>
      ) : (
        <ul>
          {queries.map((query) => (
            <li key={query.id}>
              <h3>{query.name}</h3>
              <p>Status: {query.status}</p>
              <p>Response Time: {query.response_time} ms</p>
              <p>Last Updated: {new Date(query.updated_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;