function generateRealisticCandles(interval, count = 400, initialPrice = 100) {
  const candles = [];
  let currentTime = Date.now();
  let lastClose = initialPrice; // Start with the initial price

  for (let i = 0; i < count; i++) {
    const randomMovement = (Math.random() - 0.5) * 5; // Small random movement
    const open = lastClose + randomMovement; // Open near the last close
    const close = open + (Math.random() - 0.5) * 10; // Close varies around open
    const high = Math.max(open, close) + Math.random() * 2; // High slightly above open/close
    const low = Math.min(open, close) - Math.random() * 2; // Low slightly below open/close

    candles.push({
      time: new Date(currentTime).toISOString(),
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
    });

    lastClose = close; // Update last close for the next candle
    currentTime -= interval * 60 * 1000; // Adjust time for interval
  }

  return candles.reverse(); // Reverse to chronological order
}

module.exports = generateRealisticCandles;
