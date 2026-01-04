import { network } from "hardhat";

const { ethers } = await network.connect();

async function main() {
  console.log("=== 配置验证 ===");

  // 验证网络信息
  const networkInfo = await ethers.provider.getNetwork();
  console.log("当前网络 Chain ID:", networkInfo.chainId.toString());
  console.log("网络名称:", networkInfo.name);

  // 验证账户
  const [signer] = await ethers.getSigners();
  console.log("部署账户:", signer.address);

  const balance = await ethers.provider.getBalance(signer.address);
  console.log("账户余额:", ethers.formatEther(balance), "ETH");

  // 验证环境变量（如果配置了）
  console.log("\n环境变量检查:");
  console.log("SEPOLIA_URL:", process.env.SEPOLIA_URL ? "已设置" : "未设置");
  console.log("PRIVATE_KEY:", process.env.PRIVATE_KEY ? "已设置" : "未设置");
  console.log(
    "ETHERSCAN_API_KEY:",
    process.env.ETHERSCAN_API_KEY ? "已设置" : "未设置"
  );

  console.log("\n✅ 配置验证完成！");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
