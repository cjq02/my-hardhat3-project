// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract SimpleStorage {
    uint256 public storedData;
    event DataStored(uint256 indexed newValue);
    
    function set(uint256 x) public {
        storedData = x;
        emit DataStored(x);
    }
    
    function get() public view returns (uint256) {
        return storedData;
    }
}