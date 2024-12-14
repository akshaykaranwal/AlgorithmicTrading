import { useEffect, useRef, useState } from 'react';
import RetestComponent from './Retesting';
import { find } from 'react-stockcharts/lib/utils';

const TradingStrategy = ({ movingAverageLevel, onDataUpdate }) => {
  const [data, setData] = useState([]);
  const [breakoutDetected, setBreakoutDetected] = useState(false);
  const [retestingInProgress, setRetestingInProgress] = useState(false);
  const [stopLoss, setStopLoss] = useState(null);
  const [target, setTarget] = useState(null);
  const [tradeResult, setTradeResult] = useState(null); // Store "Buy" or "Sell" result
  const breakoutCandleRef = useRef(null);
  const [monitorCount, setMonitorCount] = useState(0); // Counter for candles during monitoring
  const [retestCount, setRetestCount] = useState(0); // Counter for candles during retesting
  
  const MAX_RETEST_CANDLES = 10; // Limit for retesting phase
  const MAX_TARGET_CANDLES = 20;

  const fetchCandleData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/candles');
      const newCandle = await response.json();

      const processedCandle = {
        x: new Date(newCandle.time).getTime(),
        y: [newCandle.open, newCandle.high, newCandle.low, newCandle.close],
      };

      setData((prevData) => {
        const updatedData = [...prevData, processedCandle];
        onDataUpdate(updatedData);
        return updatedData;
      });

      if (retestingInProgress) {
        runRetesting(processedCandle);
      } else if (stopLoss && target && !tradeResult) {
        monitorTarget(processedCandle);
      } else if (!tradeResult) {
        executeTradingStrategy(processedCandle);
      }
    } catch (error) {
      console.error('Error fetching candle data:', error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(fetchCandleData, 2000); // Fetch every 2 seconds
    return () => clearInterval(intervalId);
  }, []);

  const executeTradingStrategy = (newCandle) => {
    if (newCandle.length < 3) {
      console.error('Not enough candle data for strategy evaluation.');
      return;
    }

    const openValue = newCandle.y[0];
    const closeValue = newCandle.y[3];
    console.log('Open:', openValue, 'Close:', closeValue);
    console.log('Moving Average Level:', movingAverageLevel);
    const isBreakingResistance = closeValue > movingAverageLevel && openValue < movingAverageLevel;
    const isBreakingSupport = closeValue < movingAverageLevel && openValue > movingAverageLevel;
    console.log('Breaking Resistance:', isBreakingResistance, 'Breaking Support:', isBreakingSupport);
    
    const isHalfBodyCrossing = (candle, isBreakingResistance, isBreakingSupport) => {
      const bodySize = Math.abs(candle.y[3] - candle.y[0]);
      const bodyMidpoint = Math.min(candle.y[3], candle.y[0]) + bodySize / 2;

      if (isBreakingResistance) {
        return bodyMidpoint >= movingAverageLevel;
      } else if (isBreakingSupport) {
        return bodyMidpoint <= movingAverageLevel;
      }
      return false;
    };

    if (isBreakingResistance || isBreakingSupport) {
      const isHalfBodyCross = isHalfBodyCrossing(newCandle, isBreakingResistance, isBreakingSupport);
      if (isHalfBodyCross) {
        console.log('Breakout detected. Starting retesting...');
        setBreakoutDetected(true);
        setRetestingInProgress(true);
        breakoutCandleRef.current = newCandle;
      } else {
        console.log('Half-body condition not met, resuming strategy...');
      }
    } else {
      console.log('No breakout detected. Tracking...');
      console.log('                                      ');
    }
  };

  const runRetesting = (newCandle) => {
    setRetestCount((prevCount) => {
      const updatedCount = prevCount + 1;

      if (updatedCount > MAX_RETEST_CANDLES) {
        console.log('Retesting phase exceeded limit. Resuming strategy...');
        setRetestingInProgress(false);
        setBreakoutDetected(false);
        setRetestCount(0);
      } else if (isValidRetestCandle(newCandle)) {
        console.log('Retesting successful.');
        handleRetestingComplete(true);
        setRetestCount(0); 
      }

      return updatedCount;
    });
  };

  const isValidRetestCandle = (candle) => {
    return candle.y[2] <= movingAverageLevel && candle.y[1] >= movingAverageLevel;
  };

  const handleRetestingComplete = (retestSuccessful) => {
    if (retestSuccessful) {
      console.log('Retesting completed successfully.');
      const breakoutCandle = breakoutCandleRef.current;

      // Calculate stop loss
      const isGreen = breakoutCandle.y[3] > breakoutCandle.y[0]; // Close > Open => Green
      const stopLossValue = isGreen ? breakoutCandle.y[2] : breakoutCandle.y[1]; // Low for Green, High for Red
      setStopLoss(stopLossValue);

      // Calculate target
      const targetValue = isGreen
        ? (breakoutCandle.y[2]- movingAverageLevel) * 2 
        : (movingAverageLevel-breakoutCandle.y[1]) * 2; 
      setTarget(targetValue);

      console.log('Stop Loss:', stopLossValue);
      console.log('Target:', targetValue);

      // Begin monitoring target
      setMonitorCount(0);
      setRetestingInProgress(false);
    } else {
      console.log('Retesting failed or not valid. Resuming strategy...');
      setRetestingInProgress(false);
    }
  };

  const monitorTarget = (newCandle) => {
    if (tradeResult || monitorCount >= 20) {
      if (monitorCount >= 20) {
        console.log('Target or Stop Loss not hit within 20 candles.');
        setTradeResult('No Trade');
      }
      return;
    }
    const breakoutLow = breakoutCandleRef.current.y[2];
    const low = newCandle.y[2];
    const high = newCandle.y[1];

    // Check if target or stop loss is hit
    if (high >= target) {
      console.log('Target hit! Result: Buy');
      setTradeResult('Buy');
    } else if (breakoutLow <= stopLoss) {
      console.log('Stop Loss hit! Result: Sell');
      setTradeResult('Sell'); 
    } else {
      setMonitorCount((prevCount) => prevCount + 1);
      console.log(`Monitoring candle ${monitorCount + 1}...`);
    }
  };

  return (
    <div>
      {tradeResult ? (
        <h2>Trade Result: {tradeResult}</h2>
      ) : retestingInProgress ? (
        <>
        <p>Retesting in progress...</p>
        <RetestComponent
          data={data}
          movingAverageLevel={movingAverageLevel}
          inProgress={retestingInProgress}
          onRetestingComplete={handleRetestingComplete}
        /> </>
      ) : (
        <p>
          Strategy running... {stopLoss && `Stop Loss: ${stopLoss}`} {target && `Target: ${target} `} {monitorCount && `Monitored Candles: ${monitorCount}`}
        </p>
      )}
    </div>
  );
};

export default TradingStrategy;
