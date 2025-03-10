'use client';

import { useEffect, useState } from 'react';
import { useBlockNumber, useReadContract, useWriteContract } from "wagmi";
import { abi } from '../abi';
import { sepolia } from "viem/chains";
import contractInfo from '../contractInfo.json';
import { useAccount } from 'wagmi';
import Link from 'next/link';

export default function Bibliotheque() {
    const contractAddress = contractInfo.contractAddress;
    const [musicList, setMusicList] = useState([]);
    const { address, isConnected } = useAccount();

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

    useEffect(() => {
        async function fetchPurchasedMusic() {
            if (!allMusic || !isConnected || !address) {
                setMusicList([]);
                return;
            }

            let musicData = [];

            for (let i=0; i<allMusic[0].length; i++){
                const isPurchased = await fetchHasPurchased(allMusic[0][i]);
                if (isPurchased) {
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
            }

            setMusicList(musicData);
        }

        fetchPurchasedMusic();
    }, [allMusic, isConnected, address]);

    async function fetchHasPurchased(musicId) {
        const { data: hasPurchased } = await useReadContract({
            abi,
            address: contractAddress,
            functionName: 'hasLicense',
            args: [musicId, address],
            chainId: sepolia.id,
        });

        return hasPurchased;
    }
    
    return (
        <>
            {/* Bannière (directement sous la navbar) */}
            <div className="relative w-screen min-w-[600px] h-48 bg-gradient-to-r from-yellow-400 to-pink-500 flex justify-center items-center text-white font-extrabold text-4xl shadow-md mt-[52px]">
                Bibliothèque
            </div>

            {/* Section Musiques */}
            <div className="bg-black text-white min-h-screen px-6 lg:px-12 py-8 flex justify-center">
                <div className="max-w-4xl w-full">
                    <h1 className="text-2xl font-bold mb-4">Musiques</h1>
                    <div className="grid gap-4">
                        {musicList.length === 0 ? (
                            <p>Aucune musique achetée.</p>
                        ) : (
                            musicList.map((music, index) => (
                                <Link href={`/music/` + music.id} key={index}>
                                    <div className="bg-gray-800 p-4 rounded-lg flex items-center">
                                        {music.imageUrl && <img src={music.imageUrl} className="w-16 h-16 bg-gray-600 rounded-lg" />}
                                        <div className="ml-4">
                                            <h3 className="text-lg font-semibold">{music.name}</h3>
                                            <p className='text-sm font-thin text-gray-400'>{music.creator}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>   
        </>
    );
    
    
}
