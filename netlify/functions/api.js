// netlify/functions/api.js
// Node 18+ no Netlify já traz fetch global
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxih8mATdN2PWg92GGMVe4F2cGe-u84G3PuGeISwN_83DygwMrhu18pLP5fYckazVRM/exec';

exports.handler = async (event) => {
  // cabeçalhos CORS que serão retornados em todas as respostas
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
  };

  // Responde ao preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  try {
    let resp;
    // Repassa GET
    if (event.httpMethod === 'GET') {
      resp = await fetch(SCRIPT_URL);
    }
    // Repassa POST
    else if (event.httpMethod === 'POST') {
      resp = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: event.body
      });
    } else {
      return { statusCode: 405, headers, body: 'Method Not Allowed' };
    }

    const text = await resp.text();
    return {
      statusCode: resp.status,
      headers,
      body: text
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};
