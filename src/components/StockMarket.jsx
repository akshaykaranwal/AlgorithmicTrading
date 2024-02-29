import React, { useEffect, useState } from 'react';
import './stockmarket.css'

const StockMarketData = () => {
  const [marketData, setMarketData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiKey = 'pk_f777241111d348929253c23cd786dbf7';
        const symbols = ['SPY', 'DIA', 'QQQ', 'IWM', 'CL', 'GC']; // Symbols for S&P 500, Dow 30, Nasdaq, Russell 2000, Crude Oil, Gold
        const apiUrl = `https://cloud.iexapis.com/stable/stock/market/batch?symbols=${symbols.join(',')}&types=quote&token=${apiKey}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        console.log('Fetched Market Data:', data);

        // Access individual data
        const sp500Data = data['SPY'].quote;
        const dow30Data = data['DIA'].quote;
        const nasdaqData = data['QQQ'].quote;
        const russell2000Data = data['IWM'].quote;
        const crudeOilData = data['CL'].quote;
        const goldData = data['GC'].quote;

        console.log('S&P 500 Data:', sp500Data);
        console.log('Dow 30 Data:', dow30Data);
        console.log('Nasdaq Data:', nasdaqData);
        console.log('Russell 2000 Data:', russell2000Data);
        console.log('Crude Oil Data:', crudeOilData);
        console.log('Gold Data:', goldData);

        setMarketData([
          { name: 'S&P 500', data: sp500Data },
          { name: 'Dow 30', data: dow30Data },
          { name: 'Nasdaq', data: nasdaqData },
          { name: 'Russell 2000', data: russell2000Data },
          { name: 'Crude Oil', data: crudeOilData },
          { name: 'Gold', data: goldData },
        ]);
      } catch (error) {
        console.error('Error fetching market data:', error);
      }
    };

    fetchData();
  }, []); // The empty dependency array ensures that the effect runs only once, similar to componentDidMount

  return (
    <div className="stock-market-container">
      <ul className="stock-market-list">
        {marketData.map((item) => (
          <li className="stock-market-item" key={item.name}>
            <span className="stock-name">{item.name}: </span>
            <span className={`stock-price ${item.data.change > 0 ? 'up' : 'down'}`}>
              {item.data.latestPrice} ({item.data.change} - {item.data.changePercent}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StockMarketData;
