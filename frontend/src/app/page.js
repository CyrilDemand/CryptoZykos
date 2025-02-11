'use client';

import { useState } from 'react';
import { useBlockNumber, useReadContract, useWriteContract } from "wagmi";
import { sepolia } from "viem/chains";
import { abi } from './abi';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from 'wagmi';
import contractInfo from './contractInfo.json';

export default function Home() {
    const contractAddress = contractInfo.contractAddress;

    const { data: blockNumber } = useBlockNumber({
        chainId: sepolia.id,
        watch: true,
    });

    const { data: storedValue } = useReadContract({
        abi,
        address: contractAddress,
        functionName: 'retrieve',
        chainId: sepolia.id,
    });

    const { address, isConnected } = useAccount();
    const [newValue, setNewValue] = useState("");
    const { writeContract } = useWriteContract();

    const handleStoreValue = async () => {
        if (!newValue) return;
        try {
            await writeContract({
                abi,
                address: contractAddress,
                functionName: "store",
                args: [parseInt(newValue)],
                chainId: sepolia.id,
            });
            console.log("✅ Transaction envoyée !");
        } catch (error) {
            console.error("Erreur lors de l'envoi :", error);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-100 to-gray-200 p-6">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center space-y-6">
                <h1 className="text-3xl font-extrabold text-indigo-700">Blockchain Info</h1>

                <div>
                    <p className="text-gray-600 font-medium">Block Number on Sepolia:</p>
                    <p className="font-mono text-lg text-gray-800">{blockNumber && blockNumber.toString()}</p>
                </div>

                <div>
                    <p className="text-gray-600 font-medium">Stored Value:</p>
                    <p className="font-mono text-lg text-gray-800">{storedValue ? storedValue.toString() : "Loading..."}</p>
                </div>

                {isConnected ? (
                    <>
                        <p className="text-green-600 font-semibold">Connected with {address}</p>
                        <div className="flex flex-col items-center space-y-4 mt-4">
                        <input
                            type="number"
                            placeholder="Enter a value"
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-400 rounded-md text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                        />

                            <button 
                                onClick={handleStoreValue} 
                                className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300"
                            >
                                Store Value
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="text-red-600 font-semibold">Please connect your Wallet.</p>
                )}

                <div className="flex justify-center">
                    <ConnectButton className="connect-button" />
                </div>
            </div>
        </div>
    );
}
