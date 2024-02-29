import { useEffect, useRef, useState } from 'react';
import RetestComponent from './Retesting'; // Import your RetestComponent

const TradingStrategy = ({
  data,
  movingAverageLevel,
  riskRewardRatio,
  isInTrade,
  setIsInTrade,
  tradeType,
  setTradeType,
  stopLossLevel,
  setStopLossLevel,
  takeProfitLevel,
  setTakeProfitLevel,
}) => {
  const [temporaryTakeProfitLevel, setTemporaryTakeProfitLevel] = useState(0);
  const [breakoutDetected, setBreakoutDetected] = useState(false);
  const [retesting, setRetesting] = useState(false); // State to manage retesting component

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (breakoutDetected) {
      setRetesting(true); // Activate retesting component when breakout is detected
    }
  }, [breakoutDetected]);

  useEffect(()=>{
    if(!retesting){
    const executeTradingStrategy = async() => {
      const isHalfBodyCrossing = (candle, isBreakingResistance,isBreakingSupport) => {
        const bodySize = Math.abs(candle.y[3] - candle.y[0]);
        const bodyMidpoint = Math.min(candle.y[3], candle.y[0]) + bodySize / 2;
    
        if(isBreakingResistance){
          return bodyMidpoint >= movingAverageLevel;
        }
        else if(isBreakingSupport){
          return bodyMidpoint <= movingAverageLevel;
        }
        else{
          return false;
        }
      };
      
      if (data.length < 2 || isInTrade) {
        return;
      }

      const lastCandle = data[data.length - 4];
      const openValue = lastCandle.y[0];
      const closeValue = lastCandle.y[3];
      const isBreakingResistance = closeValue > movingAverageLevel &&  openValue < movingAverageLevel;
      const isBreakingSupport = closeValue < movingAverageLevel && openValue > movingAverageLevel;
      
      if (isBreakingResistance) {
        
        const b = isHalfBodyCrossing(lastCandle, isBreakingResistance, isBreakingSupport);
        if (b) {
          console.log('Green found... Retesting begins...');
          setBreakoutDetected(true);     
        } 
        else {
          console.log('Half body issue G, tracking...');
        }
      } 
      else if (isBreakingSupport) {
        const b = isHalfBodyCrossing(lastCandle, isBreakingResistance, isBreakingSupport);
        if (b) {
          setBreakoutDetected(true);
          console.log('Red found... Retesting begins...');
        } 
        else {
          console.log('Half body issue R, tracking...');
        }
      } 
      else {
        console.log('Tracking...');
      }
  };

  executeTradingStrategy();

}}, [
    data,
    movingAverageLevel,
    riskRewardRatio,
    isInTrade,
    setIsInTrade,
    tradeType,
    setTradeType,
    stopLossLevel,
    setStopLossLevel,
    takeProfitLevel,
    setTakeProfitLevel,
  ]);
  useEffect(() => {
    if (temporaryTakeProfitLevel !== 0 && isMounted.current) {
      setTakeProfitLevel(temporaryTakeProfitLevel);
    }

    if (!isInTrade) {
      setTemporaryTakeProfitLevel(0);
    }
  }, [temporaryTakeProfitLevel, setTakeProfitLevel, isInTrade]);

  return (
    <>
      <RetestComponent 
        data={data} 
        movingAverageLevel={movingAverageLevel} 
        breakoutDetected={breakoutDetected} 
        setRetesting={setRetesting} 
      />
      {/* Your existing logic and components */}
    </>
  );
};

export default TradingStrategy;
