import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { calculateBollingerBands } from '../indicator/Bb';
import '../pages/home.css';
import StockMarketData from '../components/StockMarket';
import { calculateSMA } from '../indicator/Movingavg';
import TradingStrategy from '../components/TradingStrategy';

const Alpha = () => {
  const [data, setData] = useState([]);
  const [bollingerBands, setBollingerBands] = useState({ sma: [], upperBand: [], lowerBand: [] });
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [selectedSymbol, setSelectedSymbol] = useState('TSLA'); // Initial symbol, you can change this as needed
  const [smaData, setSmaData] = useState([]);
  // Add state to store trading strategy parameters
  const [movingAverageLevel, setMovingAverageLevel] = useState(0); // Rename to better reflect the single moving average level
  const [riskRewardRatio, setRiskRewardRatio] = useState(2);
  const [isInTrade, setIsInTrade] = useState(false);
  const [tradeType, setTradeType] = useState('');
  const [stopLossLevel, setStopLossLevel] = useState(0);
  const [takeProfitLevel, setTakeProfitLevel] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiKey = 'VTBIQPS15FNXS8L4'; // Replace 'YOUR_API_KEY' with your actual Alpha Vantage API key
        const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${selectedSymbol}&interval=1min&apikey=${apiKey}`;

        const response = await fetch(apiUrl);
        const jsonData = await response.json();

        console.log('API Response:', jsonData);

        const processedData = [];
        for (const timestamp in jsonData['Time Series (1min)']) {
          const priceData = jsonData['Time Series (1min)'][timestamp];
          processedData.push({
            x: new Date(timestamp).getTime(),
            y: [parseFloat(priceData['1. open']), parseFloat(priceData['2. high']), parseFloat(priceData['3. low']), parseFloat(priceData['4. close'])]
          });
        }

        console.log('Processed Data:', processedData);
        setData(processedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 60000);

    return () => clearInterval(intervalId);
  }, [selectedSymbol]);

  useEffect(() => {
    const calculateBollingerBand = async () => {
      try {
        const result = calculateBollingerBands(data);
        console.log('Bollinger Bands Result:', result);
        setBollingerBands(result);
      } catch (error) {
        console.error('Error calculating Bollinger Bands:', error);
      }
    };

    calculateBollingerBand();
  }, [data]);

  useEffect(() => {
    const calculateSma = async () => {
      try {
        const period = 3; // Set your desired SMA period
        const filteredData = data.filter((entry) => entry.y.every((value) => value !== null));
    
        const result = calculateSMA(filteredData, period);
        console.log('ma', result);
        setSmaData(result);
    
        // Set the moving average level based on the last value in the SMA data
        setMovingAverageLevel(result[result.length - 1]);
      } catch (error) {
        console.error('Error calculating SMA:', error);
      }
    };
    
  
    calculateSma();
  }, [data]);
  
  const options = {
    // Your chart options
    chart: {
        type: 'candlestick',
        height: 1000,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          },
        },
        zoom: {
          enabled: true,
        },
      },
      title: {
        text: 'Candlestick Chart with Bollinger Bands',
        align: 'left',
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: '#00CC00', // Green for upward candles
            downward: '#FF0000', // Red for downward candles
          },
          wick: {
            useFillColor: false,
          },
          border: {
            width: 2,
          },
        },
      },
      stroke: {
        width: 1,
        colors: ['black', ''],
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        borderColor: '#f1f1f1',
      },
      markers: {
        size: 0,
      },
      tooltip: {
        enabled: true,
        theme: 'dark',
        x: {
          format: 'dd MMM yyyy HH:mm:ss',
        },
        y: {
          formatter: function (value, { series, seriesIndex, dataPointIndex, w }) {
            // Customize the tooltip content here
            if (seriesIndex === 0) {
              // Candlestick series
              return `Open: ${w.globals.seriesCandleO[seriesIndex][dataPointIndex].toFixed(2)} <br>
                      High: ${w.globals.seriesCandleH[seriesIndex][dataPointIndex].toFixed(2)} <br>
                      Low: ${w.globals.seriesCandleL[seriesIndex][dataPointIndex].toFixed(2)} <br>
                      Close: ${w.globals.seriesCandleC[seriesIndex][dataPointIndex].toFixed(2)}`;
            } else {
              // Other series (Open, High, Low, Close)
              return `${value.toFixed(2)}`;
            }
          },
        },
      },
      xaxis: {
        type: 'datetime',
        labels: {
          datetimeFormatter: {
            year: 'yyyy',
            month: 'MMM \'yy',
            day: 'dd MMM',
            hour: 'HH:mm',
          },
        },
      },
      
      yaxis: {
        labels: {
          style: {
            colors: '#8e8da4',
          },
        },
        forceNiceScale: true,
        min: 194, // Set the minimum value for the y-axis
        max: 197, // Set the maximum value for the y-axis
        tickAmount: 20, // Set the number of ticks on the y-axis
      },
      responsive: [
        {
          breakpoint: 1000,
          options: {
            yaxis: {
              labels: {
                style: {
                  colors: '#8e8da4',
                },
              },
            },
          },
        },
      ],
  };

  const candlestickSeries = [
    // Your candlestick series
    {
        name: '',
        type: 'candlestick',
        data: data.map((price) => ({
          x: price.x,
          y: price.y,
        })),
        stroke: {
          width: 1,
          // Set the stroke color to black
        },
      },
  ];
  
  if (selectedIndicator === 'bollingerBands') {
    // Push Bollinger Bands series to candlestickSeries
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
        },
      );
  } else if (selectedIndicator === 'MovingAverage') {
    // Push Moving Average series to candlestickSeries
    candlestickSeries.push(
        {
          name: 'SMA',
          type: 'line',
          data: smaData.map((value, index) => ({ x: data[index].x, y: value })),
          color: '#0000FF',
        },
      );
  }

  return (
    <div>
      <div>
        <StockMarketData />
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
            setSelectedIndicator(null); // Reset selected indicator when changing symbols
          }}
        >
          <option value="TSLA">TSLA</option>
          <option value="RELIANCE.NS">RELIANCE.NS</option>
          <option value="MSFT">MSFT</option>
          <option value="GOOGL">GOOGL</option>
          <option value="AMZN">AMZN</option>
          {/* Add other symbols as needed */}
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

      {/* Display Candlestick Chart */}
      <ReactApexChart options={options} series={candlestickSeries} height={1000} />

      {/* Include TradingStrategy component */}
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
