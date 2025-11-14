import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl"
import { useState } from "react";

export function SolanaWallet({mnemonic}: {mnemonic: string}) {
    const [currentIndex,setCurrentIndex] = useState(0);
    const [publicKeys,setPublicKeys] = useState<any>([]);

    return (
        <div>
            <button onClick={async function() {
                const seed = await mnemonicToSeed(mnemonic);
                const derivationPath = `m/44'/501'/${currentIndex}'/0'`;
                const derivedSeed = derivePath(derivationPath, seed.toString("hex")).key;
                const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey
                const keypair = Keypair.fromSecretKey(secret);
                setPublicKeys([...publicKeys, keypair.publicKey]);
                setCurrentIndex(currentIndex + 1);
            }} >Add Solana Wallet</button>
            {publicKeys.map((p:any,index:number) => 
            <div key={index} className="" style={{"marginTop": "20px", "border": "1px solid #626060ff","borderRadius":"5px", "padding":"0 20px 20px 20px","textAlign":"left"}} >
                <h2>Wallet {index}</h2>
                Public Key: {p.toBase58()}
            </div>
    )}
        </div>
    )
}