let main = require('./src/main');

const round = (nbr) => Math.floor(nbr * 10000) / 10000;
const weisToRbtc = (weis) => round(weis / 1e+18);
const satoshisToBtc = (satoshis) => round(satoshis / 1e+8);

(async () => {
    let runner = main('http://localhost:4444');
    console.log('R-BTC in circulation            ', weisToRbtc(Number(await runner.getRbtcInCirculation())), 'R-BTC');
    console.log('Locking cap                    ', satoshisToBtc(Number(await runner.getLockingCap())), 'satoshis');
    console.log('Current availability for peg-in', satoshisToBtc(Number(await runner.getPeginAvailability())), 'satoshis');
})();
