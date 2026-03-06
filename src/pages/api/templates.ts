import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';

interface AuthedRequest extends NextApiRequest {
  userId?: string;
}

const uri = process.env.MONGODB_URI as string;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(uri, options);

const templateSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
});

const Template = mongoose.models.Template || mongoose.model('Template', templateSchema);

const rateLimit = new Map<string, number>();

export default async function handler(req: AuthedRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const templates = await Template.find({});
      return res.status(200).json(templates);
    }

    if (req.method === 'POST') {
      const rateLimitKey = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const currentTime = Date.now();
      
      if (rateLimit.has(rateLimitKey as string)) {
        const lastRequestTime = rateLimit.get(rateLimitKey as string)!;
        if (currentTime - lastRequestTime < 1000) {
          return res.status(429).json({ message: 'Too many requests. Please try again later.' });
        }
      }

      rateLimit.set(rateLimitKey as string, currentTime);

      const { title, content } = req.body;
      if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required.' });
      }

      const newTemplate = new Template({ title, content });
      await newTemplate.save();

      return res.status(201).json(newTemplate);
    }

    return res.setHeader('Allow', ['GET', 'POST']).status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    return res.status(500).json({ message: err instanceof Error ? err.message : String(err) });
  }
}