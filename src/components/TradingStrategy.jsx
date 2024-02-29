import { useEffect, useRef, useState } from 'react';
import RetestComponent from './Retesting'; // Import your RetestComponent

const TradingStrategy = ({
  data,
  movingAverageLevel,
  setRetesting,
}) => {
  const [breakoutDetected, setBreakoutDetected] = useState(false);
  const [retestingInProgress, setRetestingInProgress] = useState(false); // Flag to control retesting
  const retestingTimer = useRef(null); // Timer reference
 
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);


  useEffect(() => {
    const executeTradingStrategy = async () => {
      if (data.length < 2 || !data[data.length - 1]) {
        return;
      }

      const lastCandle = data[data.length - 1];
      if (!lastCandle.y || lastCandle.y.length < 4) {
        console.error("Invalid candle data");
        return;
      }

      const openValue = lastCandle.y[0];
      const closeValue = lastCandle.y[3];
      const isBreakingResistance = closeValue > movingAverageLevel && openValue < movingAverageLevel;
      const isBreakingSupport = closeValue < movingAverageLevel && openValue > movingAverageLevel;

      const isHalfBodyCrossing = (candle, isBreakingResistance, isBreakingSupport) => {
        const bodySize = Math.abs(candle.y[3] - candle.y[0]);
        const bodyMidpoint = Math.min(candle.y[3], candle.y[0]) + bodySize / 2;

        if (isBreakingResistance) {
          return bodyMidpoint >= movingAverageLevel;
        } else if (isBreakingSupport) {
          return bodyMidpoint <= movingAverageLevel;
        } else {
          return false;
        }
      };

      if (isBreakingResistance || isBreakingSupport) {
        const b = isHalfBodyCrossing(lastCandle, isBreakingResistance, isBreakingSupport);
        if (b) {
          console.log(`${isBreakingResistance ? 'Green' : 'Red'} found... Retesting begins...`);
          setBreakoutDetected(true);
          setRetestingInProgress(true); // Start retesting
          // Set a timer for 10 seconds for example
          retestingTimer.current = setTimeout(() => {
            setRetestingInProgress(false); // Stop retesting after 10 seconds
          }, 30000); // 10 seconds in milliseconds
        } else {
          console.log(`Half body issue ${isBreakingResistance ? 'G' : 'R'}, tracking...`);
        }
      } else {
        console.log('Tracking...');
      }
    };

    executeTradingStrategy();
    return () => clearTimeout(retestingTimer.current);
  }, [
    data,
    movingAverageLevel,
    setRetesting
  ]);


  return (
    <>
      {/* Render RetestComponent conditionally */}
      {breakoutDetected && <RetestComponent data={data} movingAverageLevel={movingAverageLevel} inProgress={retestingInProgress} />}
      {/* Your existing logic and components */}
    </>
  );
};

export default TradingStrategy;
