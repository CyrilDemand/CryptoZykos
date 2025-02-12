'use client';

import { useEffect, useState } from 'react';
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
        <>
            {/* Bannière (directement sous la navbar) */}
            <div className="relative w-screen min-w-[600px] h-48 bg-gradient-to-r from-pink-500 to-yellow-400 flex justify-center items-center text-white font-extrabold text-4xl shadow-md mt-[52px]">
                CryptoZykos
                {/* Icônes musicales ajustées */}
                <div className="absolute left-1/4 top-[10px] text-yellow-300 text-5xl mix-blend-overlay ">🎵</div>
                <div className="absolute right-1/4 top-[10px] text-yellow-300 text-5xl mix-blend-overlay">🎵</div>
                <div className="absolute left-[30%] bottom-1 text-pink-600 text-5xl mix-blend-overlay">🎵</div>
                <div className="absolute right-[30%] bottom-1 text-pink-600 text-5xl mix-blend-overlay">🎵</div>
            </div>
    
            {/* Contenu principal */}
            <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-100 to-gray-200 px-12">
                <div className="w-full text-center space-y-6 mt-12">
                    <h1 className="text-4xl font-extrabold text-indigo-700">Blockchain Info</h1>
    
                    <div>
                        <p className="text-gray-600 font-medium">Block Number on Sepolia:</p>
                        <p className="font-mono text-xl text-gray-800">{blockNumber && blockNumber.toString()}</p>
                    </div>
    
                    <div>
                        <p className="text-gray-600 font-medium">Stored Value:</p>
                        <p className="font-mono text-xl text-gray-800">{storedValue ? storedValue.toString() : "Loading..."}</p>
                    </div>
    
                    {isConnected ? (
                        <>
                            <p className="text-green-600 font-semibold text-lg">Connected with</p>
                            <p className="text-green-500 font-mono text-lg">{address}</p>
    
                            {/* Formulaire d'entrée */}
                            <div className="flex flex-col items-center space-y-4 mt-6">
                                <input
                                    type="number"
                                    placeholder="Enter a value"
                                    value={newValue}
                                    onChange={(e) => setNewValue(e.target.value)}
                                    className="w-96 px-4 py-2 border border-gray-400 rounded-md text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                />
                                <button 
                                    onClick={handleStoreValue} 
                                    className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-600 transition-all duration-300"
                                >
                                    Store Value
                                </button>
                            </div>
                        </>
                    ) : (
                        <p className="text-red-600 font-semibold text-lg">Please connect your Wallet.</p>
                    )}
                </div>
            </div>
        </>
    );
    
    
}
