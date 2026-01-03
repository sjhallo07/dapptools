// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DSMath.sol";

contract DSToken is DSMath {
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    constructor(string memory symbol_) public {
        symbol = symbol_;
        decimals = 18;
    }

    function transfer(address to, uint256 amount) public returns (bool) {
        require(balanceOf[msg.sender] >= amount);
        balanceOf[msg.sender] = sub(balanceOf[msg.sender], amount);
        balanceOf[to] = add(balanceOf[to], amount);
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public returns (bool) {
        require(balanceOf[from] >= amount);
        require(allowance[from][msg.sender] >= amount);
        balanceOf[from] = sub(balanceOf[from], amount);
        balanceOf[to] = add(balanceOf[to], amount);
        allowance[from][msg.sender] = sub(allowance[from][msg.sender], amount);
        emit Transfer(from, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function mint(address to, uint256 amount) public {
        balanceOf[to] = add(balanceOf[to], amount);
        totalSupply = add(totalSupply, amount);
        emit Transfer(address(0), to, amount);
    }

    function burn(uint256 amount) public {
        balanceOf[msg.sender] = sub(balanceOf[msg.sender], amount);
        totalSupply = sub(totalSupply, amount);
        emit Transfer(msg.sender, address(0), amount);
    }
}
