import React, { useEffect, useState } from 'react';

const RetestComponent = ({ data, movingAverageLevel, inProgress }) => {
  const [retestCandle, setRetestCandle] = useState(null);

  useEffect(() => {
    if (inProgress) {
      findRetestCandle();
    }
  }, [inProgress]);

  const findRetestCandle = () => {
    // Implement your logic to find the retest candle
    // For example, you can iterate through recent candles to find one touching the MA
    for (let i = data.length - 1; i >=data.length - 4; i--) {
      const candle = data[i];
      if (candle.y[2] <= movingAverageLevel && candle.y[1] >= movingAverageLevel) {
        console.log('Retesting Done')
        console.log(candle);
        setRetestCandle(candle);
        break;
      }
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
        <p>No retest candle found yet...</p>
      )}
    </div>
  );
};

export default RetestComponent;
