require("@nomicfoundation/hardhat-toolbox");

module.exports = {
    solidity: "0.8.20",
    networks: {
        sepolia: {
            url: "https://eth-sepolia.g.alchemy.com/v2/1WscQCs8_9cEfhsF6Osai3R_Mxxlr",
            accounts: ["8d4acdc44e1cb4624dcc94b082c1fd263e0b1fce731216e83d16c78ef9a6ae6d"]
        }
    }
};
