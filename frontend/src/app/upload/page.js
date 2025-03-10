'use client';

import { useState, useRef, useEffect } from 'react';
import { useAccount, useWriteContract} from 'wagmi';
import { useRouter } from 'next/navigation';
import { sepolia } from "viem/chains";
import { abi } from '../abi';
import contractInfo from '../contractInfo.json';
import {uploadToIPFS} from "@/app/utils/uploadToIPFS";
import ColorThief from 'colorthief';


export default function Upload() {
    const { address } = useAccount(); 
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [music, setMusic] = useState(null);
    const [musicUrl, setMusicUrl] = useState (null);
    const [coverArt, setCoverArt] = useState(null);
    const [coverArtUrl, setCoverArtUrl] = useState(null);
    const [price, setPrice] = useState(0);
    const [priceUSD, setPriceUSD] = useState(null); // Correction ici, l'état n'était pas initialisé
    const [coverArtPreview, setCoverArtPreview] = useState(null);
    const [backgroundColor, setBackgroundColor] = useState('rgb(0,0,0)'); // Couleur du fond extraite
    const [gradientBackground, setGradientBackground] = useState('linear-gradient(to right, black, gray)');
    const [isUploadDone, setIsUploadDone] = useState(false);

    const contractAddress = contractInfo.contractAddress;

    const imgRef = useRef(null);

    // ✅ Utilisation de useEffect pour rediriger après le rendu initial
    useEffect(() => {
        if (!address) {
            router.push('/');
        }
        if (isUploadDone) {
            addMusic();
            setIsUploadDone(false); // Reset pour la prochaine exécution
        }
    }, [address, router, isUploadDone]); // Dépendance sur `address`, ne redirige que si elle est absente

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({
            title,
            music,
            price,
            priceUSD,
            coverArt,
            walletId: address,
        });
    };

    const handleCoverArtChange = (e) => {
        const file = e.target.files[0];
        setCoverArt(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverArtPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // ✅ Récupération du taux de change ETH -> USD
    useEffect(() => {
        const fetchEthPrice = async () => {
            try {
                const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
                const data = await response.json();
                return data.ethereum.usd;
            } catch (error) {
                console.error("Erreur de récupération du prix ETH:", error);
                return null;
            }
        };

        if (price) {
            fetchEthPrice().then((ethToUsdRate) => {
                if (ethToUsdRate) {
                    setPriceUSD((parseFloat(price) * ethToUsdRate).toFixed(2)); // Convertir ETH en USD
                }
            });
        }
    }, [price]);

    useEffect(() => {
        if (coverArtPreview && imgRef.current) {
            const colorThief = new ColorThief();
            const img = imgRef.current;

            img.onload = () => {
                try {
                    const dominantColor = colorThief.getColor(img);
                    const colorString = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`;
                    const gradient = `linear-gradient(to right, ${colorString}, black)`;
                    
                    setBackgroundColor(colorString);
                    setGradientBackground(gradient);
                } catch (error) {
                    console.error("Erreur d'extraction des couleurs:", error);
                }
            };
        }
    }, [coverArtPreview]);

    const handleUpload = async (file) => {
        if (!file) return;
        const url = await uploadToIPFS(file);
        console.log(`dans handle upload, return ${url}`)
        return url;
    };

    const { writeContract } = useWriteContract();
    
    async function addMusic() {
        const uploadedCoverArtUrl = await handleUpload(coverArt);
        const uploadedMusicUrl = await handleUpload(music);

        setCoverArtUrl(uploadedCoverArtUrl);
        setMusicUrl(uploadedMusicUrl);
        try {
            await writeContract({
                abi,
                address: contractAddress,
                functionName: "addMusic",
                args: [
                    title,
                    uploadedCoverArtUrl,
                    uploadedMusicUrl,
                    price
                ],
                chainId: sepolia.id,
            });

            console.log("✅ Musique ajoutée !");
        } catch (error) {
            console.error("❌ Erreur lors de l'ajout de la musique :", error);
        }
    }

    return (
        <div className="h-screen w-full flex flex-col justify-center items-center text-white px-6 py-10"
        style={{ background: gradientBackground }}>
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-gray-900 p-6 rounded-lg shadow-lg space-y-4">
            {/* Titre page */}
            <div className="flex justify-center">
                <h1 className="text-4xl font-extrabold flex justify-center mb-6"
                    style={{ color: backgroundColor }}>
                    Upload Music
                </h1>
            </div>   
                {/* Image Cover */}
                 <div className="flex justify-center">
                    <label className="cursor-pointer w-24 h-24 bg-gray-600 rounded-lg flex justify-center items-center overflow-hidden">
                        {coverArtPreview ? (
                            <img
                                ref={imgRef}
                                src={coverArtPreview}
                                alt="Cover"
                                className="w-full h-full object-cover"
                                crossOrigin="anonymous"
                            />
                        ) : (
                            <span className="text-gray-300">+</span>
                        )}
                        <input type="file" accept="image/*" onChange={handleCoverArtChange} className="hidden" />
                    </label>
                </div>

                {/* Titre musique */}
                <div>
                    <label className="block font-semibold mb-1">Titre:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-purple-500"
                        placeholder="Entrez le titre de la musique"
                        required
                    />
                </div>

                {/* Champs de formulaire */}
                <div>
                    <label className="block text-gray-300 font-semibold mb-1">Fichier audio (MP3):</label>
                    <input
                        type="file"
                        onChange={(e) => setMusic(e.target.files[0])}
                        className="w-full border border-gray-600 rounded-md bg-gray-800 text-white"
                        accept="audio/mpeg"
                        required
                    />
                </div>
                {/* Prix en ETH avec conversion USD */}
                <div>
                    <label className="block text-gray-300 font-semibold mb-1">Prix (en ETH):</label>
                    <div className="flex items-center space-x-3">
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-purple-500"
                            placeholder="Entrer le prix en ETH"
                            required
                        />
                        <span className="text-gray-300 font-semibold">≈ {priceUSD ? `$${priceUSD} USD` : '...'}</span>
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-2 rounded-md transition"
                    style={{ background: backgroundColor, color: "#fff" }}
                    onClick={addMusic}
                >
                    Submit
                </button>
            </form>
        </div>
    );
}
