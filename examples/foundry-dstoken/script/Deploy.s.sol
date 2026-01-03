// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/DSToken.sol";

contract DeployDSToken is Script {
    function run() external {
        vm.startBroadcast();

        DSToken token = new DSToken("TEST");
        console.log("Deployed DSToken at:", address(token));

        // Mint some initial tokens
        token.mint(msg.sender, 1000000e18);
        console.log("Minted 1M tokens to:", msg.sender);

        vm.stopBroadcast();
    }
}
