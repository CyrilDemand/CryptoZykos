"use client";

import { useEffect, useState, useRef } from "react";
import { useReadContract } from "wagmi";
import { sepolia } from "viem/chains";
import { abi } from "@/app/abi";
import contractInfo from "@/app/contractInfo";

export default function Page({ params }) {
    const [music, setMusic] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioError, setAudioError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const audioRef = useRef(null);

    const contractAddress = contractInfo.contractAddress;

    const { data: musicData } = useReadContract({
        abi,
        address: contractAddress,
        functionName: "getMusic",
        args: [params.id],
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

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(err => {
                    console.error("Erreur de lecture audio :", err);
                    setAudioError("Impossible de lire l'audio. Vérifiez les permissions et le format.");
                });
            }
            setIsPlaying(!isPlaying);
        }
    };

    if (!music) return <div>Chargement...</div>;

    return (
        <div className="relative w-full h-screen bg-black flex justify-center items-center">
            <div className="relative w-[90%] max-w-3xl bg-gradient-to-r from-black to-green-900 rounded-lg p-6 flex items-center shadow-lg">
                
                {/* Image */}
                <div className="w-20 h-20 bg-gray-300 flex items-center justify-center rounded-md mr-6">
                    {music.imageUrl ? (
                        <img src={music.imageUrl} alt="Cover" className="w-full h-full object-cover rounded-md" />
                    ) : (
                        <span className="text-gray-500">🖼️</span> // Icône placeholder
                    )}
                </div>

                {/* Informations de la musique */}
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white">{music.name}</h2>
                </div>

                {/* Audio caché mais fonctionnel */}
                <audio
                    ref={audioRef}
                    controls
                    controlsList="nodownload"
                    onError={() => setAudioError("Erreur lors du chargement de l'audio.")}
                    onCanPlay={() => {
                        setAudioError(null);
                        setIsLoaded(true);
                    }}
                    onContextMenu={(e) => e.preventDefault()}
                >
                    <source src={music.audioUrl} type="audio/mpeg" />
                    Votre navigateur ne prend pas en charge le lecteur audio.
                </audio>

                {/* Prix en bas à gauche */}
                <div className="absolute bottom-2 left-10 bg-gray-700 text-white text-xs px-2 py-1 rounded">
                    {music.price} ETH
                </div>
            </div>
        </div>
    );
}
