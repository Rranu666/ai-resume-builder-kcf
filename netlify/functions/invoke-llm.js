import Anthropic from '@anthropic-ai/sdk';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { prompt, response_json_schema, add_context_from_user_prompt } = JSON.parse(event.body || '{}');

    if (!prompt) {
      return { statusCode: 400, body: JSON.stringify({ error: 'prompt is required' }) };
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    let systemPrompt = 'You are a helpful AI assistant specializing in resume writing, career coaching, and professional development.';

    if (response_json_schema) {
      systemPrompt += ' You MUST respond with valid JSON only. No markdown, no code blocks, no explanation — just raw JSON that matches the requested schema.';
    }

    const messages = [{ role: 'user', content: prompt }];

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      system: systemPrompt,
      messages,
    });

    const text = message.content[0]?.text || '';

    if (response_json_schema) {
      // Strip any accidental markdown fences before parsing
      const cleaned = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
      try {
        const parsed = JSON.parse(cleaned);
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed),
        };
      } catch {
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        };
      }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    };
  } catch (error) {
    console.error('invoke-llm error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
