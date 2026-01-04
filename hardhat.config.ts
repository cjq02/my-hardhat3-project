import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { defineConfig } from "hardhat/config";
import "dotenv/config";

// 辅助函数：检查私钥是否有效
function getPrivateKey(): string[] {
  const privateKey = process.env.PRIVATE_KEY;
  
  // 检查私钥是否存在且不为空
  if (!privateKey || privateKey.trim().length === 0) {
    return [];
  }
  
  const trimmedKey = privateKey.trim();
  
  // 检查是否是占位符
  if (trimmedKey === "your-private-key-here" || 
      trimmedKey.startsWith("your-") || 
      trimmedKey === "") {
    return [];
  }
  
  // 验证私钥格式：应该是 64 个十六进制字符（可选 0x 前缀）
  // 有效格式：0x + 64 个十六进制字符，或直接 64 个十六进制字符
  const hexPattern = /^(0x)?[0-9a-fA-F]{64}$/;
  
  if (!hexPattern.test(trimmedKey)) {
    console.warn("Warning: PRIVATE_KEY format is invalid, skipping network accounts");
    return [];
  }
  
  return [trimmedKey];
}

export default defineConfig({
  plugins: [hardhatToolboxMochaEthersPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: process.env.SEPOLIA_URL || "",
      accounts: getPrivateKey(),
      chainId: 11155111,
    },
    mainnet: {
      type: "http",
      url: process.env.MAINNET_URL || "",
      accounts: getPrivateKey(),
      chainId: 1,
    },
  },
  // @ts-ignore - etherscan config is valid but not in type definition
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "",
  },
});
