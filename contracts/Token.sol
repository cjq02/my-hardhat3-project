// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract Token {
    mapping(address => uint256) public balanceOf;

    constructor() {
        // 给部署者分配 10000 个代币
        balanceOf[msg.sender] = 10000;
    }

    function transfer(address to, uint256 amount) public {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
    }
}
