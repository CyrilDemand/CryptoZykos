"use client";

import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { accountStorageABI } from '../accountAbi';
import { useReadContract, useWriteContract } from "wagmi";
import contractInfo from '../contractInfo.json';

export default function Account({ paralms }) {
    const { address } = useAccount();
    const router = useRouter();
    const [name, setName] = useState(""); // État pour le nom
    const [description, setDescription] = useState(""); // État pour la description
    
    const contractAddress = contractInfo.contractAddress;
    const { writeContract } = useWriteContract();

    const { data:fetchedProfile } = useReadContract({
        abi: accountStorageABI,
        address: contractAddress,
        functionName: 'getProfile',
        args: [address], 
    });

    useEffect(() => {
        if (!address) {
            router.push('/'); // Redirige vers l'accueil si pas de compte
        } else {
            console.log(fetchedProfile);
            if (fetchedProfile == undefined){
                writeContract({
                    abi: accountStorageABI,
                    address: contractAddress,
                    functionName: "createProfile",
                    args: ["Name","Description","https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"],
                });
            }
            
        }
    }, [address, router]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await writeContract({
                abi: accountStorageABI,
                address: contractAddress,
                functionName: "setName",
                args: [name],
            });
            await writeContract({
                abi: accountStorageABI,
                address: contractAddress,
                functionName: "setDescription",
                args: [description],
            });
        } catch (error) {
            console.error("Error updating information:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
            <h1 className="text-3xl text-purple-600 font-bold mb-6 drop-shadow-md">Mon Compte</h1>
            <form onSubmit={handleSubmit} className="shadow-md rounded-lg p-8 w-full max-w-md bg-gray-700">
                
            <ConnectButton.Custom>
                        {({
                            account,
                            chain,
                            openAccountModal,
                            openChainModal,
                            mounted
                        }) => {
                            return (
                                <div
                                    {...(!mounted && {
                                        "aria-hidden": true,
                                        style: {
                                            opacity: 0,
                                            pointerEvents: "none",
                                            userSelect: "none",
                                        },
                                    })}
                                    className="flex space-x-2 justify-between"
                                >
                                    {account && chain ? (
                                        <>
                                            <button
                                                onClick={openChainModal}
                                                className="px-4 py-2 bg-white text-black rounded-lg shadow-md hover:bg-gray-200 transition-all duration-300 flex items-center"
                                            >
                                                🟢 {chain.name}
                                            </button>
                                            <button
                                                onClick={openAccountModal}
                                                className="px-4 py-2 bg-white text-black rounded-lg shadow-md hover:bg-gray-200 transition-all duration-300 flex items-center space-x-2"
                                            >
                                                <span>{account.displayBalance ? account.displayBalance : "0 ETH"}</span>
                                                <span className="text-red-500">🔴</span>
                                                <span>{account.displayName}</span>
                                            </button>
                                        </>
                                    ) : null}
                                </div>
                            );
                        }}
                    </ConnectButton.Custom>
                
                
                
                <label className="block font-semibold mb-1 mt-6">
                    <span className="text-gray-300">Nom:</span>
                    <input 
                        type="text" 
                        name="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                        className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-purple-500"
                    />
                </label>
                <label className="block font-semibold mb-1">
                    <span className="text-gray-300">Description:</span>
                    <textarea 
                        name="description" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        required 
                        className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-purple-500"
                    />
                </label>
                <button type="submit" className="w-full bg-purple-600 text-white font-bold py-2 rounded-md hover:bg-purple-700 transition duration-200">Modifier</button>
            </form>
        </div>
    );
}