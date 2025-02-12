"use client";

import { useEffect, useState } from 'react';
import { useBlockNumber, useReadContract, useWriteContract } from "wagmi";
import { sepolia } from "viem/chains";
import { abi } from './abi';
import { useAccount } from 'wagmi';
import contractInfo from './contractInfo.json';


export default function Home() {
    const contractAddress = contractInfo.contractAddress;

    const { data: numberOfMusic } = useReadContract({
        abi,
        address: contractAddress,
        functionName: 'retrieve',
        functionName: 'getMusicCount',
        chainId: sepolia.id,
    });

    const { data: blockNumber } = useBlockNumber({
        chainId: sepolia.id,
        watch: true,
    });

    const { data: storedValue } = useReadContract({
        abi,
        address: contractAddress,
        functionName: 'getMusicCount',
        chainId: sepolia.id,
    });

    const { address, isConnected } = useAccount();
    const [newValue, setNewValue] = useState("");
    const { writeContract } = useWriteContract();


    const [file, setFile] = useState(null);
    const [ipfsUrl, setIpfsUrl] = useState("");

    const handleUpload = async () => {
        if (!file) return;
        const url = await uploadToIPFS(file);
        setIpfsUrl(url);
    };

    async function addRandomMusic() {
        try {
            await writeContract({
                abi,
                address: contractAddress,
                functionName: "store",
                args: [parseInt(newValue)],
                functionName: "addMusic",
                args: [
                    "123",
                    "lalala",
                    1,
                ],
                chainId: sepolia.id,
            });

            console.log("✅ Musique ajoutée automatiquement !");
            await refetch(); // 🔄 Rafraîchir les données après ajout
        } catch (error) {
            console.error("❌ Erreur lors de l'ajout de la musique :", error);
        }
    }


    return (
        <>
            {/* Bannière (directement sous la navbar) */}
            <div className="relative w-screen min-w-[600px] h-48 bg-gradient-to-r from-pink-500 to-yellow-400 flex justify-center items-center text-white font-extrabold text-4xl shadow-md mt-[52px]">
                CryptoZykos
                {/* Icônes musicales ajustées */}
                <div className="absolute left-1/4 top-[15px] text-yellow-300 text-5xl mix-blend-overlay ">🎵</div>
                <div className="absolute right-1/4 top-[15px] text-yellow-300 text-5xl mix-blend-overlay">🎵</div>
                <div className="absolute left-[30%] bottom-1 text-pink-600 text-5xl mix-blend-overlay">🎵</div>
                <div className="absolute right-[30%] bottom-1 text-pink-600 text-5xl mix-blend-overlay">🎵</div>
            </div>

            {/* Section Musiques */}
            <div className="bg-black text-white min-h-screen p-8">
                <h2 className="text-2xl font-bold mb-4">Musiques</h2>
                <div className="grid gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg flex items-center">
                        <div className="w-16 h-16 bg-gray-600 rounded-lg"></div>
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold">Titre</h3>
                            <p className="text-sm text-gray-400">Description à compléter.</p>
                        </div>
                        <div className="ml-auto text-sm bg-gray-700 px-3 py-1 rounded">0.001 ETH</div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex items-center">
                        <div className="w-16 h-16 bg-gray-600 rounded-lg"></div>
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold">Titre</h3>
                            <p className="text-sm text-gray-400">Description à compléter.</p>
                        </div>
                        <div className="ml-auto text-sm bg-gray-700 px-3 py-1 rounded">0.025 ETH</div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex items-center">
                        <div className="w-16 h-16 bg-gray-600 rounded-lg"></div>
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold">Titre</h3>
                            <p className="text-sm text-gray-400">Description à compléter.</p>
                        </div>
                        <div className="ml-auto text-sm bg-gray-700 px-3 py-1 rounded">2 ETH</div>
                    </div>
                </div>
            </div>
            
            {/* Contenu principal */}
            <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-100 to-gray-200 px-12">
                <div>
                    <p>BlockNumber on Sepolia: {blockNumber && blockNumber.toString()}</p>
                    <p>🎵 Nombre de musiques: {numberOfMusic !== undefined ? numberOfMusic.toString() : "Chargement..."}</p>
                    <button onClick={addRandomMusic}>Store Value</button>
                    {isConnected ? (
                        <>
                            <p>Connected with {address}</p>
                            <input
                                type="number"
                                placeholder="Enter a value"
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
                            />
                            
                        </>
                    ) : (
                        <p>Please connect your Wallet.</p>
                    )}
                    <div>
                        <h2>Uploader un fichier sur IPFS avec Pinata</h2>
                        <input type="file" onChange={(e) => setFile(e.target.files[0])}/>
                        <button onClick={handleUpload}>Uploader</button>

                        {ipfsUrl && <p>✅ Fichier disponible sur <a href={ipfsUrl} target="_blank">{ipfsUrl}</a></p>}
                    </div>
                </div>

            </div>
            
        </>
        
    );
    
    
}
