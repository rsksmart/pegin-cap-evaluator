const expect = require('chai').expect;
const peginCapEvaluator = require('../src/pegin-cap-evaluator');

const web3Mock = {
    eth: {
        getBalance: () => Promise.resolve(0)
    }
};

const bridgeMock = {
    build: () => ({
        methods: ({
            getLockingCap: () => ({
                call: () => Promise.resolve(peginCapEvaluator.getRbtcStock())
            })
        })
    })
};

let peginCapEvaluatorInstance = peginCapEvaluator.config(web3Mock, bridgeMock);

describe('Test pegin-cap-evaluator', () => {
    it('gets current peg in availability', async () => {
        expect(await peginCapEvaluatorInstance.getPeginAvailability()).to.be.eq(0);
    });
});
