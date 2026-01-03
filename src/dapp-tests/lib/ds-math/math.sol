// SPDX-License-Identifier: MIT
pragma solidity ^0.6.7;

contract DSMath {
    function add(uint x, uint y) internal pure returns (uint z) {
        z = x + y;
        require(z >= x, "math-add-overflow");
    }

    function sub(uint x, uint y) internal pure returns (uint z) {
        require(y <= x, "math-sub-underflow");
        z = x - y;
    }

    function mul(uint x, uint y) internal pure returns (uint z) {
        if (x == 0 || y == 0) {
            return 0;
        }
        z = x * y;
        require(z / x == y, "math-mul-overflow");
    }
}
