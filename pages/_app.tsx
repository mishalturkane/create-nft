import React from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { UmiProvider } from './context/UmiProvider';
import { CreateMonadNFT } from './components/createNFT';
import '@solana/wallet-adapter-react-ui/styles.css';

const endpoint = "https://api.devnet.solana.com"; // or mainnet-beta

function App() {
  const wallets = [new PhantomWalletAdapter()];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <UmiProvider endpoint={endpoint}>
            <div className="App">
              <CreateMonadNFT />
            </div>
          </UmiProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;