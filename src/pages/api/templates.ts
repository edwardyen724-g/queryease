import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@supabase/supabase-js';
import { dbConnect } from '../../lib/mongoose'; // Adjust import based on your project structure
import TemplateModel from '../../models/Template'; // Adjust import based on your project structure

interface AuthedRequest extends NextApiRequest {
  user?: { id: string };
}

const templatesMap = new Map<string, number>(); // Simple in-memory rate limiting

export default async function handler(req: AuthedRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const session = await getSession(req);
      if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const templates = await TemplateModel.find({ userId: session.user.id });
      res.status(200).json(templates);
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    }
  } else if (req.method === 'POST') {
    try {
      const session = await getSession(req);
      if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (templatesMap.has(session.user.id) && templatesMap.get(session.user.id)! >= 5) {
        return res.status(429).json({ error: 'Rate limit exceeded. Try again later.' });
      }

      const newTemplate = new TemplateModel({ ...req.body, userId: session.user.id });
      await newTemplate.save();

      templatesMap.set(session.user.id, (templatesMap.get(session.user.id) || 0) + 1);
      setTimeout(() => {
        templatesMap.set(session.user.id, (templatesMap.get(session.user.id) || 1) - 1);
      }, 60000); // Reset limit after 1 minute

      res.status(201).json(newTemplate);
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}