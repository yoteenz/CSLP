import { VercelRequest, VercelResponse } from '@vercel/node';

// Email validation function
async function validateEmail(email: string): Promise<{ valid: boolean; reason?: string }> {
  try {
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, reason: 'Invalid email format' };
    }

    // Extract domain from email
    const domain = email.split('@')[1].toLowerCase();
    
    // Check if domain exists using DNS lookup
    const dns = require('dns').promises;
    try {
      await dns.resolveMx(domain);
      return { valid: true };
    } catch (dnsError) {
      // If MX record doesn't exist, email domain is invalid
      return { valid: false, reason: 'Email domain does not exist' };
    }
  } catch (error) {
    console.error('Email validation error:', error);
    return { valid: false, reason: 'Validation failed' };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // First, validate if email actually exists and is deliverable
    const emailValidation = await validateEmail(email);
    if (!emailValidation.valid) {
      return res.status(400).json({ 
        message: 'THIS EMAIL DOESN\'T EXIST!',
        error: 'invalid_email'
      });
    }

    // Mailchimp API configuration
    const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
    const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;
    const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;

    if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID || !MAILCHIMP_SERVER_PREFIX) {
      console.error('Missing environment variables:', {
        MAILCHIMP_API_KEY: !!MAILCHIMP_API_KEY,
        MAILCHIMP_LIST_ID: !!MAILCHIMP_LIST_ID,
        MAILCHIMP_SERVER_PREFIX: !!MAILCHIMP_SERVER_PREFIX
      });
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Mailchimp API endpoint
    const MAILCHIMP_URL = `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`;

    // Prepare the data for Mailchimp
    const mailchimpData = {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: '',
        LNAME: ''
      }
    };

    // Send to Mailchimp
    const response = await fetch(MAILCHIMP_URL, {
      method: 'POST',
      headers: {
        'Authorization': `apikey ${MAILCHIMP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mailchimpData),
    });

    if (response.ok) {
      return res.status(200).json({ message: 'Successfully subscribed' });
    } else {
      const errorData = await response.json();
      console.error('Mailchimp error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      
      // Check if email already exists
      if (errorData.title === 'Member Exists' || 
          errorData.detail?.includes('already a list member') ||
          errorData.detail?.includes('already exists')) {
        return res.status(400).json({ 
          message: 'THIS EMAIL ALREADY EXISTS!',
          error: 'duplicate'
        });
      }
      
      return res.status(400).json({ 
        message: 'SIGN UP FAILED',
        error: errorData.title || 'Unknown error'
      });
    }
  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
