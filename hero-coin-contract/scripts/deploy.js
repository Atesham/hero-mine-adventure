const { ethers } = require("hardhat");

async function main() {
    // Get the deployer account
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contract with the account:", deployer.address);

    // Deploy the contract
    const HeroCoin = await ethers.getContractFactory("HeroCoin");
    const heroCoin = await HeroCoin.deploy(deployer.address);  // Pass deployer as initial owner

    await heroCoin.waitForDeployment();

    console.log("HeroCoin deployed to:", await heroCoin.getAddress());
}

// Run the script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
