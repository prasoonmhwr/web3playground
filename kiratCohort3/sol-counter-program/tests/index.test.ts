import {expect, test} from "bun:test";
import * as borsh from 'borsh';
import {Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction} from "@solana/web3.js";
import { COUNTER_SIZE, schema } from "./types";

import { CounterInstruction, CounterInstructionSchema, CounterInstructionType, createIncrementInstructionData, createDecrementInstructionData } from "./instruction";
let adminAccount = Keypair.generate();
let dataAccount = Keypair.generate();

const PROGRAM_ID = new PublicKey("Bkpk19xG9SNo4HK1zg3uhasJvJYhbvLAwJpbS4FEzUUg");
const connection = new Connection("http://localhost:8899", "confirmed");
test("Account initializes correctly", async () => {
  const tx = await connection.requestAirdrop(adminAccount.publicKey, 1 * LAMPORTS_PER_SOL);
  await connection.confirmTransaction(tx);
  const data = await connection.getAccountInfo(adminAccount.publicKey);
  const lamports = await connection.getMinimumBalanceForRentExemption(COUNTER_SIZE);

  const ix = SystemProgram.createAccount({
    fromPubkey: adminAccount.publicKey,
    newAccountPubkey: dataAccount.publicKey,
    lamports,
    space: COUNTER_SIZE,
    programId: PROGRAM_ID,
  });

  const tx2 = new Transaction();
    tx2.add(ix);
    const signature = await connection.sendTransaction(tx2, [adminAccount, dataAccount]);
    await connection.confirmTransaction(signature, "confirmed");
    console.log("Account created with address:", dataAccount.publicKey.toBase58());

    const dataAccountInfo = await connection.getAccountInfo(dataAccount.publicKey);
    const counter = borsh.deserialize(schema, dataAccountInfo?.data);
    console.log("Initial counter value:", counter?.count);
    expect(counter.count).toBe(0);
});

test("Account increments correctly", async () => {
     const dataAccountInfo = await connection.getAccountInfo(dataAccount.publicKey);
     const counter = borsh.deserialize(schema, dataAccountInfo?.data);
        counter.count += 10;
    //  const serializedData = createIncrementInstructionData(10);

     const tx = new Transaction().add({
         keys: [{pubkey: dataAccount.publicKey, isSigner: true, isWritable: true}],
         programId: PROGRAM_ID,
         data: Buffer.from([0, 10, 0, 0, 0]),
     });

     const signature = await connection.sendTransaction(tx, [adminAccount, dataAccount]);
     await connection.confirmTransaction(signature, "confirmed");

     const updatedAccountInfo = await connection.getAccountInfo(dataAccount.publicKey);
     const updatedCounter = borsh.deserialize(schema, updatedAccountInfo?.data);
     console.log("Updated counter value:", updatedCounter?.count);
     expect(updatedCounter.count).toBe(10);
});