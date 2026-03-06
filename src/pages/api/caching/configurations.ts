import { NextApiRequest, NextApiResponse } from 'next';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';

const firebaseApp = initializeApp({
  credential: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

const db = getFirestore(firebaseApp);

interface AuthedRequest extends NextApiRequest {
  userId?: string;
}

const configurationsHandler = async (req: AuthedRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const snapshot = await db.collection('cachingConfigurations').get();
    const configurations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return res.status(200).json(configurations);
  } catch (err) {
    return res.status(500).json({ message: err instanceof Error ? err.message : String(err) });
  }
};

export default configurationsHandler;