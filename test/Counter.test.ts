/**
 * Counter 合约测试文件
 *
 * 本文件包含了对 Counter 合约的全面测试，涵盖以下功能：
 * - 合约部署和初始化
 * - 计数器递增操作
 * - 计数器递减操作
 * - 直接设置数值
 * - 事件触发和查询
 *
 * 测试框架使用 Chai 进行断言，Hardhat 提供以太坊测试环境
 */

// 导入 Chai 的断言库，用于验证测试结果
import { expect } from "chai";
// 导入 Hardhat 的 network 模块，用于连接和管理测试网络
import { network } from "hardhat";
// 导入 ethers 库类型定义（虽然这里主要使用 Hardhat 的 ethers 实例）
import { ethers } from "ethers";

// 从 Hardhat 的 network 连接中获取 ethers 实例和辅助工具
// hEthers: Hardhat 封装的 ethers 对象，提供合约部署、获取签名人等功能
// networkHelpers: Hardhat 的网络辅助工具，提供 fixture 等测试工具
const { ethers: hEthers, networkHelpers } = await network.connect();

/**
 * 部署 Counter 合约的测试固件（Fixture）
 *
 * Fixture 是一种测试辅助函数，用于在测试前设置测试环境
 * 使用 fixture 的好处：
 * 1. 避免重复代码：多个测试可以复用同一个部署逻辑
 * 2. 性能优化：使用 loadFixture 可以在测试间重用部署状态，提高测试速度
 * 3. 清晰的依赖管理：统一管理合约部署和账户获取逻辑
 *
 * @returns {Object} 返回包含以下字段的对象：
 *   - counter: 部署的 Counter 合约实例
 *   - owner: 合约部署者/所有者账户
 *   - addr1: 第二个测试账户
 *   - addr2: 第三个测试账户
 */
async function deployCounterFixture() {
  // 获取测试账户（signers）
  // Hardhat 会自动生成20个测试账户，前几个通常用于测试不同的场景
  // owner: 合约部署者，通常拥有管理员权限
  // addr1, addr2: 其他测试账户，用于测试多用户交互场景
  const [owner, addr1, addr2] = await hEthers.getSigners();

  // 部署 Counter 合约
  // deployContract 会自动编译合约（如需要）、创建部署交易、等待确认
  // 返回的是一个合约实例，可以用来调用合约方法
  const counter = await hEthers.deployContract("Counter");

  // 返回所有测试需要的对象，供测试用例使用
  return { counter, owner, addr1, addr2 };
}

/**
 * Counter 合约测试套件
 *
 * describe() 用于组织相关的测试用例，形成测试套件
 * 这里创建了一个名为 "Counter" 的顶级测试套件，包含所有与 Counter 合约相关的测试
 */
