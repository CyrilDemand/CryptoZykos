"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useReadContract,  useWriteContract, useAccount} from "wagmi";
import { sepolia } from "viem/chains";
import { abi } from "@/app/abi";
import contractInfo from "@/app/contractInfo";

export default function Page({ params }) {
    const { address } = useAccount(); 
    const [music, setMusic] = useState(null);
    const [hasPurchased, setHasPurchased] = useState(false);

    const contractAddress = contractInfo.contractAddress;
    const unwrappedParams = React.use(params);
    const { writeContract } = useWriteContract();


    const { data: musicData } = useReadContract({
        abi,
        address: contractAddress,
        functionName: "getMusic",
        args: [unwrappedParams.id],
        chainId: sepolia.id,
    });

    useEffect(() => {
        if (musicData) {
            setMusic({
                id: musicData[0],
                creator: musicData[1],
                name: musicData[2],
                imageUrl: musicData[3],
                audioUrl: musicData[4],
                price: musicData[5],
            });
        }
    }, [musicData]);

    useEffect(() => {
        const checkPurchaseStatus = async () => {
            if (music) {
                const { data: purchaseStatus } = await useReadContract({
                    abi,
                    address: contractAddress,
                    functionName: "hasLicense",
                    args: [music.id, address], // Assurez-vous d'importer `address` depuis `useAccount`
                    chainId: sepolia.id,
                });
                setHasPurchased(purchaseStatus);
            }
        };
        checkPurchaseStatus();
    }, [music]);

    const handlePurchase = async () => {
        if (hasPurchased) {
            alert("Vous avez déjà acheté ce son.");
            return;
        }
        try {
            await writeContract({
                abi,
                address: contractAddress,
                functionName: "purchaseLicense",
                args: [music.id],
                value: music.price,
                chainId: sepolia.id,
            });
            alert("Achat réussi !");
        } catch (error) {
            console.error("Erreur lors de l'achat :", error);
            alert("Erreur lors de l'achat. Veuillez réessayer.");
        }
    };


    if (!music) return <div>Chargement...</div>;

    return (
        <div className="relative w-screen h-screen bg-black text-white flex flex-col justify-center items-center">
            {music.imageUrl && (
                <img src={music.imageUrl} className="absolute top-0 left-0 w-full h-full object-cover opacity-30" />
            )}
            <h2 className="text-4xl font-bold mb-4">{music.name}</h2>
            <p className="text-lg font-thin text-gray-400 mb-8">{music.creator}</p>
            <audio controls className="w-full max-w-4xl">
                <source src={music.audioUrl} type="audio/mp3" />
                Votre navigateur ne prend pas en charge le lecteur audio.
            </audio>
            <div className="mt-8 text-lg bg-gray-700 px-4 py-2 rounded">{music.price} ETH</div>

            <button
                onClick={handlePurchase}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer z-10"
            >
                Acheter
            </button>
        </div>
    );
}
