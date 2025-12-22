import { test, expect } from "bun:test";

import { LiteSVM } from "litesvm";
import {
	PublicKey,
	Transaction,
	SystemProgram,
	Keypair,
	LAMPORTS_PER_SOL,
    TransactionInstruction,
} from "@solana/web3.js";

test("cpi test", () => {
	const svm = new LiteSVM();
    const doubleContractPubkey = PublicKey.unique();
    const contractPubkey = PublicKey.unique();
    svm.addProgramFromFile(contractPubkey, "./target/build/cpi1.so");
    svm.addProgramFromFile(doubleContractPubkey, "./target/build/double.so");
	const userAcc = new Keypair();
	svm.airdrop(userAcc.publicKey, BigInt(LAMPORTS_PER_SOL));
	
    
    const dataAccount = new Keypair();
	const blockhash = svm.latestBlockhash();
	const ixs = [
		SystemProgram.createAccount({
			fromPubkey: userAcc.publicKey,
			newAccountPubkey: dataAccount.publicKey,
			lamports: Number(svm.minimumBalanceForRentExemption(BigInt(4))),
            space: 4,
            programId: doubleContractPubkey,
		}),
	];
	const tx = new Transaction();
	tx.recentBlockhash = blockhash;
    tx.feePayer = userAcc.publicKey;
	tx.add(...ixs);
	tx.sign(userAcc,dataAccount);
	svm.sendTransaction(tx);

	

    let ix2 = new TransactionInstruction({
        keys: [
            {pubkey: dataAccount.publicKey, isSigner: true, isWritable: true},
            {pubkey: doubleContractPubkey, isSigner: false, isWritable: false},
        ],
        programId: contractPubkey,
        data: Buffer.from([42,0,0,0]),
    });
    const blockhash2 = svm.latestBlockhash();
    let tx2 = new Transaction();
    tx2.recentBlockhash = blockhash2;
    tx2.feePayer = userAcc.publicKey;
    tx2.add(ix2);
    tx2.sign(userAcc,dataAccount);
    const txRes = svm.sendTransaction(tx2);

   
    const updatedAccountInfo = svm.getAccount(dataAccount.publicKey)
   
    expect(updatedAccountInfo?.data[0]).toBe(1);
    expect(updatedAccountInfo?.data[1]).toBe(0);
    expect(updatedAccountInfo?.data[2]).toBe(0);
    expect(updatedAccountInfo?.data[3]).toBe(0);

    
});