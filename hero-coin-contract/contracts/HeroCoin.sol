// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HeroCoin is ERC20, Ownable {
    uint256 public constant INITIAL_SUPPLY = 100000000 * (10 ** 18); // 100 million HeroCoins

    mapping(address => uint256) public stakedBalance;
    mapping(address => uint256) public miningRewards;

    event CoinsMined(address indexed user, uint256 amount);
    event CoinsStaked(address indexed user, uint256 amount);
    event CoinsUnstaked(address indexed user, uint256 amount);

    constructor(address initialOwner) ERC20("HeroCoin", "HERO") Ownable(initialOwner) {
        _mint(initialOwner, INITIAL_SUPPLY); // Mint initial tokens
    }

    // Function to mine coins
    function mineCoins(address user, uint256 amount) external onlyOwner {
        require(amount > 0, "Mining amount must be greater than zero");
        _mint(user, amount);
        miningRewards[user] += amount;
        emit CoinsMined(user, amount);
    }

    // Function to stake coins
    function stakeCoins(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        _transfer(msg.sender, address(this), amount);
        stakedBalance[msg.sender] += amount;
        emit CoinsStaked(msg.sender, amount);
    }

    // Function to unstake coins
    function unstakeCoins(uint256 amount) external {
        require(stakedBalance[msg.sender] >= amount, "Insufficient staked balance");

        stakedBalance[msg.sender] -= amount;
        _transfer(address(this), msg.sender, amount);
        emit CoinsUnstaked(msg.sender, amount);
    }
}
