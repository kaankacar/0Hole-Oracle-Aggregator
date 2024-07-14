import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import 'tailwindcss/tailwind.css';
import { format } from 'date-fns';

export default function Home() {
  const [prices, setPrices] = useState({ pythPrice: null, chainlinkPrice: null, averagePrice: null });
  const [pythHistory, setPythHistory] = useState([]);
  const [chainlinkHistory, setChainlinkHistory] = useState([]);
  const [averageHistory, setAverageHistory] = useState([]);
  const [labels, setLabels] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState('All');

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get('/api/price');
        const now = new Date();
        setPrices(response.data);

        setPythHistory(prevHistory => [...prevHistory, response.data.pythPrice].slice(-30));
        setChainlinkHistory(prevHistory => [...prevHistory, response.data.chainlinkPrice].slice(-30));
        setAverageHistory(prevHistory => [...prevHistory, response.data.averagePrice].slice(-30));
        setLabels(prevLabels => [...prevLabels, format(now, 'HH:mm:ss')].slice(-30));
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    };

    fetchPrices(); // Fetch initially
    const interval = setInterval(fetchPrices, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Pyth Network',
        data: pythHistory,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        hidden: selectedProvider !== 'All' && selectedProvider !== 'Pyth'
      },
      {
        label: 'Chainlink',
        data: chainlinkHistory,
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
        hidden: selectedProvider !== 'All' && selectedProvider !== 'Chainlink'
      },
      {
        label: 'Average Price',
        data: averageHistory,
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        fill: true,
        hidden: selectedProvider !== 'All'
      },
    ],
  };

  const handleProviderChange = (event) => {
    setSelectedProvider(event.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex">
      <div className="flex flex-col items-center space-y-4 w-2/3">
        <header className="flex justify-between w-full items-center mb-4">
          <div className="flex items-center">
            <img src="/logo.png" alt="0hole Logo" className="w-10 h-10 mr-4" />
            <h1 className="text-3xl font-bold">0hole Oracle Aggregator</h1>
          </div>
        </header>
        <div className="w-full max-w-6xl p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">SOL/USD Price History</h2>
          <div className="h-80">
            <Line data={data} />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center w-1/3 space-y-6">
        <select 
          className="bg-gray-900 text-white p-2 rounded-lg border border-gray-700"
          value={selectedProvider}
          onChange={handleProviderChange}
        >
          <option value="All">All</option>
          <option value="Pyth">Pyth</option>
          <option value="Chainlink">Chainlink</option>
        </select>
        <a 
          href="https://raydium.io/swap" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-purple-600 text-white p-2 rounded-lg shadow-lg"
        >
          Swap Now on Raydium
        </a>
        {selectedProvider === 'All' || selectedProvider === 'Pyth' ? (
          <div className="text-center p-4 rounded-lg shadow-lg w-full">
            <h2 className="text-2xl font-semibold">PYTH NETWORK</h2>
            <div className="text-4xl font-bold">${prices.pythPrice}</div>
          </div>
        ) : null}
        {selectedProvider === 'All' || selectedProvider === 'Chainlink' ? (
          <div className="text-center p-4 rounded-lg shadow-lg w-full">
            <h2 className="text-2xl font-semibold">CHAINLINK</h2>
            <div className="text-4xl font-bold">${prices.chainlinkPrice}</div>
          </div>
        ) : null}
        {selectedProvider === 'All' ? (
          <div className="text-center p-4 rounded-lg shadow-lg w-full">
            <h2 className="text-2xl font-semibold">AVERAGE PRICE</h2>
            <div className="text-4xl font-bold">${prices.averagePrice}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
