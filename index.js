//global modules
const ccxt = require('ccxt');
const express = require('express');

//local modules
const {getKraken, getBinance, getBitfinex} = require('./helpers');

//config server
let app = express();
let port = process.env.PORT || 3000;

//middleware
app.set('view engine', 'pug');

//cache config
let cache = {krakenTickers: [], binanceTickers: [], bitfinexTickers: []};
const cacheExpiration = 30000;
let lastUpdate = 0;

//updates data if stale
async function getData() {
  if (Date.now() < lastUpdate + cacheExpiration) {
    return cache;
  }

  try {
    let [krakenTickers, binanceTickers, bitfinexTickers] = await Promise.all([getKraken(), getBinance(), getBitfinex()]);
    cache = {krakenTickers, binanceTickers, bitfinexTickers};
    lastUpdate = Date.now();
  } catch(e) {
    console.error(e);
  }

  return cache;
}

app.get('/', async (req, res) => {
  const testValue = 74.931;
  let {krakenTickers, bitfinexTickers, binanceTickers} = await getData();
  let bitfinexBuyBTC = (testValue * bitfinexTickers[1].bid) * krakenTickers[2].bid;
  let binanceBuyBTC = (testValue * binanceTickers[0].bid) * krakenTickers[2].bid;
  let krakenBuyBTC = (testValue * krakenTickers[1].bid) * krakenTickers[2].bid;
  let binanceBuyETH = (testValue * binanceTickers[1].bid) * krakenTickers[3].bid;
  let krakenSellDash = testValue * krakenTickers[0].bid;
  let btcBinanceFee = (0.0005 * krakenTickers[2].bid).toFixed(2);
  let btcBitfinexFee = (0.0004 * krakenTickers[2].bid).toFixed(2);
  let ethBinanceFee = (0.01 * krakenTickers[3].bid).toFixed(2);

  res.render('index', {
    title: "Arbitrage!",
    cashout: "Cashout Options",
    details: `53.1 dash | ${Date(Date.now().toString())}`,

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
    dashbtc: `${binanceTickers[0].symbol}: ${binanceTickers[0].bid}`,
    dasheth: `${binanceTickers[1].symbol}: ${binanceTickers[1].bid}`,

    bitfinex: "Bitfinex",
    dashusd: `${bitfinexTickers[0].symbol}: ${bitfinexTickers[0].bid}`,
    dashbtc2: `${bitfinexTickers[1].symbol}: ${bitfinexTickers[1].bid}`,

    kraken: "Kraken",
    dashusd2: `${krakenTickers[0].symbol}: ${krakenTickers[0].bid}`,
    dashbtc3: `${krakenTickers[1].symbol}: ${krakenTickers[1].bid}`,
    btcusd: `${krakenTickers[2].symbol}: ${krakenTickers[2].bid}`,
    ethusd: `${krakenTickers[3].symbol}: ${krakenTickers[3].bid}`
  });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});



