const express = require("express");
const PayOS = require("@payos/node");

// Khởi tạo đối tượng Payos với thông tin API // private
const payos = new PayOS(clientId, apiKey, checkSum);

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.json());

const YOUR_DOMAIN = "http://localhost:3000";

function generateOrderCode(length) {
  const characters = "0123456789";
  let orderCode = "";
  for (let i = 0; i < length; i++) {
    orderCode += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return parseInt(orderCode);
}

app.post("/create-payment-link", async (req, res) => {
  const order = {
    amount: 10000,
    description: "Thanh toan sach",
    orderCode: generateOrderCode(6),
    returnUrl: `${YOUR_DOMAIN}/success.html`,
    cancelUrl: `${YOUR_DOMAIN}/cancel.html`,
  };

  try {
    const paymentLink = await payos.createPaymentLink(order);
    res.redirect(303, paymentLink.checkoutUrl);
  } catch (error) {
    console.error("Lỗi khi tạo liên kết thanh toán:", error);
    res.status(500).json({ error: "Lỗi khi tạo liên kết thanh toán" });
  }
});

// webhook-url https using ngrok  https://924b-1-52-3-44.ngrok-free.app
app.post("/receive-hook", async (req, res) => {
  console.log(req.body);
  res.json();
});

app.listen(port, () => {
  console.log(`Máy chủ đang chạy tại http://localhost:${port}`);
});
