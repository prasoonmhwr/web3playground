import { useMemo, useState } from 'react'
import './App.css'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import {  WalletDisconnectButton, WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';
import { RequestAirdrop } from './AirDrop';
function App() {
const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
      <WalletModalProvider>
      <div className='container'>
        <WalletMultiButton />
        <WalletDisconnectButton />
      </div>
      <RequestAirdrop />
      </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default App
