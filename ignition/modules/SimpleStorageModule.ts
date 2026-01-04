import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("SimpleStorageModule", (m) => {
  // 部署合约
  const simpleStorage = m.contract("SimpleStorage");
  
  // 部署后调用 set 函数
  m.call(simpleStorage, "set", [200n]);
  
  return { simpleStorage };
});