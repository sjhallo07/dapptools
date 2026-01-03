// SPDX-License-Identifier: MIT
pragma solidity ^0.6.7;

contract DSTest {
    event log(string);
    event log_address(address);
    event log_bytes(bytes);
    event log_bytes32(bytes32);
    event log_int(int);
    event log_uint(uint);
    event log_bytes1(bytes1);
    event log_bool(bool);

    bool public IS_TEST = true;
    bool public failed;

    function fail() internal {
        failed = true;
        assert(false);
    }

    function assertTrue(bool condition) internal {
        if (!condition) fail();
    }

    function assertEq(uint a, uint b) internal {
        if (a != b) fail();
    }

    function assertEq(int a, int b) internal {
        if (a != b) fail();
    }

    function assertEq(address a, address b) internal {
        if (a != b) fail();
    }

    function assertEq(bytes32 a, bytes32 b) internal {
        if (a != b) fail();
    }

    function assertEq(bytes memory a, bytes memory b) internal {
        if (keccak256(a) != keccak256(b)) fail();
    }

    function assertLe(uint a, uint b) internal {
        if (a > b) fail();
    }

    function assertLt(uint a, uint b) internal {
        if (a >= b) fail();
    }

    function assertGt(uint a, uint b) internal {
        if (a <= b) fail();
    }
}
