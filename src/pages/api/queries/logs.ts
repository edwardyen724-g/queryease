import type { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';

interface AuthedRequest extends NextApiRequest {
  user?: { uid: string };
}

const logs: Map<string, number> = new Map();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

const handler = async (req: AuthedRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { queryId, status, responseTime, error } = req.body;

  if (!queryId || !status || (responseTime === undefined)) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  // Rate limiting
  const currentTime = Date.now();
  const rateLimitKey = `${clientIp}:${queryId}`;
  const requests = logs.get(rateLimitKey) || 0;

  if (requests >= 5) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  logs.set(rateLimitKey, requests + 1);
  setTimeout(() => logs.delete(rateLimitKey), 60000);

  try {
    await admin.firestore().collection('queryLogs').add({
      queryId,
      status,
      responseTime,
      error: error || null,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(201).json({ message: 'Log created successfully' });
  } catch (err) {
    return res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
};

export default handler;