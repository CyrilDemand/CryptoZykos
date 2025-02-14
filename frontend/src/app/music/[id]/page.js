"use client";

import React, { useEffect, useState, useRef } from "react";
import { useReadContract, useWriteContract, useAccount } from "wagmi";
import { sepolia } from "viem/chains";
import { abi } from "@/app/abi";
import contractInfo from "@/app/contractInfo";
import ColorThief from "colorthief";

export default function Page({ params }) {
    const { address } = useAccount();
    const [music, setMusic] = useState(null);
    const [hasPurchased, setHasPurchased] = useState(false);
    const [audioError, setAudioError] = useState(null);
    const audioRef = useRef(null);
    const imgRef = useRef(null);
    const [gradientBackground, setGradientBackground] = useState("black");

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
        if (music?.imageUrl && imgRef.current) {
            const colorThief = new ColorThief();
            const img = imgRef.current;

            img.onload = () => {
                try {
                    const dominantColor = colorThief.getColor(img);
                    const colorString = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`;
                    const gradient = `linear-gradient(to right, ${colorString}, black)`;
                    setGradientBackground(gradient);
                } catch (error) {
                    console.error("Erreur d'extraction des couleurs:", error);
                }
            };
        }
    }, [music]);

    if (!music) return <div>Chargement...</div>;

    return (
        <div className="relative w-full h-screen flex flex-col justify-center items-center bg-black">
            {/* Titre centré en haut */}
            <h1 className="text-4xl font-bold text-white mb-6">{music.name}</h1>

            {/* Card principale */}
            <div className="relative w-[90%] max-w-3xl border border-gray-500 rounded-lg p-6 flex items-center shadow-lg" style={{ background: gradientBackground }}>
                {/* Image et Prix */}
                <div className="flex flex-col items-center w-32 h-auto flex-shrink-0">
                    <div className="relative w-32 h-32 bg-gray-300 rounded-md overflow-hidden">
                        {music.imageUrl && (
                            <img ref={imgRef} src={music.imageUrl} alt="Cover" className="w-full h-full object-cover" crossOrigin="anonymous" />
                        )}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded">
                            {music.price} ETH
                        </div>
                    </div>
                </div>

                {/* Lecteur audio à droite et centré verticalement */}
                <div className="flex-1 flex items-center justify-start w-full ml-6">
                <audio
                    ref={audioRef}
                    controls
                    className="w-full"
                    onContextMenu={(e) => e.preventDefault()}  // Désactive le clic droit
                    controlsList="nodownload noremoteplayback nofullscreen" // Supprime les options de Chrome
                    onError={() => setAudioError("Erreur lors du chargement de l'audio.")} 
                > 
                        <source src={music.audioUrl} type="audio/mpeg" />
                        Votre navigateur ne prend pas en charge le lecteur audio.
                    </audio>
                </div>
            </div>

            {/* Bouton Acheter (centré en dessous de la carte) */}
            {!hasPurchased && (
                <button
                    onClick={() => writeContract({ abi, address: contractAddress, functionName: "purchaseLicense", args: [music.id], value: music.price, chainId: sepolia.id })}
                    className="mt-4 px-6 py-3 bg-gray-700 text-white text-lg rounded hover:bg-gray-600 cursor-pointer"
                >
                    Acheter
                </button>
            )}
        </div>
    );
}
