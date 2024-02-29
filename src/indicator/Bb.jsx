const calculateBollingerBands = (data) => {
    const closingPrices = data.map((price) => price.y[3]); // Assuming close prices are at index 3
  
    // Calculate SMA, upper band, and lower band based on your desired period (e.g., 20 days)
    const period = 20;
    const sma = [];
    const upperBand = [];
    const lowerBand = [];
  
    for (let i = 0; i < closingPrices.length; i++) {
      const start = Math.max(0, i - period + 1);
      const end = i + 1;
  
      const slice = closingPrices.slice(start, end);
  
      const average = slice.reduce((sum, price) => sum + price, 0) / slice.length;
      const standardDeviation = Math.sqrt(
        slice.reduce((sum, price) => sum + Math.pow(price - average, 2), 0) / slice.length
      );
  
      sma.push(average);
      upperBand.push(average + 2 * standardDeviation);
      lowerBand.push(average - 2 * standardDeviation);
    }
  
    return { sma, upperBand, lowerBand };
  };
  

export { calculateBollingerBands};
