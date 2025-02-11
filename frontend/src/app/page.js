'use client';

import {useBlockNumber, useReadContract} from "wagmi";
import { mainnet } from "viem/chains";
import { abi } from './abi';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from 'wagmi'
export default function Home() {
  const { data: blockNumber } = useBlockNumber({
    chainId: mainnet.id,
    watch: true,
  });

  const { data: balance } = useReadContract({
    abi,
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    functionName: 'balanceOf',
    args: ['0x6B175474E89094C44Da98b954EedeAC495271d0F'],
    chainId: 1,
  });

  const { address, isConnected } = useAccount();

  return (
      <div>
        <p>BlockNumber on the mainnet: {blockNumber && blockNumber.toString()}</p>
        <p>BalanceOf on the mainnet: {balance && balance.toString()}</p>

        {isConnected ? (
            <p>Connected with {address}</p>
        ) : (
            <p>Please connect your Wallet.</p>
        )}
        <ConnectButton />
      </div>
  );
}
