require("dotenv").config();
const express = require("express");
const cors    = require("cors");
const fetch   = require("node-fetch");

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "Angel Mart charge server is running ✅" });
});

// POST /charge
// Body: { token, amountCents, orderId, customerName, email }
app.post("/payment", async (req, res) => {
  const { token, amountCents, orderId, customerName, email } = req.body;

  if (!token || !amountCents || !orderId) {
    return res.status(400).json({ error: "Missing required fields: token, amountCents, orderId" });
  }
  if (typeof amountCents !== "number" || amountCents <= 0) {
    return res.status(400).json({ error: "amountCents must be a positive number" });
  }

  const env      = process.env.CLOVER_ENV || "sandbox";
  const baseUrl  = env === "sandbox"
    ? "https://scl-sandbox.dev.clover.com"
    : "https://api.clover.com";
  const apiToken = process.env.CLOVER_API_TOKEN;

  if (!apiToken) {
    return res.status(500).json({ error: "CLOVER_API_TOKEN not set in functions/.env" });
  }

  try {
    const response = await fetch(`${baseUrl}/v1/charges`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiToken}`,
        "Content-Type":  "application/json",
        "Accept":        "application/json",
      },
      body: JSON.stringify({
        amount:      amountCents,
        currency:    "usd",
        source:      token,
        description: `Angel Mart Order ${orderId} — ${customerName || ""}`.trim(),
        metadata: {
          order_id:       orderId,
          customer_name:  customerName || "",
          customer_email: email || "",
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Clover charge failed:", data);
      return res.status(400).json({
        error: data?.message || data?.error?.message || "Payment failed",
      });
    }

    console.log(`✅ Charge: ${data.id} | Order: ${orderId} | $${(amountCents / 100).toFixed(2)}`);
    return res.status(200).json({ success: true, chargeId: data.id });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Angel Mart charge server → http://localhost:${PORT}`);
});
