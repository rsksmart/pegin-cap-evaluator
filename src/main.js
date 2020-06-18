const peginCapEvaluator = require('./pegin-cap-evaluator');
const web3 = require('web3');
const { bridge } = require('@rsksmart/rsk-precompiled-abis');

module.exports = (host) => {
    let web3Instance = new web3(host);
    return peginCapEvaluator.config(web3Instance, bridge);
};
