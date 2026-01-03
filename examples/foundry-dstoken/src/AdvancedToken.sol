// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DSMath.sol";

/**
 * @title AdvancedToken
 * @dev Enhanced ERC20 token with advanced features from contracts-wizard
 * Includes: minting/burning, pausable, snapshot, and role-based access control
 */
contract AdvancedToken is DSMath {
    // Token metadata
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    // Balances and allowances
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    // Snapshots for tracking historical balances
    mapping(uint256 => mapping(address => uint256)) public snapshotBalance;
    mapping(uint256 => uint256) public snapshotTotalSupply;
    uint256 public currentSnapshotId;

    // Pausable state
    bool public paused;

    // Role-based access control
    address public owner;
    mapping(address => bool) public minters;
    mapping(address => bool) public burners;
    mapping(address => bool) public pausers;

    // Blacklist for blocked addresses
    mapping(address => bool) public blacklisted;

    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
    event Mint(address indexed to, uint256 amount);
    event Burn(address indexed from, uint256 amount);
    event Snapshot(uint256 indexed snapshotId, uint256 totalSupply);
    event Paused();
    event Unpaused();
    event Blacklisted(address indexed account);
    event Unblacklisted(address indexed account);
    event MinterAdded(address indexed account);
    event MinterRemoved(address indexed account);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyMinter() {
        require(minters[msg.sender], "Only minter");
        _;
    }

    modifier onlyBurner() {
        require(burners[msg.sender], "Only burner");
        _;
    }

    modifier onlyPauser() {
        require(pausers[msg.sender], "Only pauser");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Token is paused");
        _;
    }

    modifier notBlacklisted(address _address) {
        require(!blacklisted[_address], "Address is blacklisted");
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _initialSupply
    ) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        owner = msg.sender;

        // Set initial roles
        minters[msg.sender] = true;
        burners[msg.sender] = true;
        pausers[msg.sender] = true;

        // Mint initial supply
        if (_initialSupply > 0) {
            balanceOf[msg.sender] = _initialSupply;
            totalSupply = _initialSupply;
            emit Transfer(address(0), msg.sender, _initialSupply);
        }

        currentSnapshotId = 1;
    }

    // ============ Transfer Functions ============

    function transfer(
        address to,
        uint256 amount
    )
        public
        whenNotPaused
        notBlacklisted(msg.sender)
        notBlacklisted(to)
        returns (bool)
    {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] = sub(balanceOf[msg.sender], amount);
        balanceOf[to] = add(balanceOf[to], amount);
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    )
        public
        whenNotPaused
        notBlacklisted(from)
        notBlacklisted(to)
        returns (bool)
    {
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(
            allowance[from][msg.sender] >= amount,
            "Insufficient allowance"
        );

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

    function increaseAllowance(
        address spender,
        uint256 addedValue
    ) public returns (bool) {
        allowance[msg.sender][spender] = add(
            allowance[msg.sender][spender],
            addedValue
        );
        emit Approval(msg.sender, spender, allowance[msg.sender][spender]);
        return true;
    }

    function decreaseAllowance(
        address spender,
        uint256 subtractedValue
    ) public returns (bool) {
        uint256 currentAllowance = allowance[msg.sender][spender];
        require(
            currentAllowance >= subtractedValue,
            "Decreased allowance below zero"
        );

        allowance[msg.sender][spender] = sub(currentAllowance, subtractedValue);
        emit Approval(msg.sender, spender, allowance[msg.sender][spender]);
        return true;
    }

    // ============ Minting & Burning ============

    function mint(address to, uint256 amount) public onlyMinter {
        balanceOf[to] = add(balanceOf[to], amount);
        totalSupply = add(totalSupply, amount);
        emit Mint(to, amount);
        emit Transfer(address(0), to, amount);
    }

    function burn(uint256 amount) public onlyBurner {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] = sub(balanceOf[msg.sender], amount);
        totalSupply = sub(totalSupply, amount);
        emit Burn(msg.sender, amount);
        emit Transfer(msg.sender, address(0), amount);
    }

    function burnFrom(address account, uint256 amount) public onlyBurner {
        require(balanceOf[account] >= amount, "Insufficient balance");
        balanceOf[account] = sub(balanceOf[account], amount);
        totalSupply = sub(totalSupply, amount);
        emit Burn(account, amount);
        emit Transfer(account, address(0), amount);
    }

    // ============ Snapshot Functions ============

    function snapshot() public onlyOwner returns (uint256) {
        currentSnapshotId = add(currentSnapshotId, 1);
        snapshotTotalSupply[currentSnapshotId] = totalSupply;
        emit Snapshot(currentSnapshotId, totalSupply);
        return currentSnapshotId;
    }

    function balanceOfAt(
        address account,
        uint256 snapshotId
    ) public view returns (uint256) {
        require(snapshotId <= currentSnapshotId, "Invalid snapshot ID");
        return snapshotBalance[snapshotId][account];
    }

    function totalSupplyAt(uint256 snapshotId) public view returns (uint256) {
        require(snapshotId <= currentSnapshotId, "Invalid snapshot ID");
        return snapshotTotalSupply[snapshotId];
    }

    // ============ Pausable Functions ============

    function pause() public onlyPauser {
        paused = true;
        emit Paused();
    }

    function unpause() public onlyOwner {
        paused = false;
        emit Unpaused();
    }

    // ============ Blacklist Functions ============

    function addToBlacklist(address account) public onlyOwner {
        blacklisted[account] = true;
        emit Blacklisted(account);
    }

    function removeFromBlacklist(address account) public onlyOwner {
        blacklisted[account] = false;
        emit Unblacklisted(account);
    }

    // ============ Role Management ============

    function addMinter(address account) public onlyOwner {
        minters[account] = true;
        emit MinterAdded(account);
    }

    function removeMinter(address account) public onlyOwner {
        minters[account] = false;
        emit MinterRemoved(account);
    }

    function addBurner(address account) public onlyOwner {
        burners[account] = true;
    }

    function removeBurner(address account) public onlyOwner {
        burners[account] = false;
    }

    function addPauser(address account) public onlyOwner {
        pausers[account] = true;
    }

    function removePauser(address account) public onlyOwner {
        pausers[account] = false;
    }

    // ============ View Functions ============

    function isMinter(address account) public view returns (bool) {
        return minters[account];
    }

    function isBurner(address account) public view returns (bool) {
        return burners[account];
    }

    function isPauser(address account) public view returns (bool) {
        return pausers[account];
    }

    function isBlacklisted(address account) public view returns (bool) {
        return blacklisted[account];
    }
}
