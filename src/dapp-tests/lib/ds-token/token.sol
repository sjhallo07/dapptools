// SPDX-License-Identifier: MIT
pragma solidity ^0.6.7;

contract DSToken {
    string public symbol;
    uint8 public constant decimals = 18;
    uint public totalSupply;
    mapping(address => uint) public balanceOf;

    event Transfer(address indexed from, address indexed to, uint value);

    constructor(string memory symbol_) public {
        symbol = symbol_;
    }

    function mint(uint amount) public {
        _mint(msg.sender, amount);
    }

    function mint(address to, uint amount) public {
        _mint(to, amount);
    }

    function burn(uint amount) public {
        require(balanceOf[msg.sender] >= amount, "burn-underflow");
        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;
        emit Transfer(msg.sender, address(0), amount);
    }

    function transfer(address to, uint amount) public returns (bool) {
        require(balanceOf[msg.sender] >= amount, "transfer-underflow");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function _mint(address to, uint amount) internal {
        balanceOf[to] += amount;
        totalSupply += amount;
        emit Transfer(address(0), to, amount);
    }
}
