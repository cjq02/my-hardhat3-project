// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Counter {
    uint256 public x;
    event Increment(uint256 by);

    constructor() {
        x = 0;
    }

    function inc() public {
        x++;
        emit Increment(1);
    }

    function incBy(uint256 by) public {
        require(by > 0, "incBy: increment should be positive");
        x += by;
        emit Increment(by);
    }

    function dec() public {
        require(x > 0, "dec: counter is zero");
        x--;
    }

    function setNumber(uint256 _x) public {
        x = _x;
    }
}
