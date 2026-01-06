import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TokenSystemModule", (m) => {
  // 先部署 Token 合约
  const token = m.contract("Token");

  // 然后部署 TokenVault 合约，传入 Token 地址
  // ✅ 直接传递参数数组，而不是对象
  const tokenVault = m.contract("TokenVault", [token]);

  // 给第二个账户转账 1000 个代币
  const account1 = m.getAccount(1);
  m.call(token, "transfer", [account1, 1000n]);

  return { token, tokenVault };
});
