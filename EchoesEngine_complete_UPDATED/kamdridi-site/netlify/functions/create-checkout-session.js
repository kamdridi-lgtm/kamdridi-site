// Netlify Function: create-checkout-session
// Creates a Stripe Checkout Session from a Stripe price_id (e.g., price_123...)
const Stripe = require("stripe");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, headers: { "Allow": "POST" }, body: "Method Not Allowed" };
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return { statusCode: 500, body: JSON.stringify({ error: "Missing STRIPE_SECRET_KEY env var" }) };
    }

    const stripe = new Stripe(secretKey, { apiVersion: "2023-10-16" });

    let payload = {};
    try {
      payload = JSON.parse(event.body || "{}");
    } catch (e) {
      payload = {};
    }

    const priceId = payload.priceId;
    const quantity = Number(payload.quantity || 1);
    const mode = (payload.mode === "subscription") ? "subscription" : "payment";
    const cancelPath = (typeof payload.cancelPath === "string" && payload.cancelPath.startsWith("/")) ? payload.cancelPath : "/merch.html";
    const successPath = (typeof payload.successPath === "string" && payload.successPath.startsWith("/")) ? payload.successPath : "/success.html";
    const productKey = typeof payload.productKey === "string" ? payload.productKey : "";
    const productName = typeof payload.productName === "string" ? payload.productName : "";

    if (!priceId || typeof priceId !== "string" || !priceId.startsWith("price_")) {
      return { statusCode: 400, body: JSON.stringify({ error: "Invalid priceId" }) };
    }

    // Build absolute URLs
    const proto = (event.headers["x-forwarded-proto"] || "https").split(",")[0].trim();
    const host = (event.headers["x-forwarded-host"] || event.headers.host || "").split(",")[0].trim();
    const origin = host ? `${proto}://${host}` : "";

    const successUrl = `${origin}${successPath}?session_id={CHECKOUT_SESSION_ID}&product=${encodeURIComponent(productKey)}`;
    const cancelUrl = `${origin}${cancelPath}`;

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price: priceId, quantity }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      client_reference_id: productKey || undefined,
      metadata: {
        productKey,
        productName
      },
      // You can enable shipping address collection if needed:
      // shipping_address_collection: { allowed_countries: ["CA","US"] },
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message || "Server error" }),
    };
  }
};
