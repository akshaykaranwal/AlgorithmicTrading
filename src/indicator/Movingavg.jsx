function calculateSMA(data, period) {
  const result = [];
  let sum = 0;

  for (let i = 0; i < data.length; i++) {
    const closePrice = data[i].y[3]; // Assuming y[3] contains the closing price

    sum += closePrice;

    if (i >= period - 1) {
      const average = sum / period;
      result.push({
        x: data[i].x, // Use the same timestamp as the candle
        y: average,
      });

      // Update sum by subtracting the oldest closing price
      sum -= data[i - (period - 1)].y[3];
    }
  }

  return result;
}

export { calculateSMA };