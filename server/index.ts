import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { isEcpayPlanId } from "../shared/ecpayPlans.js";
import {
  buildEcpayOrder,
  loadEcpayConfig,
  renderEcpayAutoSubmitForm,
  verifyCheckMacValue,
} from "./ecpay.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.urlencoded({ extended: false }));

  // 綠界（ECPay）純支持結帳：導向此網址即開始下單，伺服器回傳自動送出到綠界的中繼頁面。
  app.get("/api/ecpay/checkout", (req, res) => {
    const planId = String(req.query.plan ?? "");
    const slug = String(req.query.slug ?? "moon-archive");

    if (!isEcpayPlanId(planId)) {
      res.status(400).send("未知的支持方案");
      return;
    }

    const config = loadEcpayConfig();
    const appBaseUrl = `${req.protocol}://${req.get("host")}`;
    const order = buildEcpayOrder({ planId, slug, appBaseUrl, config });

    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(renderEcpayAutoSubmitForm(order));
  });

  // 綠界背景通知（ReturnURL）：付款結果的伺服器對伺服器通知，驗證檢查碼後必須回應純文字 "1|OK"。
  app.post("/api/ecpay/notify", (req, res) => {
    const config = loadEcpayConfig();
    const body = req.body as Record<string, string>;
    const isValid = verifyCheckMacValue(body, config.hashKey, config.hashIv);

    if (!isValid) {
      console.error("[ecpay] CheckMacValue 驗證失敗", body);
      res.status(400).send("0|CheckMacValueError");
      return;
    }

    // TODO：驗證成功後應將 body.MerchantTradeNo 對應的訂單標記為已付款（目前尚無資料庫，先記錄於伺服器日誌）。
    console.log("[ecpay] 收到付款通知", {
      MerchantTradeNo: body.MerchantTradeNo,
      RtnCode: body.RtnCode,
      TradeAmt: body.TradeAmt,
    });

    res.set("Content-Type", "text/plain");
    res.send("1|OK");
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
