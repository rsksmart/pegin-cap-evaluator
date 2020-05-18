# pegin-cap-evaluator

This npm tool indicates what's the current availability to peg-in into the RSK network.
To do so it will fetch the current locking cap and, given the existing RBTC in circulation, will indicate how many BTC can be sent at most to the RSK Federation.

## Requirements

run `npm install`.

## Usage

This tool requires indicating the host to connect to before using it.
```
const host = 'http://localhost:4444';
const peginCapEvaluator = require('pegin-cap-evaluator')(host);

peginCapEvaluator.getPeginAvailability().then(console.log);
```

## Methods

As mentioned above, first the tool needs to be configured passing the host url to connect to. Then it provides the following methods.

### getRbtcInCirculation

Returns the amount of RBTC (in weis) in circulation at this moment. This reflects to the amount of BTC locked in the RSK Federation address.

### getLockingCap

Returns the currently configured locking cap. This value is represented in satoshis.
The Bridge will reject any peg-in that takes the RSK Federation wallet balance beyond this threshold.

### getPeginAvailability

Returns the current availability to peg-in. This value is represented in satoshis.
Any user wanting to peg-in should check that the amount never surpasses this value.
This value *doesn't guarantee* the peg-in won't be rejected.