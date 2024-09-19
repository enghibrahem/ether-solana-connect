import React, { useState, useEffect } from 'react';
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";

const WalletConnectComponent = () => {
  const [address, setAddress] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const initializeProvider = async () => {
      // Check if Ethereum provider (like MetaMask) is available
      if (typeof window.ethereum !== 'undefined') {
        try {
          // Request account access
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
        } catch (error) {
          console.error("User denied account access");
        }
      } else {
        console.log('No Ethereum browser extension detected, using WalletConnect provider');
        const walletConnectProvider = new WalletConnectProvider({
          infuraId: "YOUR_INFURA_PROJECT_ID", // Replace with your Infura Project ID
        });
        setProvider(walletConnectProvider);
      }
    };

    initializeProvider();
  }, []);

  const connectWallet = async () => {
    if (web3) {
      try {
        const accounts = await web3.eth.getAccounts();
        setAddress(accounts[0]);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    } else if (provider) {
      try {
        await provider.enable();
        const web3Instance = new Web3(provider);
        setWeb3(web3Instance);
        const accounts = await web3Instance.eth.getAccounts();
        setAddress(accounts[0]);
      } catch (error) {
        console.error("Error connecting with WalletConnect:", error);
      }
    }
  };

  const disconnectWallet = async () => {
    if (provider) {
      try {
        await provider.disconnect();
      } catch (error) {
        console.error("Error disconnecting WalletConnect:", error);
      }
    }
    setAddress(null);
    setWeb3(null);
  };

  return (
    <div>
      {!address ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected Ethereum Address: {address}</p>
          <button onClick={disconnectWallet}>Disconnect Wallet</button>
        </div>
      )}
    </div>
  );
};

export default WalletConnectComponent