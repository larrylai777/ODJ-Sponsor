import { describe, expect, it } from "vitest";
import {
  buildEcpayOrder,
  genCheckMacValue,
  genMerchantTradeNo,
  loadEcpayConfig,
  verifyCheckMacValue,
} from "../../../server/ecpay";

describe("ecpay CheckMacValue", () => {
  const hashKey = "5294y06JbISpM5x9";
  const hashIv = "v77hoKGq4kWxNNIS";

  it("產生的檢查碼可以用同樣的參數自我驗證通過", () => {
    const params = {
      MerchantID: "2000132",
      MerchantTradeNo: "TEST12345",
      MerchantTradeDate: "2026/08/19 12:00:00",
      PaymentType: "aio",
      TotalAmount: "390",
      TradeDesc: "ODJ Sponsor Pure Support",
      ItemName: "老東家｜晨光支持者（純支持）",
      ReturnURL: "https://example.com/api/ecpay/notify",
      ChoosePayment: "ALL",
      ClientBackURL: "https://example.com/project/moon-archive?ecpay=return",
      EncryptType: "1",
    };

    const checkMacValue = genCheckMacValue(params, hashKey, hashIv);
    expect(checkMacValue).toMatch(/^[0-9A-F]{64}$/);
    expect(
      verifyCheckMacValue(
        { ...params, CheckMacValue: checkMacValue },
        hashKey,
        hashIv
      )
    ).toBe(true);
  });

  it("任何欄位被竄改都會讓檢查碼驗證失敗", () => {
    const params = { A: "1", B: "2" };
    const checkMacValue = genCheckMacValue(params, hashKey, hashIv);
    expect(
      verifyCheckMacValue(
        { A: "1", B: "999", CheckMacValue: checkMacValue },
        hashKey,
        hashIv
      )
    ).toBe(false);
  });

  it("缺少 CheckMacValue 欄位時驗證失敗", () => {
    expect(verifyCheckMacValue({ A: "1" }, hashKey, hashIv)).toBe(false);
  });
});

describe("genMerchantTradeNo", () => {
  it("只包含英數字，且不超過 20 字元", () => {
    const tradeNo = genMerchantTradeNo();
    expect(tradeNo).toMatch(/^[A-Z0-9]+$/);
    expect(tradeNo.length).toBeLessThanOrEqual(20);
  });
});

describe("loadEcpayConfig", () => {
  it("未設定環境變數時，預設為綠界測試環境", () => {
    const config = loadEcpayConfig();
    expect(config.env).toBe("test");
    expect(config.merchantId).toBe("2000132");
  });
});

describe("buildEcpayOrder", () => {
  it("依方案帶入正確金額與品名，並附上有效的檢查碼", () => {
    const config = loadEcpayConfig();
    const order = buildEcpayOrder({
      planId: "book",
      slug: "moon-archive",
      appBaseUrl: "https://example.com",
      config,
    });

    expect(order.actionUrl).toContain("payment-stage.ecpay.com.tw");
    expect(order.params.TotalAmount).toBe("890");
    expect(order.params.ReturnURL).toBe("https://example.com/api/ecpay/notify");
    expect(order.params.ClientBackURL).toBe(
      "https://example.com/project/moon-archive?ecpay=return"
    );
    expect(
      verifyCheckMacValue(order.params, config.hashKey, config.hashIv)
    ).toBe(true);
  });
});
