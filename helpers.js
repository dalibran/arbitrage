'use strict';
const ccxt = require('ccxt');

async function getTickers(exchange, tickerSymbols) {
  let tickers = [];

  for (const item of tickerSymbols) {
    let ticker = await (exchange.fetchTicker(item));
    tickers.push(ticker);
  }

  return tickers
}

function getBinance() {
  let binance = new ccxt.binance();
  let binanceSymbols = ['DASH/BTC', 'DASH/ETH'];
  let binanceTickers = getTickers(binance, binanceSymbols);
  binanceTickers.then((array) => {
    console.log('\nBinance\n=========');
    array.forEach(function(e) {
      console.log(e.symbol + ': ' + e.bid);
    });
  });
  return binanceTickers;
};

function getKraken() {
  let kraken = new ccxt.kraken();
  let krakenSymbols = ['DASH/USD', 'DASH/BTC', 'BTC/USD', 'ETH/USD'];
  let krakenTickers = getTickers(kraken, krakenSymbols);
  krakenTickers.then((array) => {
    console.log('\nKraken\n=========');
    array.forEach(function(e) {
      console.log(e.symbol + ': ' + e.bid);
    })
  });
  return krakenTickers;
}

function getBitfinex() {
  let bitfinex = new ccxt.bitfinex();
  let bitfinexSymbols = ['DASH/USD', 'DASH/BTC'];
  let bitfinexTickers = getTickers(bitfinex, bitfinexSymbols);
  bitfinexTickers.then((array) => {
    console.log('Bitfinex\n===========');
    array.forEach(function(e) {
      console.log(e.symbol + ': ' + e.bid);
    })
  });
  return bitfinexTickers;
}

module.exports = {
  getTickers,
  getBinance,
  getKraken,
  getBitfinex
}
