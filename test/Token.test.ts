import { expect } from "chai";
import { network } from "hardhat";
import { ethers } from "ethers";

const { ethers: hEthers, networkHelpers } = await network.connect();

async function deployTokenFixture() {
  const [owner, addr1, addr2] = await hEthers.getSigners();
  const initialSupply = hEthers.parseEther("1000000");
  const token = await hEthers.deployContract("Token", [initialSupply]);

  return { token, owner, addr1, addr2, initialSupply };
}

describe("Token - Chai Assertions", function () {
  describe("Equality Assertions", function () {
    it("Should use equal assertion", async function () {
      const { token } = await networkHelpers.loadFixture(deployTokenFixture);

      const name = await token.name();
      expect(name).to.equal("My Token");
    });

    it("Should use not.equal assertion", async function () {
      const { token } = await networkHelpers.loadFixture(deployTokenFixture);

      const symbol = await token.symbol();
      expect(symbol).to.not.equal("ETH");
    });
  });

  describe("Number Comparisons", function () {
    it("Should use above assertion", async function () {
      const { token } = await networkHelpers.loadFixture(deployTokenFixture);

      const decimals = await token.decimals();
      expect(decimals).to.be.above(0);
    });

    it("Should use below assertion", async function () {
      const { token } = await networkHelpers.loadFixture(deployTokenFixture);

      const decimals = await token.decimals();
      expect(decimals).to.be.below(255);
    });

    it("Should use at.least assertion", async function () {
      const { token } = await networkHelpers.loadFixture(deployTokenFixture);

      const decimals = await token.decimals();
      expect(decimals).to.be.at.least(18);
    });
  });

  describe("Boolean Assertions", function () {
    it("Should use true assertion", async function () {
      const { token } = await networkHelpers.loadFixture(deployTokenFixture);

      // 检查合约是否成功部署（使用布尔断言）
      const address = await token.getAddress();
      expect(address.startsWith("0x")).to.be.true;
    });

    it("Should use false assertion", async function () {
      const { token } = await networkHelpers.loadFixture(deployTokenFixture);

      // 检查余额是否为零（使用布尔断言）
      const zeroAddress = "0x0000000000000000000000000000000000000000";
      const balance = await token.balanceOf(zeroAddress);
      expect(balance > 0n).to.be.false;
    });
  });

  describe("Type Assertions", function () {
    it("Should check string type", async function () {
      const { token } = await networkHelpers.loadFixture(deployTokenFixture);

      const name = await token.name();
      expect(name).to.be.a("string");
    });

    it("Should check address type", async function () {
      const { token } = await networkHelpers.loadFixture(deployTokenFixture);

      const address = await token.getAddress();
      expect(address).to.be.a("string");
    });

    it("Should check bigint type", async function () {
      const { token } = await networkHelpers.loadFixture(deployTokenFixture);

      const decimals = await token.decimals();
      expect(decimals).to.be.a("bigint");
    });
  });

  describe("String Assertions", function () {
    it("Should use include assertion", async function () {
      const { token } = await networkHelpers.loadFixture(deployTokenFixture);

      const name = await token.name();
      expect(name).to.include("Token");
    });

    it("Should use match assertion", async function () {
      const { token } = await networkHelpers.loadFixture(deployTokenFixture);

      const address = await token.getAddress();
      expect(address).to.match(/^0x[a-fA-F0-9]{40}$/);
    });

    it("Should use length assertion", async function () {
      const { token } = await networkHelpers.loadFixture(deployTokenFixture);

      const address = await token.getAddress();
      expect(address).to.have.length(42);
    });
  });

  describe("BigInt Handling", function () {
    it("Should use bigint literal", async function () {
      const { token } = await networkHelpers.loadFixture(deployTokenFixture);

      const decimals = await token.decimals();
      expect(decimals).to.equal(18n);
    });

    it("Should use BigInt constructor", async function () {
      const { token } = await networkHelpers.loadFixture(deployTokenFixture);

      const decimals = await token.decimals();
      expect(decimals).to.equal(BigInt(18));
    });

    it("Should handle large numbers", async function () {
      const { token, initialSupply } = await networkHelpers.loadFixture(
        deployTokenFixture
      );

      const totalSupply = await token.totalSupply();
      expect(totalSupply).to.equal(initialSupply);
    });
  });

  describe("Chained Assertions", function () {
    it("Should chain multiple assertions", async function () {
      const { token } = await networkHelpers.loadFixture(deployTokenFixture);

      const address = await token.getAddress();

      expect(address)
        .to.be.a("string")
        .and.to.have.length(42)
        .and.to.match(/^0x[a-fA-F0-9]{40}$/);
    });

    it("Should chain number assertions", async function () {
      const { token } = await networkHelpers.loadFixture(deployTokenFixture);

      const decimals = await token.decimals();

      expect(decimals)
        .to.be.a("bigint")
        .and.to.be.above(0n)
        .and.to.be.below(255n);
    });
  });

  describe("Object Property Assertions", function () {
    it("Should check property existence", async function () {
      const { token } = await networkHelpers.loadFixture(deployTokenFixture);

      const name = await token.name();
      expect(name).to.exist;
    });

    it("Should check property value", async function () {
      const { token } = await networkHelpers.loadFixture(deployTokenFixture);

      const name = await token.name();
      expect(name).to.have.length(8);
    });
  });

  describe("Balance Changes", function () {
    it("Should change single account balance", async function () {
      const { token, owner, addr1 } = await networkHelpers.loadFixture(
        deployTokenFixture
      );

      const amount = hEthers.parseEther("100");

      // 获取转移前的余额
      const balanceBefore = await token.balanceOf(addr1.address);

      // 执行转账
      await token.transfer(addr1.address, amount);

      // 获取转移后的余额
      const balanceAfter = await token.balanceOf(addr1.address);

      // 验证余额增加了正确的数量
      expect(balanceAfter).to.equal(balanceBefore + amount);
    });

    it("Should change multiple account balances", async function () {
      const { token, owner, addr1 } = await networkHelpers.loadFixture(
        deployTokenFixture
      );

      const amount = hEthers.parseEther("100");

      // 获取转移前的余额
      const ownerBalanceBefore = await token.balanceOf(owner.address);
      const addr1BalanceBefore = await token.balanceOf(addr1.address);

      // 执行转账
      await token.transfer(addr1.address, amount);

      // 获取转移后的余额
      const ownerBalanceAfter = await token.balanceOf(owner.address);
      const addr1BalanceAfter = await token.balanceOf(addr1.address);

      // 验证余额变化：owner减少，addr1增加
      expect(ownerBalanceAfter).to.equal(ownerBalanceBefore - amount);
      expect(addr1BalanceAfter).to.equal(addr1BalanceBefore + amount);
    });

    it("Should revert with insufficient balance", async function () {
      const { token, owner, addr1 } = await networkHelpers.loadFixture(
        deployTokenFixture
      );

      const amount = hEthers.parseEther("2000000");

      await expect(token.transfer(addr1.address, amount)).to.be.revertedWith(
        "Insufficient balance"
      );
    });
  });
});
