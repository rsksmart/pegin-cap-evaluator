const TOTAL_RBTC_STOCK = 21000000;

/**
 * Gets the amount of Weis corresponding to RBTC in circulation through the RSK network
 * @param {Web3} web3Instance 
 * @param {Bridge} bridgeLib 
 */
const getRbtcInCirculation = (web3Instance, bridgeLib) => () => {
    return web3Instance.eth.getBalance(bridgeLib.address)
        .then((balance) => { 
            return web3Instance.utils.toWei(web3Instance.utils.toBN(TOTAL_RBTC_STOCK), 'ether') - balance;
        });
};

const convertWeisToSatoshis = (weis) => weis / 1e+10;

/**
 * Gets the existing locking cap in the configured RSK network
 * @param {Web3} web3Instance 
 * @param {Bridge} bridgeLib 
 */
const getLockingCap = (web3Instance, bridgeLib) => async () => {
    let bridgeInstance = bridgeLib.build(web3Instance);
    return bridgeInstance.methods.getLockingCap().call()
};

/**
 * Gets the maximum amount of Satoshis to send to the Federation for a peg-in operation
 * @param {Web3} web3Instance 
 * @param {Bridge} bridgeLib 
 */
const getPeginAvailability = (web3Instance, bridgeLib) => () => {
    let lockingCapPromise = getLockingCap(web3Instance, bridgeLib)();
    let rbtcInCirculationPromise = getRbtcInCirculation(web3Instance, bridgeLib)();
    
    return Promise.all([lockingCapPromise, rbtcInCirculationPromise])
        .then((results) => {
            let lockingCap = results[0];
            let rbtcInCirculation = results[1];
        
            let availability = lockingCap - convertWeisToSatoshis(rbtcInCirculation);
        
            return availability > 0 ? Math.round(availability) : 0;
        })
};

module.exports = {
    config: (web3Instance, bridgeLib) => ({
        getRbtcInCirculation: getRbtcInCirculation(web3Instance, bridgeLib),
        getLockingCap: getLockingCap(web3Instance, bridgeLib),
        getPeginAvailability: getPeginAvailability(web3Instance, bridgeLib),
    }),
    getRbtcStock: () => TOTAL_RBTC_STOCK
};
