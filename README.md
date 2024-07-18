# 0hole Oracle Aggregator ![](../oracle-aggregator/public/logo.png)

The live website: https://0-hole-oracle-aggregator.vercel.app/

## Description

0hole Oracle Aggregator is a web3 app that fetches SOL/USD price data from Pyth Network and Chainlink oracles. The application displays the real-time prices and their average, and also visualizes the price history using a line chart. Users can filter the displayed data by selecting a specific oracle or view data from both oracles simultaneously.

## Features

- Fetch real-time SOL/USD prices from Pyth Network and Chainlink.
- Calculate and display the average price.
- Visualize the price history in a line chart.
- Dropdown to filter data by specific oracle providers.
- "Swap Now on Raydium" button that redirects to the Raydium swap page.

## Technologies Used

- Next.js
- React
- Chart.js
- Tailwind CSS
- Axios

## Installation

1. Clone the repository:
    ```bash
    git clone <repository_url>
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```

4. Open your browser and navigate to `http://localhost:3000`.

## API Endpoints

- `/api/price`: Fetches the latest SOL/USD prices from Pyth Network and Chainlink, and calculates the average price.

## Usage

1. Open the application in your browser.
2. Use the dropdown menu to filter data by specific oracle providers or view data from all providers.
3. Click the "Swap Now on Raydium" button to go to the Raydium swap page.

## License

This project is licensed under the MIT License.
