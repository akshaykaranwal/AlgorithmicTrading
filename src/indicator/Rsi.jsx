import React from 'react';
import ReactApexChart from 'react-apexcharts';

const calculateRSI = (data) => {
  const closingPrices = data.map((price) => price.y[3]);
  const period = 14;
  const rsi = [];

  for (let i = period; i < closingPrices.length; i++) {
    const gains = [];
    const losses = [];

    for (let j = i - period; j < i; j++) {
      const priceDiff = closingPrices[j + 1] - closingPrices[j];
      if (priceDiff >= 0) {
        gains.push(priceDiff);
        losses.push(0);
      } else {
        gains.push(0);
        losses.push(Math.abs(priceDiff));
      }
    }

    const averageGain = gains.reduce((sum, gain) => sum + gain, 0) / period;
    const averageLoss = losses.reduce((sum, loss) => sum + loss, 0) / period;

    const relativeStrength = averageGain / averageLoss;
    const currentRSI = 100 - (100 / (1 + relativeStrength));

    rsi.push(currentRSI);
  }

  return { rsi };
};

const RSI = ({ data }) => {
  const { rsi } = calculateRSI(data);

  const options = {
    chart: {
      type: 'line',
      height: 150,
    },
    title: {
      text: 'Relative Strength Index (RSI)',
      align: 'left',
    },
    xaxis: {
      type: 'datetime',
    },
  };

  const series = [
    {
      name: 'RSI',
      data: rsi.map((value, index) => ({ x: data[index].x, y: value })),
    },
  ];

  return <ReactApexChart options={options} series={series} type="line" height={200} />;
};

export {calculateRSI,RSI};