describe("Counter", function () {
  /**
   * 部署测试子套件
   * 测试合约的部署和初始化功能
   */
  describe("Deployment", function () {
    /**
     * 测试用例：验证合约部署时初始值为 0
     *
     * 测试目标：确保 Counter 合约部署后，计数器状态变量 x 的初始值为 0
     * 测试步骤：
     * 1. 使用 fixture 部署合约
     * 2. 调用合约的 x() 方法读取当前计数值
     * 3. 验证返回值为 0
     */
    it("Should deploy with initial value 0", async function () {
      // 使用 loadFixture 加载部署固件
      // loadFixture 会在首次调用时执行 deployCounterFixture
      // 在后续测试中，如果 fixture 配置没变，会重用之前部署的合约，提高测试效率
      const { counter } = await networkHelpers.loadFixture(
        deployCounterFixture
      );

      // 调用合约的 x() 方法获取当前计数值
      // 注意：在合约中读取状态变量（view/pure 函数）不需要 gas 费
      // 使用 0n 表示 BigInt 类型的 0，因为 Solidity 0.8+ 返回的是 BigInt
      expect(await counter.x()).to.equal(0n);
    });

    /**
     * 测试用例：验证合约地址格式正确
     *
     * 测试目标：确保部署的合约拥有有效的以太坊地址
     * 测试步骤：
     * 1. 使用 fixture 部署合约
     * 2. 获取合约地址
     * 3. 验证地址格式：字符串类型、42字符长度、以0x开头的40个十六进制字符
     */
    it("Should have valid address", async function () {
      // 加载部署固件获取合约实例
      const { counter } = await networkHelpers.loadFixture(
        deployCounterFixture
      );

      // 获取合约地址
      // getAddress() 返回合约部署后的区块链地址
      const address = await counter.getAddress();

      // 验证地址是字符串类型
      expect(address).to.be.a("string");
      // 验证地址长度为42字符（0x + 40个十六进制字符）
      expect(address).to.have.length(42);
      // 验证地址格式符合以太坊地址规范：0x开头，后跟40个十六进制字符
      expect(address).to.match(/^0x[a-fA-F0-9]{40}$/);
    });
  });

  /**
   * 递增操作测试子套件
   * 测试合约的 inc() 和 incBy() 方法
   */
  describe("Increment", function () {
    /**
     * 测试用例：验证基本递增功能
     *
     * 测试目标：确保 inc() 方法能够将计数器每次递增 1
     * 测试步骤：
     * 1. 部署合约（初始值为0）
     * 2. 调用 inc() 方法
     * 3. 验证计数值变为 1
     * 4. 再次调用 inc() 方法
     * 5. 验证计数值变为 2
     */
    it("Should increment counter", async function () {
      // 加载部署固件
      const { counter } = await networkHelpers.loadFixture(
        deployCounterFixture
      );

      // 第一次递增：调用 inc() 方法
      // 这会发送一个交易到区块链，修改合约状态
      await counter.inc();
      // 验证计数值是否为 1
      expect(await counter.x()).to.equal(1n);

      // 第二次递增：再次调用 inc() 方法
      await counter.inc();
      // 验证计数值是否为 2
      expect(await counter.x()).to.equal(2n);
    });

    /**
     * 测试用例：验证按指定数量递增功能
     *
     * 测试目标：确保 incBy(uint256 amount) 方法能够按指定数量递增计数器
     * 测试步骤：
     * 1. 部署合约
     * 2. 调用 incBy(5) 方法
     * 3. 验证计数值变为 5
     * 4. 调用 incBy(10) 方法
     * 5. 验证计数值变为 15（5 + 10）
     */
    it("Should increment by specific amount", async function () {
      // 加载部署固件
      const { counter } = await networkHelpers.loadFixture(
        deployCounterFixture
      );

      // 递增 5：调用 incBy 方法传入参数 5n
      await counter.incBy(5n);
      // 验证计数值为 5
      expect(await counter.x()).to.equal(5n);

      // 再递增 10：当前值 5 + 10 = 15
      await counter.incBy(10n);
      // 验证计数值为 15
      expect(await counter.x()).to.equal(15n);
    });
  });

  /**
   * 递减操作测试子套件
   * 测试合约的 dec() 方法
   */
  describe("Decrement", function () {
    /**
     * 测试用例：验证基本递减功能
     *
     * 测试目标：确保 dec() 方法能够将计数器递减 1
     * 测试步骤：
     * 1. 部署合约
     * 2. 先递增到 5，确保有足够的值可以递减
     * 3. 调用 dec() 方法
     * 4. 验证计数值变为 4（5 - 1）
     */
    it("Should decrement counter", async function () {
      // 加载部署固件
      const { counter } = await networkHelpers.loadFixture(
        deployCounterFixture
      );

      // 先递增到 5，为递减操作做准备
      await counter.incBy(5n);
      // 递减 1
      await counter.dec();
      // 验证计数值为 4
      expect(await counter.x()).to.equal(4n);
    });

    /**
     * 测试用例：验证计数器为零时的回滚行为
     *
     * 测试目标：确保当计数器为 0 时，调用 dec() 方法会回滚并抛出错误
     * 测试步骤：
     * 1. 部署合约（初始值为0）
     * 2. 尝试调用 dec() 方法
     * 3. 验证交易回滚并包含指定的错误信息
     *
     * 这是测试合约安全性的重要用例，防止下溢出（uint不能为负数）
     */
    it("Should revert when counter is zero", async function () {
      // 加载部署固件，此时 counter 值为 0
      const { counter } = await networkHelpers.loadFixture(
        deployCounterFixture
      );

      // 验证调用 dec() 会回滚交易
      // expect().to.be.revertedWith() 用于验证交易是否因特定错误而回滚
      // 参数 "dec: counter is zero" 是合约中定义的 require 错误信息
      await expect(counter.dec()).to.be.revertedWith("dec: counter is zero");
    });
  });

  /**
   * 设置数值测试子套件
   * 测试合约的 setNumber() 方法
   */
  describe("Set Number", function () {
    /**
     * 测试用例：验证设置数值功能
     *
     * 测试目标：确保 setNumber() 方法能够直接设置计数器的值
     * 测试步骤：
     * 1. 部署合约（初始值为0）
     * 2. 调用 setNumber(42) 方法
     * 3. 验证计数值变为 42
     */
    it("Should set number", async function () {
      // 加载部署固件
      const { counter } = await networkHelpers.loadFixture(
        deployCounterFixture
      );

      // 设置计数值为 42
      await counter.setNumber(42n);
      // 验证计数值为 42
      expect(await counter.x()).to.equal(42n);
    });

    /**
     * 测试用例：验证设置最大值功能
     *
     * 测试目标：确保 setNumber() 方法能够处理 uint256 类型的最大值
     * 测试步骤：
     * 1. 部署合约
     * 2. 计算 uint256 的最大值（2^256 - 1）
     * 3. 调用 setNumber() 设置最大值
     * 4. 验证计数值正确设置为最大值
     *
     * 这测试了合约处理边界情况的能力
     */
    it("Should set maximum value", async function () {
      // 加载部署固件
      const { counter } = await networkHelpers.loadFixture(
        deployCounterFixture
      );

      // 计算 uint256 类型的最大值
      // uint256 是无符号256位整数，最大值为 2^256 - 1
      // 使用 BigInt 运算符 ** 和 n 后缀表示大整数
      const maxValue = 2n ** 256n - 1n;
      // 设置计数值为最大值
      await counter.setNumber(maxValue);
      // 验证计数值正确设置
      expect(await counter.x()).to.equal(maxValue);
    });
  });

  /**
   * 事件测试子套件
   * 测试合约事件的触发和查询功能
   *
   * 事件是智能合约与外部世界通信的重要机制，用于记录合约状态变化
   */
  describe("Events", function () {
    /**
     * 测试用例：验证 inc() 方法触发 Increment 事件
     *
     * 测试目标：确保调用 inc() 方法时会触发 Increment 事件，且事件参数正确
     * 测试步骤：
     * 1. 部署合约
     * 2. 调用 inc() 方法
     * 3. 验证触发了名为 "Increment" 的事件
     * 4. 验证事件的参数为 1（递增的量）
     */
    it("Should emit Increment event when inc is called", async function () {
      // 加载部署固件
      const { counter } = await networkHelpers.loadFixture(
        deployCounterFixture
      );

      // 验证调用 inc() 方法时触发 Increment 事件
      // expect(transaction).to.emit(contract, eventName) 用于验证事件触发
      // withArgs(args) 用于验证事件携带的参数
      await expect(counter.inc()).to.emit(counter, "Increment").withArgs(1n);
    });

    /**
     * 测试用例：验证 incBy() 方法触发带正确参数的 Increment 事件
     *
     * 测试目标：确保 incBy() 方法触发的事件携带正确的递增量
     * 测试步骤：
     * 1. 部署合约
     * 2. 定义递增量 amount = 5
     * 3. 调用 incBy(amount) 方法
     * 4. 验证触发 Increment 事件
     * 5. 验证事件参数为 5（递增的量）
     */
    it("Should emit Increment event with correct amount", async function () {
      // 加载部署固件
      const { counter } = await networkHelpers.loadFixture(
        deployCounterFixture
      );

      // 定义递增量
      const amount = 5n;
      // 验证调用 incBy(amount) 方法时触发 Increment 事件，参数为 amount
      await expect(counter.incBy(amount))
        .to.emit(counter, "Increment")
        .withArgs(amount);
    });

    /**
     * 测试用例：演示事件过滤器的使用
     *
     * 测试目标：展示如何使用事件过滤器来验证事件触发
     * 测试步骤：
     * 1. 部署合约
     * 2. 调用 inc() 方法
     * 3. 验证触发 Increment 事件
     *
     * 注：这个测试用例主要演示事件过滤器的概念
     * 在更复杂的场景中，过滤器可以用于监听特定条件的事件
     */
    it("Should use event filter", async function () {
      // 加载部署固件
      const { counter } = await networkHelpers.loadFixture(
        deployCounterFixture
      );

      // 调用 inc() 并验证事件触发
      // 这里直接使用事件名称 "Increment" 作为过滤器
      // counter.filters.Increment() 可以创建更复杂的事件过滤器
      // 直接使用事件名称作为过滤器
      await expect(counter.inc()).to.emit(counter, "Increment").withArgs(1n);
    });

    /**
     * 测试用例：验证历史事件查询功能
     *
     * 测试目标：确保能够正确查询合约的历史事件记录
     * 测试步骤：
     * 1. 部署合约并记录当前区块号
     * 2. 执行多次递增操作（inc, incBy(5), inc）
     * 3. 使用过滤器查询所有 Increment 事件
     * 4. 验证查询到3个事件，且参数依次为 1, 5, 1
     *
     * 这个测试展示了如何：
     * - 使用事件过滤器查询历史事件
     * - 验证事件的时间顺序和参数
     * - 追踪合约的状态变化历史
     */
    it("Should query historical events", async function () {
      // 加载部署固件
      const { counter } = await networkHelpers.loadFixture(
        deployCounterFixture
      );

      // 获取当前区块号，用于后续查询从此区块之后的事件
      // 这样可以只查询本次测试触发的事件，忽略之前的
      const deployBlock = await hEthers.provider.getBlockNumber();

      // 执行多次递增操作，生成多个事件
      await counter.inc(); // 触发事件，参数 1
      await counter.incBy(5n); // 触发事件，参数 5
      await counter.inc(); // 触发事件，参数 1

      // 创建事件过滤器
      // counter.filters.Increment() 创建一个过滤器，用于筛选 Increment 事件
      const filter = counter.filters.Increment();
      // 查询从 deployBlock 区块开始的所有 Increment 事件
      const events = await counter.queryFilter(filter, deployBlock);

      // 验证查询结果
      // 应该有3个事件（对应上面的3次操作）
      expect(events).to.have.length(3);
      // 验证每个事件的参数
      // events[0].args[0] 访问第一个事件的第一个参数
      expect(events[0].args[0]).to.equal(1n); // 第一次 inc() 的参数
      expect(events[1].args[0]).to.equal(5n); // incBy(5n) 的参数
      expect(events[2].args[0]).to.equal(1n); // 第二次 inc() 的参数
    });
  });

  describe("Error Handling", function () {
    it("Should revert when incBy amount is zero", async function () {
      const { counter } = await networkHelpers.loadFixture(
        deployCounterFixture
      );

      await expect(counter.incBy(0)).to.be.revertedWith(
        "incBy: increment should be positive"
      );
    });

    it("Should revert when decrement from zero", async function () {
      const { counter } = await networkHelpers.loadFixture(
        deployCounterFixture
      );

      await expect(counter.dec()).to.be.revertedWith("dec: counter is zero");
    });

    it("Should revert on overflow", async function () {
      const { counter } = await networkHelpers.loadFixture(
        deployCounterFixture
      );

      const maxValue = 2n ** 256n - 1n;
      await counter.setNumber(maxValue);

      // Solidity 0.8+ 会自动检查溢出
      await expect(counter.inc()).to.be.revertedWithPanic(0x11); // 算术溢出
    });

  });
});
