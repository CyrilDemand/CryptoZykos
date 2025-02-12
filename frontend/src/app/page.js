"use client";

import { useEffect, useState, useRef } from "react";
import { useBlockNumber, useReadContract, useWriteContract } from "wagmi";
import { sepolia } from "viem/chains";
import { abi } from "./abi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import contractInfo from "./contractInfo.json";

export default function Home() {
    const contractAddress = contractInfo.contractAddress; // 🛑 Remplace par la vraie adresse

    const { data: blockNumber } = useBlockNumber({
        chainId: sepolia.id,
        watch: true,
    });

    // 🔹 Lire la valeur stockée dans le contrat
    const { data: numberOfMusic } = useReadContract({
        abi,
        address: contractAddress,
        functionName: 'getMusicCount',
        chainId: sepolia.id,
    });

    const { address, isConnected } = useAccount();

    // 🔹 Gérer l'entrée utilisateur pour modifier la valeur
    const [newValue, setNewValue] = useState("");

    // 🔹 Modifier la valeur stockée dans le contrat
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
        <div>
            <p>BlockNumber on Sepolia: {blockNumber && blockNumber.toString()}</p>
            <p>🎵 Nombre de musiques: {numberOfMusic !== undefined ? numberOfMusic.toString() : "Chargement..."}</p>
            {isConnected ? (
                <>
                    <p>Connected with {address}</p>
                    <input
                        type="number"
                        placeholder="Enter a value"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                    />
                    <button onClick={addRandomMusic}>Store Value</button>
                </>
            ) : (
                <p>Please connect your Wallet.</p>
            )}

            <ConnectButton/>
            <div>
                <h2>Uploader un fichier sur IPFS avec Pinata</h2>
                <input type="file" onChange={(e) => setFile(e.target.files[0])}/>
                <button onClick={handleUpload}>Uploader</button>

                {ipfsUrl && <p>✅ Fichier disponible sur <a href={ipfsUrl} target="_blank">{ipfsUrl}</a></p>}
            </div>
        </div>
    );
}
