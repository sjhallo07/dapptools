// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AdvancedToken.sol";

/**
 * @title TokenFactory
 * @dev Factory contract to create and manage advanced tokens
 */
contract TokenFactory {
    struct TokenInfo {
        address tokenAddress;
        string name;
        string symbol;
        uint8 decimals;
        address creator;
        uint256 createdAt;
    }

    address[] public deployedTokens;
    mapping(address => TokenInfo) public tokenInfo;
    mapping(string => address) public tokenBySymbol;

    event TokenCreated(
        address indexed tokenAddress,
        string name,
        string symbol,
        address indexed creator,
        uint256 timestamp
    );

    function createToken(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _initialSupply
    ) public returns (address) {
        require(tokenBySymbol[_symbol] == address(0), "Symbol already exists");

        AdvancedToken token = new AdvancedToken(
            _name,
            _symbol,
            _decimals,
            _initialSupply
        );

        address tokenAddress = address(token);
        deployedTokens.push(tokenAddress);

        tokenInfo[tokenAddress] = TokenInfo({
            tokenAddress: tokenAddress,
            name: _name,
            symbol: _symbol,
            decimals: _decimals,
            creator: msg.sender,
            createdAt: block.timestamp
        });

        tokenBySymbol[_symbol] = tokenAddress;

        emit TokenCreated(
            tokenAddress,
            _name,
            _symbol,
            msg.sender,
            block.timestamp
        );
        return tokenAddress;
    }

    function getTokenCount() public view returns (uint256) {
        return deployedTokens.length;
    }

    function getTokenAt(uint256 index) public view returns (address) {
        return deployedTokens[index];
    }

    function getAllTokens() public view returns (address[] memory) {
        return deployedTokens;
    }

    function getTokenBySymbol(
        string memory _symbol
    ) public view returns (address) {
        return tokenBySymbol[_symbol];
    }
}
