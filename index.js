//global modules
const express = require('express');
let app = express();
const ccxt = require('ccxt');

//local modules
const helpers = require('./helpers');

//middleware
app.set('view engine', 'pug');

let binanceTickers = helpers.getBinance();
let krakenTickers = helpers.getKraken();
let bitfinexTickers = helpers.getBitfinex();

krakenTickers.then((krakenData) => {
  bitfinexTickers.then((bitfinexData) => {
    binanceTickers.then((binanceData) => {
      let testValue = 53.1;
      let bitfinexBuyBTC = (testValue * bitfinexData[1].bid) * krakenData[2].bid;
      let binanceBuyBTC = (testValue * binanceData[0].bid) * krakenData[2].bid;
      let krakenBuyBTC = (testValue * krakenData[1].bid) * krakenData[2].bid;
      let binanceBuyETH = (testValue * binanceData[1].bid) * krakenData[3].bid;
      let krakenSellDash = testValue * krakenData[0].bid;

      let btcBinanceFee = (0.0005 * krakenData[2].bid).toFixed(2);
      let btcBitfinexFee = (0.0004 * krakenData[2].bid).toFixed(2);
      let ethBinanceFee = (0.01 * krakenData[3].bid).toFixed(2);

      app.get('/', (req, res) => {
        res.render('index', {
          title: "Arbitrage!",
          cashout: "Cashout Options",
          details: "53.1 dash",

          btc: `BTC to USD (fees: Bitfinex: $${btcBitfinexFee}, Binance: $${btcBinanceFee})`,
          bitfinexBuyBTC: `Bitfinex / Kraken: ${bitfinexBuyBTC}`,
          binanceBuyBTC: `Binance / Kraken: ${binanceBuyBTC}`,
          krakenBuyBTC: `Kraken / Kraken: ${krakenBuyBTC}`,

          eth: `ETH to USD (fees: Binance: $${ethBinanceFee})`,
          binanceBuyETH: `Binance / Kraken: ${binanceBuyETH}`,

          dash: "Dash to USD",
          krakenSellDash: `Kraken: ${krakenSellDash}`,

          markets: "Markets",
          binance: "Binance",
          dashbtc: `${binanceData[0].symbol}: ${binanceData[0].bid}`,
          dasheth: `${binanceData[1].symbol}: ${binanceData[1].bid}`,

          bitfinex: "Bitfinex",
          dashusd: `${bitfinexData[0].symbol}: ${bitfinexData[0].bid}`,
          dashbtc2: `${bitfinexData[1].symbol}: ${bitfinexData[1].bid}`,

          kraken: "Kraken",
          dashusd2: `${krakenData[0].symbol}: ${krakenData[0].bid}`,
          dashbtc3: `${krakenData[1].symbol}: ${krakenData[1].bid}`,
          btcusd: `${krakenData[2].symbol}: ${krakenData[2].bid}`,
          ethusd: `${krakenData[3].symbol}: ${krakenData[3].bid}`
        });
      });
    });
  });
});

app.listen(8000, () => {
  console.log('Example app listening on port 8000');
})
