export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { prompt, size = '1024x1024', quality = 'standard' } = JSON.parse(event.body || '{}');

    const openAiKey = process.env.OPENAI_API_KEY;
    if (!openAiKey) {
      return { statusCode: 501, body: JSON.stringify({ error: 'OPENAI_API_KEY not configured' }) };
    }

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, n: 1, size, quality }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Image generation failed');

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: data.data[0]?.url }),
    };
  } catch (error) {
    console.error('generate-image error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
