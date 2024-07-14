import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [prices, setPrices] = useState({ pythPrice: null, chainlinkPrice: null, averagePrice: null });

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get('/api/price');
        setPrices(response.data);
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    };
    fetchPrices();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Oracle Aggregator</h1>
      <div className="flex space-x-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold">Pyth Network</h2>
          <p className="text-xl">{prices.pythPrice ? `$${prices.pythPrice}` : 'Loading...'}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold">Chainlink</h2>
          <p className="text-xl">{prices.chainlinkPrice ? `$${prices.chainlinkPrice}` : 'Loading...'}</p>
        </div>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-8">
        <h2 className="text-2xl font-semibold">Average Price</h2>
        <p className="text-xl">{prices.averagePrice ? `$${prices.averagePrice}` : 'Loading...'}</p>
      </div>
    </div>
  );
}
