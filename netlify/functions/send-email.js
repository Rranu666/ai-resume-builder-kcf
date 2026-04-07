export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { to, subject, body, from_name, reply_to } = JSON.parse(event.body || '{}');

    if (!to || !subject || !body) {
      return { statusCode: 400, body: JSON.stringify({ error: 'to, subject, and body are required' }) };
    }

    // Using Resend (https://resend.com) — set RESEND_API_KEY in Netlify env vars
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.warn('RESEND_API_KEY not set — email not sent');
      return { statusCode: 200, body: JSON.stringify({ success: true, skipped: true }) };
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: from_name ? `${from_name} <noreply@resend.dev>` : 'AI Resume Builder <noreply@resend.dev>',
        to: Array.isArray(to) ? to : [to],
        subject,
        html: body,
        reply_to,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send email');
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, id: data.id }),
    };
  } catch (error) {
    console.error('send-email error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
