const crypto = require('crypto');

function findHashWithLeadingZeros(input,targetPrefix) {
    let nonce = 0;
    while (true) {
        const data = input + nonce.toString();
        const hash = crypto.createHash('sha256').update(data).digest('hex');
        if (hash.startsWith(targetPrefix)) {
            return { nonce, hash };
        }
        nonce++;
    }
}

const targetPrefix = '00000';
const input = `harkirat => Raman | Rs 100
Ram => Ankit | Rs 10`;
const result = findHashWithLeadingZeros(input,targetPrefix);
console.log(`Nonce: ${result.nonce}`);
console.log(`Hash: ${result.hash}`);