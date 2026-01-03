// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/AdvancedToken.sol";
import "../src/TokenFactory.sol";

contract DeployAdvancedTokens is Script {
    function run() external {
        // Use Anvil's default private key if PRIVATE_KEY not set
        uint256 deployerPrivateKey = vm.envOr(
            "PRIVATE_KEY",
            uint256(
                0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
            )
        );
        vm.startBroadcast(deployerPrivateKey);

        // Deploy TokenFactory
        TokenFactory factory = new TokenFactory();
        console.log("TokenFactory deployed at:", address(factory));

        // Create a sample token
        address sampleToken = factory.createToken(
            "Sample Token",
            "SAMPLE",
            18,
            1000000000000000000000000 // 1M tokens with 18 decimals
        );
        console.log("Sample token created at:", sampleToken);

        // Deploy standalone AdvancedToken
        AdvancedToken standalone = new AdvancedToken(
            "Standalone Token",
            "STANDALONE",
            18,
            1000000000000000000000000
        );
        console.log(
            "Standalone AdvancedToken deployed at:",
            address(standalone)
        );

        vm.stopBroadcast();

        console.log("\n=== Deployment Summary ===");
        console.log("TokenFactory:", address(factory));
        console.log("Sample Token:", sampleToken);
        console.log("Standalone Token:", address(standalone));
    }
}
