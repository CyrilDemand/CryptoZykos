'use client';

import { useState } from 'react';
import { useBlockNumber, useReadContract, useWriteContract } from "wagmi";
import { sepolia } from "viem/chains"; // 🔹 Utilisation de Sepolia
import { abi } from './abi'; // 🔹 Assure-toi d'avoir ton ABI ici
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from 'wagmi';
import contractInfo from './contractInfo.json'; // 🔹 Importer l’adresse sauvegardée

export default function Home() {
    // Adresse de ton contrat sur Sepolia (À modifier avec la vraie adresse après déploiement)
    const contractAddress = contractInfo.contractAddress; // 🛑 Remplace par la vraie adresse

    const { data: blockNumber } = useBlockNumber({
        chainId: sepolia.id,
        watch: true,
    });

    // 🔹 Lire la valeur stockée dans le contrat
    const { data: storedValue } = useReadContract({
        abi,
        address: contractAddress,
        functionName: 'retrieve',
        chainId: sepolia.id,
    });

    const { address, isConnected } = useAccount();

    // 🔹 Gérer l'entrée utilisateur pour modifier la valeur
    const [newValue, setNewValue] = useState("");

    // 🔹 Modifier la valeur stockée dans le contrat
    const { writeContract } = useWriteContract();

    const handleStoreValue = async () => {
        if (!newValue) return;
        try {
            await writeContract({
                abi,
                address: contractAddress,
                functionName: "store",
                args: [parseInt(newValue)], // Convertir en int
                chainId: sepolia.id,
            });
            console.log("✅ Transaction envoyée !");
        } catch (error) {
            console.error("Erreur lors de l'envoi :", error);
        }
    };

    return (
        <div>
            <p>BlockNumber on Sepolia: {blockNumber && blockNumber.toString()}</p>
            <p>Stored Value: {storedValue ? storedValue.toString() : "Loading..."}</p>

            {isConnected ? (
                <>
                    <p>Connected with {address}</p>
                    <input
                        type="number"
                        placeholder="Enter a value"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                    />
                    <button onClick={handleStoreValue}>Store Value</button>
                </>
            ) : (
                <p>Please connect your Wallet.</p>
            )}

            <ConnectButton />
        </div>
    );
}
