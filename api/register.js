const LIVE_APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzppQJykXlE2bViMdEbzUn8PZ0yx6tDUtbfIiVBMnRriwWVbLW2lrytJhyoiWxAezpG/exec';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // Health check proxy
    try {
      const pingUrl = `${LIVE_APPS_SCRIPT_URL}?action=ping`;
      const upstreamRes = await fetch(pingUrl, {
        method: 'GET',
        redirect: 'follow',
      });
      const data = await upstreamRes.text();
      return res.status(200).send(data);
    } catch (e) {
      return res.status(500).json({ status: 'error', message: e?.message || 'Apps Script unreachable' });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
  }

  try {
    let payload = req.body;
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch {
        // Keep as string if parsing fails
      }
    }

    if (!payload) {
      return res.status(400).json({ status: 'error', message: 'Empty registration payload' });
    }

    const targetUrl =
      process.env.VITE_API_URL && !process.env.VITE_API_URL.includes('AKfycbzCGnTzRNa')
        ? process.env.VITE_API_URL
        : LIVE_APPS_SCRIPT_URL;

    // Node fetch executes server-to-server and automatically follows Google 302 redirects
    const upstreamRes = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    const responseText = await upstreamRes.text();

    try {
      const json = JSON.parse(responseText);
      return res.status(200).json(json);
    } catch {
      return res.status(200).send(responseText);
    }
  } catch (error) {
    return res.status(502).json({
      status: 'error',
      message: 'Proxy forwarding to Google Apps Script failed: ' + (error?.message || 'Unknown network error'),
    });
  }
}
