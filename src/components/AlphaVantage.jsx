import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { calculateBollingerBands } from '../indicator/Bb';
import '../pages/home.css';
import { calculateSMA } from '../indicator/Movingavg';
import TradingStrategy from '../components/TradingStrategy';

const Alpha = () => {
  const [data, setData] = useState([]);
  const [bollingerBands, setBollingerBands] = useState({ sma: [], upperBand: [], lowerBand: [] });
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [selectedSymbol, setSelectedSymbol] = useState('TSLA'); 
  const [smaData, setSmaData] = useState([]);
  const [movingAverageLevel, setMovingAverageLevel] = useState(0);
  const [riskRewardRatio, setRiskRewardRatio] = useState(2);
  const [isInTrade, setIsInTrade] = useState(false);
  const [tradeType, setTradeType] = useState('');
  const [stopLossLevel, setStopLossLevel] = useState(0);
  const [takeProfitLevel, setTakeProfitLevel] = useState(0);

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiKey = 'VTBIQPS15FNXS8L4'; 
        const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${selectedSymbol}&interval=1min&apikey=${apiKey}`;

        const response = await fetch(apiUrl);
        const jsonData = await response.json();

        if (jsonData['Time Series (1min)']) {
          const processedData = Object.entries(jsonData['Time Series (1min)']).map(([timestamp, priceData]) => ({
            x: new Date(timestamp).getTime(),
            y: [
              parseFloat(priceData['1. open']),
              parseFloat(priceData['2. high']),
              parseFloat(priceData['3. low']),
              parseFloat(priceData['4. close'])
            ]
          }));
          setData(processedData);
        } else {
          console.error('No time series data found:', jsonData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 60000); 
    return () => clearInterval(intervalId); 
  }, [selectedSymbol]);

  useEffect(() => {
    if (data.length > 0) {
      try {
        const result = calculateBollingerBands(data);
        setBollingerBands(result);
      } catch (error) {
        console.error('Error calculating Bollinger Bands:', error);
      }
    }
  }, [data]);


  useEffect(() => {
    if (data.length > 0) {
      try {
        const period = 3; 
        const result = calculateSMA(data, period);
        setSmaData(result);
        setMovingAverageLevel(result[result.length - 1]);
      } catch (error) {
        console.error('Error calculating SMA:', error);
      }
    }
  }, [data]);

 
  useEffect(() => {
    if (data.length > 0 && movingAverageLevel) {
      const latestCandle = data[data.length - 1];
      const closePrice = latestCandle.y[3]; 

      
      if (!isInTrade && closePrice > movingAverageLevel) {

        setTradeType('buy');
        setStopLossLevel(closePrice * (1 - 0.01)); 
        setTakeProfitLevel(closePrice * (1 + (0.01 * riskRewardRatio))); 
        setIsInTrade(true); 
      } else if (!isInTrade && closePrice < movingAverageLevel) {
        setTradeType('sell');
        setStopLossLevel(closePrice * (1 + 0.01)); 
        setTakeProfitLevel(closePrice * (1 - (0.01 * riskRewardRatio))); 
        setIsInTrade(true); 
      }

      if (isInTrade) {
        if (tradeType === 'buy' && (closePrice >= takeProfitLevel || closePrice <= stopLossLevel)) {
          setIsInTrade(false); 
        } else if (tradeType === 'sell' && (closePrice <= takeProfitLevel || closePrice >= stopLossLevel)) {
          setIsInTrade(false); 
        }
      }
    }
  }, [data, movingAverageLevel, isInTrade, tradeType, riskRewardRatio, stopLossLevel, takeProfitLevel]);

  const options = {
    chart: {
      type: 'candlestick',
      height: 1000,
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: true,
      },
    },
    title: {
      text: `Candlestick Chart with ${selectedIndicator === 'bollingerBands' ? 'Bollinger Bands' : 'SMA'}`,
      align: 'left',
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      labels: {
        formatter: (value) => value.toFixed(2),
      },
    },
  };

  const candlestickSeries = [
    {
      name: 'Price',
      type: 'candlestick',
      data: data.map((price) => ({
        x: price.x,
        y: price.y,
      })),
    },
  ];

  
  if (selectedIndicator === 'bollingerBands') {
    candlestickSeries.push(
      {
        name: 'Upper Band',
        type: 'line',
        data: bollingerBands.upperBand.map((value, index) => ({ x: data[index].x, y: value })),
        color: '#00CC00',
      },
      {
        name: 'SMA',
        type: 'line',
        data: bollingerBands.sma.map((value, index) => ({ x: data[index].x, y: value })),
        color: '#FFA500',
      },
      {
        name: 'Lower Band',
        type: 'line',
        data: bollingerBands.lowerBand.map((value, index) => ({ x: data[index].x, y: value })),
        color: '#FF0000',
      }
    );
  } else if (selectedIndicator === 'MovingAverage') {
    candlestickSeries.push({
      name: 'SMA',
      type: 'line',
      data: smaData.map((value, index) => ({ x: data[index].x, y: value })),
      color: '#0000FF',
    });
  }

  return (
    <div>
      <div>
        <input
          type="number"
          placeholder="Risk-Reward Ratio"
          value={riskRewardRatio}
          onChange={(e) => setRiskRewardRatio(Number(e.target.value))}
        />
        <select
          className="custom-dropdown"
          value={selectedSymbol}
          onChange={(e) => {
            setSelectedSymbol(e.target.value);
            setSelectedIndicator(null); 
          }}
        >
          <option value="TSLA">TSLA</option>
          <option value="RELIANCE.NS">RELIANCE.NS</option>
          <option value="MSFT">MSFT</option>
          <option value="GOOGL">GOOGL</option>
          <option value="AMZN">AMZN</option>
        </select>

        <select
          className="custom-dropdown"
          value={selectedIndicator}
          onChange={(e) => setSelectedIndicator(e.target.value)}
        >
          <option value={null}>Select Indicator</option>
          <option value="bollingerBands">Bollinger Bands</option>
          <option value="MovingAverage">Moving Average</option>
        </select>
      </div>

      {/* Candlestick chart with indicators */}
      <ReactApexChart options={options} series={candlestickSeries} height={1000} />

      {/* TradingStrategy component */}
      <TradingStrategy
        data={data}
        movingAverageLevel={movingAverageLevel}
        riskRewardRatio={riskRewardRatio}
        isInTrade={isInTrade}
        setIsInTrade={setIsInTrade}
        tradeType={tradeType}
        setTradeType={setTradeType}
        stopLossLevel={stopLossLevel}
        setStopLossLevel={setStopLossLevel}
        takeProfitLevel={takeProfitLevel}
        setTakeProfitLevel={setTakeProfitLevel}
      />
    </div>
  );
};

export default Alpha;
