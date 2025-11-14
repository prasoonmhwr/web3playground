import { useState } from 'react'
import { generateMnemonic } from "bip39";
import './App.css'
import { SolanaWallet } from './SolanaWallet';

function App() {
  const [mnemonic, setMnemonic] = useState(null as string | null);

  return (
    <>
      <div>
        <h1 className='text-3xl mb-4' >Web Based Wallet</h1>
        {!mnemonic && <button onClick={async () => {
          const newMnemonic = generateMnemonic();
          setMnemonic(newMnemonic);
        }}>
          Create Seed Phrase
        </button>}
      </div>
      <div className="card grid grid-cols-3 gap-4">
        {mnemonic && mnemonic.split(" ").map((word, index) => (
          <h3 className='p-2' key={index} >{word}</h3>
        ))}
        
      </div>
      {mnemonic && <SolanaWallet mnemonic={mnemonic} />}
    </>
  )
}

export default App
