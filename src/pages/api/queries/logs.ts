import type { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

interface AuthedRequest extends NextApiRequest {
  user?: { uid: string };
}

const logs: Map<string, { count: number }> = new Map();

export default async function handler(req: AuthedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { user } = req;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const logEntry = req.body;

  if (!logEntry || !logEntry.query || !logEntry.timestamp) {
    return res.status(400).json({ message: 'Invalid log entry' });
  }

  try {
    const logId = `${user.uid}-${logEntry.query}`;

    if (!logs.has(logId)) {
      logs.set(logId, { count: 0 });
    }

    const currentEntry = logs.get(logId);
    if (currentEntry) {
      currentEntry.count++;
    }

    await admin.firestore().collection('queryLogs').add({
      uid: user.uid,
      query: logEntry.query,
      timestamp: new Date(logEntry.timestamp),
      count: currentEntry?.count,
    });

    return res.status(200).json({ message: 'Log entry successful', count: currentEntry?.count });
  } catch (err) {
    return res.status(500).json({ message: err instanceof Error ? err.message : String(err) });
  }
}