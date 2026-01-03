// SPDX-License-Identifier: MIT
pragma solidity ^0.6.7;

contract A {
    uint x;

    constructor(uint y) public {
        x = y;
    }

    function off() public {
        require(x == 1);
        x = 0;
    }

    function on() public {
        require(x == 0);
        x = 1;
    }
}
