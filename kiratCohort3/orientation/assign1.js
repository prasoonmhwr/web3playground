const crypto = require('crypto');

function findHashWithLeadingZeros(targetPrefix) {
    let nonce = 0;
    while (true) {
        const data = nonce.toString();
        const hash = crypto.createHash('sha256').update(data).digest('hex');
        if (hash.startsWith(targetPrefix)) {
            return { nonce, hash };
        }
        nonce++;
    }
}

const targetPrefix = '00000';
const result = findHashWithLeadingZeros(targetPrefix);
console.log(`Nonce: ${result.nonce}`);
console.log(`Hash: ${result.hash}`);