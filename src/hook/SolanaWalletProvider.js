import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { WalletConnectWalletAdapter } from '@solana/wallet-adapter-walletconnect';

// Import styles
import '@solana/wallet-adapter-react-ui/styles.css';

export const SolanaWalletProvider = ({ children }) => {
  // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new WalletConnectWalletAdapter({
        network,
        options: {
          relayUrl: 'wss://relay.walletconnect.com',
          // You need to get a project ID from https://cloud.walletconnect.com/
          projectId: 'YOUR_PROJECT_ID',
          metadata: {
            name: 'My Solana App',
            description: 'My Solana app using WalletConnect',
            url: 'https://your-app-url.com',
            icons: ['https://your-app-url.com/icon.png']
          }
        }
      }),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletMultiButton />
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};