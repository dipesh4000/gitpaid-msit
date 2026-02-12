const cdp = require('@coinbase/cdp-sdk');
try {
    console.log('Keys:', Object.keys(cdp));
    console.log('Coinbase exists:', !!cdp.Coinbase);
    if (cdp.Coinbase) {
        console.log('Coinbase keys:', Object.keys(cdp.Coinbase));
    }
} catch (e) {
    console.error(e);
}
