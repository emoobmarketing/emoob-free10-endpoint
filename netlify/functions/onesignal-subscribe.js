// netlify/functions/onesignal-subscribe.js
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  try {
    const data = JSON.parse(event.body || "{}");
    if (!data.email) return { statusCode: 400, body: "email required" };

    // aquí luego añadimos la llamada a OneSignal
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true, email: data.email })
    };
  } catch (e) {
    return { statusCode: 500, body: e.message || "error" };
  }
};
