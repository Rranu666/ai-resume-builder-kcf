import Anthropic from '@anthropic-ai/sdk';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { file_url, output_schema } = JSON.parse(event.body || '{}');

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 4096,
      system: 'Extract structured data from the provided content. Respond with valid JSON only.',
      messages: [{
        role: 'user',
        content: `Extract data from this file: ${file_url}\n\nReturn JSON matching this schema: ${JSON.stringify(output_schema || {})}`,
      }],
    });

    const text = message.content[0]?.text || '{}';
    const cleaned = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(JSON.parse(cleaned)),
    };
  } catch (error) {
    console.error('extract-data error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
