// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./Token.sol";

contract TokenVault {
    Token public token;
    mapping(address => uint256) public deposits;

    constructor(address _token) {
        token = Token(_token);
    }

    function deposit(uint256 amount) public {
        require(
            token.balanceOf(msg.sender) >= amount,
            "Insufficient token balance"
        );
        token.transfer(address(this), amount);
        deposits[msg.sender] += amount;
    }
}
