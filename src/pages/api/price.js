import { PriceServiceConnection } from '@pythnetwork/price-service-client';
import { Connection, PublicKey } from '@solana/web3.js';
import { OCR2Feed } from '@chainlink/solana-sdk';

const connection = new Connection('https://api.devnet.solana.com');

// Pyth Setup
const pythConnection = new PriceServiceConnection("https://hermes.pyth.network");
const pythPriceId = '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d';

// Chainlink Setup
const chainlinkProgramId = new PublicKey('cjg3oHmg9uuPsP8D6g29NWvhySJkdYdAo9D25PRbKXJ');
const chainlinkFeedAddress = new PublicKey('99B2bTijsU6f1GCT73HmdR7HCFFjGMBcPZY6jZ96ynrR');

const fetchPythPrice = async () => {
  const priceFeeds = await pythConnection.getLatestPriceFeeds([pythPriceId]);
  const priceData = priceFeeds[0];
  return priceData.price.price / Math.pow(10, 8);
};

const fetchChainlinkPrice = async () => {
  const dataFeed = await OCR2Feed.load(chainlinkProgramId, { connection });
  const latestRound = await dataFeed.getLatestRound(chainlinkFeedAddress);
  return latestRound.answer.toNumber() / Math.pow(10, 8);
};

export default async function handler(req, res) {
  try {
    const pythPrice = await fetchPythPrice();
    const chainlinkPrice = await fetchChainlinkPrice();
    const averagePrice = (pythPrice + chainlinkPrice) / 2;

    res.status(200).json({ 
      pythPrice: pythPrice.toFixed(2), 
      chainlinkPrice: chainlinkPrice.toFixed(2), 
      averagePrice: averagePrice.toFixed(2) 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
