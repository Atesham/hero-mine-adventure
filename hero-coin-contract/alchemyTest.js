import { JsonRpcProvider } from 'ethers';

// Replace with your Alchemy API Key
const provider = new JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/1g-1WscQCs8_9cEfhsF6Osai3R_Mxxlr");

async function testAlchemyConnection() {
    try {
        const blockNumber = await provider.getBlockNumber();
        console.log("Connected to Ethereum! Latest block number:", blockNumber);
    } catch (error) {
        console.error("Error connecting to Alchemy:", error);
    }
}

testAlchemyConnection();
