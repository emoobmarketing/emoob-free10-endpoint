// netlify/functions/onesignal-subscribe.js
exports.handler = async (event) => {
  // Solo aceptamos POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body || "{}");

    // Asegúrate de que el campo del formulario se llame "email"
    const email = data.email || data.Email || data.FREE10 || "";
    const isEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

    if (!isEmail) {
      return { statusCode: 400, body: "email required" };
    }

    // Aquí todavía NO llamamos a Mailchimp/OneSignal.
    // Solo confirmamos que el flujo funciona.
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true, email })
    };
  } catch (e) {
    return { statusCode: 500, body: e.message || "error" };
  }
};
