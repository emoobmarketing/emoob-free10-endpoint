const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, X-Form-Secret',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ ok: false, error: 'Method Not Allowed' }),
    };
  }

  const secretHeader = event.headers['x-form-secret'] || event.headers['X-Form-Secret'];
  const expectedSecret = process.env.FORM_SECRET;
  if (!expectedSecret || secretHeader !== expectedSecret) {
    return {
      statusCode: 401,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ ok: false, error: 'Unauthorized' }),
    };
  }

  const contentType = event.headers['content-type'] || '';
  let data = {};
  try {
    if (contentType.includes('application/json')) {
      data = JSON.parse(event.body || '{}');
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      data = Object.fromEntries(new URLSearchParams(event.body || ''));
    } else {
      return {
        statusCode: 415,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ ok: false, error: 'Unsupported Media Type' }),
      };
    }
  } catch {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ ok: false, error: 'Bad JSON' }),
    };
  }

  const email = (data.email || '').trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ ok: false, error: 'Invalid email' }),
    };
  }

  // ✅ Aún sin OneSignal: confirmamos recepción.
  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ ok: true, echo: { email } }),
  };
};
