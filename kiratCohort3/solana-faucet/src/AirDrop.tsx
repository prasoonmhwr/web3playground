import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export function RequestAirdrop() {
    const wallet = useWallet();
    const { connection } = useConnection();

    async function requestAirdrop() {
        let amount = document.getElementById("amount")!.value;
        console.log("Requesting airdrop of " + amount + " SOL to " + wallet.publicKey!.toBase58());
        await connection.requestAirdrop(wallet.publicKey!, 1000000000);
        alert("Airdropped " + amount + " SOL to " + wallet.publicKey!.toBase58());
    }

    return <div>
        <br/><br/>
        <input id="amount" type="text" placeholder="Amount" />
        <button onClick={requestAirdrop}>Request Airdrop</button>
    </div>
}