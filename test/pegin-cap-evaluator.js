const expect = require('chai').expect;
const peginCapEvaluator = require('../src/pegin-cap-evaluator');

const MILLION = 1000000;

const getWeb3Mock = (bridgeBalanceValue) => {
    return {
        eth: {
            getBalance: () => Promise.resolve(bridgeBalanceValue)
        },
        utils: {
            toWei: (value) => value * 1e18,
            toBN: (value) => value
        }
    };
};

const getBridgeMock = (lockingCapValue) => {
    return {
        build: () => ({
            methods: ({
                getLockingCap: () => ({
                    call: () => Promise.resolve(lockingCapValue)
                })
            })
        })
    };
};

const btcToSatoshis = (btc) => btc * 1e+8;
const rbtcToWeis = (rbtc) => rbtc * 1e+18;

const assertGetPeginAvailability = async (bridgeBalanceValue, lockingCapValue, expected) => {
    lockingCapValue = lockingCapValue != undefined ? lockingCapValue : peginCapEvaluator.getRbtcStock();
    let peginCapEvaluatorInstance = peginCapEvaluator.config(
        getWeb3Mock(rbtcToWeis(bridgeBalanceValue)),
        getBridgeMock(btcToSatoshis(lockingCapValue))
    );
    let result = await peginCapEvaluatorInstance.getPeginAvailability();
    expect(result).to.be.eq(expected);
};

describe('Test pegin-cap-evaluator', () => {
    it('all funds in circulation', async () => {
        await assertGetPeginAvailability(0, peginCapEvaluator.getRbtcStock(), 0);
    });
    it('some funds in circulation', async () => {
        await assertGetPeginAvailability(MILLION * 20, MILLION + 1, btcToSatoshis(1));
        await assertGetPeginAvailability(MILLION * 20, MILLION, 0);
        await assertGetPeginAvailability(MILLION * 20, peginCapEvaluator.getRbtcStock(), btcToSatoshis(peginCapEvaluator.getRbtcStock() - MILLION));
    });
    it('no funds in circulation', async () => {
        await assertGetPeginAvailability(peginCapEvaluator.getRbtcStock(), 10, btcToSatoshis(10));
        await assertGetPeginAvailability(peginCapEvaluator.getRbtcStock(), MILLION, btcToSatoshis(MILLION));
        await assertGetPeginAvailability(peginCapEvaluator.getRbtcStock(), peginCapEvaluator.getRbtcStock(), btcToSatoshis(peginCapEvaluator.getRbtcStock()));
    });
    it('no locking cap', async () => {
        await assertGetPeginAvailability(0, 0, 0);
        await assertGetPeginAvailability(MILLION * 20, 0, 0);
        await assertGetPeginAvailability(peginCapEvaluator.getRbtcStock(), 0, 0);
    });
});
