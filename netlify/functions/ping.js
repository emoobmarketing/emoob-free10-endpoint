// netlify/functions/ping.js  (CommonJS para máxima compatibilidad)
exports.handler = async (event) => {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ok: true,
      name: "ping",
      method: event.httpMethod,
      now: new Date().toISOString()
    })
  };
};
