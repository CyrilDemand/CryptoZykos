"use client";

import { useEffect, useState } from 'react';
import { useBlockNumber, useReadContract, useWriteContract } from "wagmi";
import { sepolia } from "viem/chains";
import { abi } from './abi';
import { useAccount } from 'wagmi';
import contractInfo from './contractInfo.json';
import {uploadToIPFS} from "@/app/utils/uploadToIPFS";
import Link from 'next/link';


export default function Home() {
    const contractAddress = contractInfo.contractAddress;
    const [musicList, setMusicList] = useState([]);

    const { data: numberOfMusic } = useReadContract({
        abi,
        address: contractAddress,
        functionName: 'getMusicCount',
        chainId: sepolia.id,
    });

    const { data: allMusic } = useReadContract({
        abi,
        address: contractAddress,
        functionName: 'getAllMusic',
        chainId: sepolia.id,
    });

    const { data: blockNumber } = useBlockNumber({
        chainId: sepolia.id,
        watch: true,
    });

    const { address, isConnected } = useAccount();
    const [newValue, setNewValue] = useState("");
    const { writeContract } = useWriteContract();


    const [file, setFile] = useState(null);
    const [ipfsUrl, setIpfsUrl] = useState("");

    useEffect(() => {
        if (allMusic && allMusic[0] && allMusic[0].length > 0){
            console.log(allMusic);
            let musicData = [];

            for (let i=0; i<allMusic[0].length; i++){
                let newMusic = {
                    id : allMusic[0][i],
                    creator : allMusic[1][i],
                    name : allMusic[2][i],
                    imageUrl : allMusic[3][i],
                    audioUrl : allMusic[4][i],
                    price: allMusic[5][i]
                };
                console.log(newMusic);
                musicData.push(newMusic);
            }
            setMusicList(musicData);
        }else{
            setMusicList([]);
        }
    }, [allMusic]);

    const handleUpload = async () => {
        if (!file) return;
        const url = await uploadToIPFS(file);
        setIpfsUrl(url);
    };

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
                    {musicList.map((music, index) => (
                        <Link href={`/music/`+ music.id} >
                            <div key={index} className="bg-gray-800 p-4 rounded-lg flex items-center">
                                
                                {music.imageUrl != null && <img src={music.imageUrl} className="w-16 h-16 bg-gray-600 rounded-lg"></img>}
                                
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold">{music.name}</h3>
                                    <p className='text-sm font-thin text-gray-400'>{music.creator}</p>
                                </div>
                                <div className="ml-auto text-sm bg-gray-700 px-3 py-1 rounded">{music.price} ETH</div>
                            </div>
                        </Link>

                        
                    ))}
                </div>
            </div>
        </>  
    ); 
}
