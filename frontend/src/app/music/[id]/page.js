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
                name: musicData[2] || "Titre inconnu",
                imageUrl: musicData[3],
                audioUrl: musicData[4],
                price: musicData[5],
                artist: "Artiste inconnu", // Placeholder en attendant l'ajout dans le contrat
                description: "", // Placeholder en attendant les données du contrat
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
        const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
        if ( audio.currentTime >= 30) {
            audio.pause();
        }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
    }, [music]);
    
    const handlePlay = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0; // Revenir au début
            audioRef.current.play();
        }
    };
    
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
        <div className="relative w-full h-screen flex flex-col justify-top pt-20 items-center bg-gray-900">
            
            {/* Card principale */}
            <div className="relative w-full min-h-[260px] h-auto hover mt-0 flex items-center shadow-lg"style={{ background: gradientBackground }}>
                {/* Image et Prix */}
                <div className="flex flex-col items-center w-max h-auto flex-shrink-0">
                    <div className="relative w-60 h-60 bg-gray-300 rounded-md overflow-hidden">
                        {music.imageUrl && (
                            <img ref={imgRef} src={music.imageUrl} alt="Cover" className="w-full h-full object-cover max-h-60 max-w-60" crossOrigin="anonymous" />
                        )}
                    </div>
                </div>
                {/* Titre centré en haut */}
                <div className=" max-w-3xl flex flex-col items-start ml-3 mb-10">
                    <h1 className="font-bold text-white text-4xl  px-2 py-1 rounded bg-gray-700 opacity-70 mb-4">{music.name}</h1>
                    <h2 className="text-xl text-white px-2 py-1 rounded bg-gray-700 opacity-70 mb-6">{music.artist}</h2>
                </div>
                {/* Lecteur audio à droite et centré verticalement */}
                <div className="w-full flex-1 flex items-center justify-center mt-20">
                <audio
                    ref={audioRef}
                    controls
                    className="w-full max-w-lg"
                    onContextMenu={(e) => e.preventDefault()}  // Désactive le clic droit
                    controlsList="nodownload noremoteplayback nofullscreen" // Supprime les options de Chrome
                    onError={() => setAudioError("Erreur lors du chargement de l'audio.")} 
                    onPlay={handlePlay}
                > 
                        <source src={music.audioUrl} type="audio/mpeg" />
                        Votre navigateur ne prend pas en charge le lecteur audio.
                    </audio>
                </div>
            </div>

            

            {/* Section Description */}
            <div className="mt-6 text-center px-4 py-2 text-gray-300 max-w-2xl">
                <h3 className="text-xl font-semibold mb-2">Description</h3>
                <p>{music.description || "Aucune description disponible pour le moment."}</p>
            </div>

            {/* Bouton Acheter*/}
            <div className="w-[90%] max-w-3xl flex flex-col items-start mb-6">
            {!hasPurchased && (
                <div className="flex justify-start items-center w-full">
                    <button
                        onClick={() => writeContract({ abi, address: contractAddress, functionName: "purchaseLicense", args: [music.id], value: music.price, chainId: sepolia.id })}
                        className="mt-4 px-6 py-3 bg-gray-700 text-white text-lg rounded hover:bg-gray-600 cursor-pointer"
                    >
                        Acheter
                    </button>
                    <div className="text-white text-sm ml-4">
                        {music.price} ETH
                    </div>
                </div>
            )}
            </div>
        </div>
    );
}
