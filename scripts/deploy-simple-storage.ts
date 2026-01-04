import { network } from "hardhat";

// Hardhat 3 新方式：使用 network.connect() 获取 ethers 对象
const { ethers } = await network.connect();

async function main() {
  // 获取签名者
  const [deployer] = await ethers.getSigners();
  
  // 获取账户余额
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");
  
  // 部署合约
  const simpleStorage = await ethers.deployContract("SimpleStorage");
  await simpleStorage.waitForDeployment();
  
  const address = await simpleStorage.getAddress();
  console.log("SimpleStorage deployed to:", address);
  
  // 设置初始值并验证
  const initialValue = 100n;
  const setTx = await simpleStorage.set(initialValue);
  await setTx.wait();
  console.log("Set initial value to:", initialValue);
  
  const storedValue = await simpleStorage.get();
  console.log("Stored value:", storedValue.toString());
  
  if (storedValue === initialValue) {
    console.log("✅ Value set successfully!");
  } else {
    console.log("❌ Value mismatch!");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });