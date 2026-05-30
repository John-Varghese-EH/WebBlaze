import { processAudit } from '../src/lib/auditLogic';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const result = await processAudit(url);
    res.status(200).json(result);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: 'Failed to analyze URL', details: error.message });
  }
}
