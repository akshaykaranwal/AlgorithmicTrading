import React, { useEffect, useState } from 'react';

const RetestComponent = ({ data, movingAverageLevel, inProgress, onRetestingComplete }) => {
  const [retestCandle, setRetestCandle] = useState(null);

  useEffect(() => {
    if (inProgress) {
      findRetestCandle();
    }
  }, [inProgress]);

  const findRetestCandle = () => {
    let retestingSuccessful = false;

    for (let i = data.length - 1; i >= data.length - 4; i--) {
      const candle = data[i];
      if (candle && candle.y[2] <= movingAverageLevel && candle.y[1] >= movingAverageLevel) {
        console.log('Retesting Done');
        console.log('Retest Candle:', candle);
        setRetestCandle(candle);
        retestingSuccessful = true;
        break;
      }
    }

    if (retestingSuccessful) {
      // Notify parent component that retesting is successful
      onRetestingComplete(true);
    } else {
      // Notify parent component that retesting failed
      onRetestingComplete(false);
    }
  };

  return (
    <div>
      {retestCandle ? (
        <div>
          <h3>Retest Candle Found:</h3>
          <p>Date: {retestCandle.x}</p>
          <p>Open: {retestCandle.y[0]}</p>
          <p>High: {retestCandle.y[1]}</p>
          <p>Low: {retestCandle.y[2]}</p>
          <p>Close: {retestCandle.y[3]}</p>
        </div>
      ) : (
        <p>Searching for a valid retest candle...</p>
      )}
    </div>
  );
};

export default RetestComponent;
