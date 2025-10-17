import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Test environment variables
  const envCheck = {
    MAILCHIMP_API_KEY: !!process.env.MAILCHIMP_API_KEY,
    MAILCHIMP_LIST_ID: !!process.env.MAILCHIMP_LIST_ID,
    MAILCHIMP_SERVER_PREFIX: !!process.env.MAILCHIMP_SERVER_PREFIX,
    API_KEY_LENGTH: process.env.MAILCHIMP_API_KEY?.length || 0,
    LIST_ID_LENGTH: process.env.MAILCHIMP_LIST_ID?.length || 0
  };

  return res.status(200).json({
    message: 'Environment check',
    environment: envCheck,
    timestamp: new Date().toISOString()
  });
}
