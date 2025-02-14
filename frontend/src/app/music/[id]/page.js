"use client"; // Cette ligne indique que le composant s'exécute côté client.

import { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Importation de useRouter
import { useReadContract } from "wagmi";
import { sepolia } from "viem/chains";
import { abi } from "@/app/abi";
import contractInfo from "@/app/contractInfo";

export default function Page({ params }) {
 
    const [music, setMusic] = useState(null);

    const contractAddress = contractInfo.contractAddress;

    const { data: musicData } = useReadContract({
        abi,
        address: contractAddress,
        functionName: "getMusic",
        args: [params.id], // Utiliser l'ID récupéré pour l'appel du contrat
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
        </div>
    );
}
