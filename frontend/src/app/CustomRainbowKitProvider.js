// app/CustomRainbowKitProvider.tsx
'use client'
import '@rainbow-me/rainbowkit/styles.css';
import {
    getDefaultConfig,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
    QueryClientProvider,
    QueryClient,
} from "@tanstack/react-query";

import { mainnet, sepolia } from 'wagmi/chains';

const config = getDefaultConfig({
    appName: 'My RainbowKit App',
    projectId: 'c410db7e33f19bae8a4fa9855b1c6f49',
    chains: [mainnet, sepolia],  // ✅ Ajout de mainnet ici
    ssr: true,
});


const queryClient = new QueryClient();
const CustomRainbowKitProvider = ({ children }) => {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}
export default CustomRainbowKitProvider