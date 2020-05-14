const TOTAL_RBTC_STOCK = 21000000;

const getRbtcInCirculation = (web3Instance, bridgeLib) => () => {
    return web3Instance.eth.getBalance(bridgeLib.address)
        .then((balance) => TOTAL_RBTC_STOCK - balance);
};

const getLockingCap = (web3Instance, bridgeLib) => () => {
    let bridgeInstance = bridgeLib.build(web3Instance);
    return bridgeInstance.methods.getLockingCap().call()
};

const getPeginAvailability = (web3Instance, bridgeLib) => () => {
    let lockingCapPromise = getLockingCap(web3Instance, bridgeLib)();
    let rbtcInCirculationPromise = getRbtcInCirculation(web3Instance, bridgeLib)();
    
    return Promise.all([lockingCapPromise, rbtcInCirculationPromise])
        .then((results) => {
            let lockingCap = results[0];
            let rbtcInCirculation = results[1];
        
            let availability = lockingCap - rbtcInCirculation;
        
            return availability;
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
