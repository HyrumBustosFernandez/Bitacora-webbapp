export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/claude' && request.method === 'POST') {
      const body = await request.json();

      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(body),
      });

      const data = await resp.json();
      return new Response(JSON.stringify(data), {
        status: resp.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Let Cloudflare Assets handle everything else
    return env.ASSETS.fetch(request);
  },
};
