const { Connection, Keypair, VersionedTransaction } = require('@solana/web3.js');
const axios = require('axios');
const { Wallet } = require('@project-serum/anchor');
const bs58 = require('bs58');

const connection = new Connection('https://api.mainnet-beta.solana.com');

const wallet = new Wallet(Keypair.fromSecretKey(bs58.decode(process.env.PRIVATE_KEY)));

async function main(){
    const response = await (
        await axios.get('https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=100000000&slippageBps=50')
    );
    const quoteResponse = response.data;
    console.log('Quote Response:', quoteResponse);

    try{
        const {data: {swapTrnascation}} = await (
            await axios.post('https://quote-api-jup.ag/v6/swap',{
                quoteResponse,
                userPublicKey: wallet.publicKey.toString(),
            })
        );

        console.log('Swap Transaction:', swapTrnascation);

        const swapTransactionBuf = Buffer.from(swapTransaction,'base64');
        const swapTransaction = VersionedTransaction.deserialize(swapTransactionBuf);
        swapTransaction.sign([wallet.payer]);

        const latestBlockHash = await connection.getLatestBlockhash();

        const rawTransaction = swapTransaction.serialize();
        const txid = await connection.sendRawTransaction(rawTransaction, {
            skipPreflight: true,
            preflightCommitment: 'confirmed',
        });
        
        console.log('Transaction ID:', txid);

        await connection.confirmTransaction({
            signature: txid,
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        });
        console.log('Swap transaction confirmed');
    } catch (error){
        console.error('Error during swap:', error.response ? error.response.data : error.message);  
    }
}