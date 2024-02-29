const calculateMACD = (data) => {
  const closingPrices = data.map((price) => price.y[3]);
  const shortTermPeriod = 12;
  const longTermPeriod = 26;
  const signalPeriod = 9;

  const shortTermEMA = calculateEMA(closingPrices, shortTermPeriod);
  const longTermEMA = calculateEMA(closingPrices, longTermPeriod);

  const macdLine = shortTermEMA.map((value, index) => value - longTermEMA[index]);

  const signalLine = calculateEMA(macdLine, signalPeriod);

  const histogram = macdLine.map((value, index) => value - signalLine[index]);

  return { macdLine, signalLine, histogram };
};

const calculateEMA = (data, period) => {
  const multiplier = 2 / (period + 1);
  const ema = [data[0]];

  for (let i = 1; i < data.length; i++) {
    const currentEMA = (data[i] - ema[i - 1]) * multiplier + ema[i - 1];
    ema.push(currentEMA);
  }

  return ema;
};

export {calculateMACD};
