// server.js
const express = require('express');
const cors = require('cors');
const generateCandles = require('./Data/GenerateData');

const app = express();
const port = 5000;

app.use(cors());

let candles = generateCandles(1, 100); 
let lastCandleTime = Date.now();

setInterval(() => {
  const newCandle = generateCandles(1, 1)[0]; 
  newCandle.time = new Date(lastCandleTime).toISOString();
  candles = [newCandle, ...candles].slice(0, 100); 
  lastCandleTime -= 5 * 1000; 
}, 5000);

app.get('/api/candles', (req, res) => {
  const latestCandle = candles[0]; 
  res.json(latestCandle);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
