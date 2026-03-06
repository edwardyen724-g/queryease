import { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';

interface AuthedRequest extends NextApiRequest {
  user?: { uid: string };
}

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const configurationsCache = new Map<string, any>();

export default async function handler(req: AuthedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (configurationsCache.has(userId)) {
      return res.status(200).json(configurationsCache.get(userId));
    }

    const configurations = await admin.firestore().collection('cachingConfigurations').doc(userId).get();

    if (!configurations.exists) {
      return res.status(404).json({ message: 'Configurations not found' });
    }

    configurationsCache.set(userId, configurations.data());
    return res.status(200).json(configurations.data());
  } catch (err) {
    return res.status(500).json({ message: err instanceof Error ? err.message : String(err) });
  }
}