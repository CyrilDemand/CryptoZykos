import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';

// 1️⃣ Définition des chaînes compatibles
const { chains, publicClient } = configureChains(
    [mainnet, polygon, optimism, arbitrum],
    [publicProvider()]
);

// 2️⃣ Configuration des connecteurs (MetaMask, WalletConnect, etc.)
const { connectors } = getDefaultWallets({
    appName: 'MonApp Web3',
    projectId: 'c410db7e33f19bae8a4fa9855b1c6f49S', // Remplace par ton projectId WalletConnect
    chains
});

// 3️⃣ Création de la configuration Wagmi
export const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient
});

export { chains };
