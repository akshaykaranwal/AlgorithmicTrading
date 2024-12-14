import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import TradingStrategy from '../components/TradingStrategy';
import { calculateSMA } from '../indicator/Movingavg';

const Home = () => {
  const [data, setData] = useState([]); // Candlestick data
  const [movingAverageLevel, setMovingAverageLevel] = useState(100); // Moving average level
  const [smaData, setSmaData] = useState([]); // SMA data

  const SMA_PERIOD =5; // Define a consistent SMA period

  const fetchInitialData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/candles?count=400'); // Fetch initial data
      const jsonData = await response.json();

      const processedData = jsonData.map((entry) => ({
        x: new Date(entry.time).getTime(),
        y: [entry.open, entry.high, entry.low, entry.close],
      }));

      setData(processedData);
      const sma = calculateSMA(processedData, SMA_PERIOD); // Calculate SMA
      setSmaData(sma);
    } catch (error) {
      console.error('Error fetching initial candle data:', error);
    }
  };

  const fetchNewCandle = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/candles'); // Fetch the latest candle
      const newCandle = await response.json();

      const processedCandle = {
        x: new Date(newCandle.time).getTime(),
        y: [newCandle.open, newCandle.high, newCandle.low, newCandle.close],
      };

      setData((prevData) => {
        const updatedData = [...prevData, processedCandle].slice(-400); // Keep last 400 candles
        const sma = calculateSMA(updatedData, SMA_PERIOD); // Recalculate SMA
        setSmaData(sma); // Update SMA data
        return updatedData;
      });
    } catch (error) {
      console.error('Error fetching new candle:', error);
    }
  };

  const handleDataUpdate = (updatedData) => {
    setData(updatedData);
    const sma = calculateSMA(updatedData, SMA_PERIOD); // Recalculate SMA
    setSmaData(sma);
    console.log('Updated Data:', updatedData);
    console.log('Updated SMA:', sma);
  };

  useEffect(() => {
    fetchInitialData(); // Initial fetch
    const intervalId = setInterval(fetchNewCandle, 2000); // Fetch new data every 2 seconds
    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  return (
    <div>

      <ReactApexChart
        options={{
          chart: {
            type: 'candlestick',
            height: 350,
            animations: {
              enabled: true,
              easing: 'linear',
              speed: 800, // Smooth transition for new candles
            },
          },
          xaxis: {
            type: 'datetime',
            range: data.length > 50 ? 50 * 2000 : undefined, // Show last 50 candles (2000ms interval)
          },
        }}
        series={[
          {
            name: 'Candlestick',
            type: 'candlestick',
            data: data,
          },
          {
            name: 'SMA',
            type: 'line',
            data: smaData,
          },
        ]}
        type="candlestick"
        height={650}
      />
      <TradingStrategy movingAverageLevel={movingAverageLevel} onDataUpdate={handleDataUpdate} />
    </div>

  );
};

export default Home;
