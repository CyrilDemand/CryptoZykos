'use client';

import './globals.css';
import { WagmiProvider } from 'wagmi';
import { config } from './config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CustomRainbowKitProvider from "./CustomRainbowKitProvider";
const queryClient = new QueryClient();

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body>
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <CustomRainbowKitProvider>
                    {children}
                </CustomRainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
        </body>
        </html>
    );
}
