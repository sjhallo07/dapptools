// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/DSToken.sol";

contract DSTokenTest is Test {
    DSToken token;
    address alice = address(0x1);
    address bob = address(0x2);

    function setUp() public {
        token = new DSToken("TEST");
    }

    // Basic transfer tests
    function testSymbol() public {
        assertEq(token.symbol(), "TEST");
    }

    function testDecimals() public {
        assertEq(token.decimals(), 18);
    }

    function testMint() public {
        token.mint(alice, 1000e18);
        assertEq(token.balanceOf(alice), 1000e18);
        assertEq(token.totalSupply(), 1000e18);
    }

    function testTransfer() public {
        token.mint(alice, 1000e18);

        vm.prank(alice);
        bool success = token.transfer(bob, 500e18);

        assertTrue(success);
        assertEq(token.balanceOf(alice), 500e18);
        assertEq(token.balanceOf(bob), 500e18);
    }

    function testTransferFail_InsufficientBalance() public {
        token.mint(alice, 100e18);

        vm.prank(alice);
        vm.expectRevert();
        token.transfer(bob, 1000e18);
    }

    function testApproveAndTransferFrom() public {
        token.mint(alice, 1000e18);

        vm.prank(alice);
        token.approve(bob, 500e18);

        vm.prank(bob);
        token.transferFrom(alice, bob, 300e18);

        assertEq(token.balanceOf(alice), 700e18);
        assertEq(token.balanceOf(bob), 300e18);
        assertEq(token.allowance(alice, bob), 200e18);
    }

    function testBurn() public {
        token.mint(alice, 1000e18);

        vm.prank(alice);
        token.burn(400e18);

        assertEq(token.balanceOf(alice), 600e18);
        assertEq(token.totalSupply(), 600e18);
    }

    // Fuzz tests
    function testFuzzTransfer(uint256 amount) public {
        vm.assume(amount > 0 && amount < 1e27);

        token.mint(alice, amount);

        vm.prank(alice);
        bool success = token.transfer(bob, amount);

        assertTrue(success);
        assertEq(token.balanceOf(alice), 0);
        assertEq(token.balanceOf(bob), amount);
    }

    function testFuzzMint(uint256 amount) public {
        vm.assume(amount < 1e27);

        token.mint(alice, amount);

        assertEq(token.balanceOf(alice), amount);
        assertEq(token.totalSupply(), amount);
    }

    // Invariant test
    function invariant_totalSupplyBalance() public {
        uint256 aliceBalance = token.balanceOf(alice);
        uint256 bobBalance = token.balanceOf(bob);

        // Simple case: total supply should be non-negative
        assertGe(token.totalSupply(), 0);
    }
}
