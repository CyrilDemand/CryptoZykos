"use client";

import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { accountStorageABI } from '../accountAbi';
import { useReadContract, useWriteContract } from "wagmi";
import contractInfo from '../contractInfo.json';
import {abi} from "@/app/abi";
import {sepolia} from "viem/chains";

export default function Account({ paralms }) {
    const { address } = useAccount();
    const router = useRouter();
    const [name, setName] = useState(""); // État pour le nom
    const [description, setDescription] = useState(""); // État pour la description
    const [musicList, setMusicList] = useState([]);

    const contractAddress = contractInfo.contractAddress;
    const { writeContract } = useWriteContract();

    const { data:fetchedProfile } = useReadContract({
        abi: accountStorageABI,
        address: contractAddress,
        functionName: 'getProfile',
        args: [address], 
    });

    const { data: allMusic } = useReadContract({
        abi,
        address: contractAddress,
        functionName: 'getAllMusic',
        chainId: sepolia.id,
    });


    useEffect(() => {
        if (!address) {
            router.push('/'); // Redirige vers l'accueil si pas de compte
        } else {
            console.log(fetchedProfile);

        }

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
                console.log(newMusic.creator, " === ", address, " = ", newMusic.creator === address);
                musicData.push({
                    id: 50,
                    creator: address,
                    name: "musique de test",
                    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsrE0OMMoAG2y6hSU1o9snZaNQSX5W8PqbAA&s",
                    audioUrl: "aaa",
                    price: 3
                });
                musicData.push(newMusic);
            }
            setMusicList(musicData);
        }else{
            setMusicList([]);
        }
    }, [address, router, allMusic]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await writeContract({
                abi: accountStorageABI,
                address: contractAddress,
                functionName: "setName",
                args: [name],
            });
            await writeContract({
                abi: accountStorageABI,
                address: contractAddress,
                functionName: "setDescription",
                args: [description],
            });
        } catch (error) {
            console.error("Error updating information:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 pt-16">
            <h1 className="text-3xl text-purple-600 font-bold mb-6 drop-shadow-md">Mon Compte</h1>
            <form onSubmit={handleSubmit} className="shadow-md rounded-lg p-8 w-7/12 max-w-2xl bg-gray-700">

                <ConnectButton.Custom>
                    {({
                          account,
                          chain,
                          openAccountModal,
                          openChainModal,
                          mounted
                      }) => {
                        return (
                            <div
                                {...(!mounted && {
                                    "aria-hidden": true,
                                    style: {
                                        opacity: 0,
                                        pointerEvents: "none",
                                        userSelect: "none",
                                    },
                                })}
                                className="flex space-x-2 justify-between"
                            >
                                {account && chain ? (
                                    <>
                                        <button
                                            onClick={openChainModal}
                                            className="px-4 py-2 bg-white text-black rounded-lg shadow-md hover:bg-gray-200 transition-all duration-300 flex items-center"
                                        >
                                            🟢 {chain.name}
                                        </button>
                                        <button
                                            onClick={openAccountModal}
                                            className="px-4 py-2 bg-white text-black rounded-lg shadow-md hover:bg-gray-200 transition-all duration-300 flex items-center space-x-2"
                                        >
                                            <span>{account.displayBalance ? account.displayBalance : "0 ETH"}</span>
                                            <span className="text-red-500">🔴</span>
                                            <span>{account.displayName}</span>
                                        </button>
                                    </>
                                ) : null}
                            </div>
                        );
                    }}
                </ConnectButton.Custom>


                <label className="block font-semibold mb-1 mt-6">
                    <span className="text-gray-300">Nom:</span>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-purple-500"
                    />
                </label>
                <label className="block font-semibold mb-1">
                    <span className="text-gray-300">Description:</span>
                    <textarea
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-purple-500"
                    />
                </label>
                <button type="submit"
                        className="w-full bg-purple-600 text-white font-bold py-2 rounded-md hover:bg-purple-700 transition duration-200">Modifier
                </button>
            </form>

            <div className="w-5/12">
                <h1 className="text-white">Mes musiques en tant qu'artistes</h1>
                {
                    musicList.filter(e => e.creator === address).map(music => (
                        <div className="bg-gray-800 p-4 rounded-lg flex items-center">

                            {music.imageUrl != null &&
                                <img src={music.imageUrl} className="w-16 h-16 bg-gray-600 rounded-lg"></img>}

                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-white">{music.name}</h3>
                                <p className='text-sm font-thin text-gray-400'>{music.creator}</p>
                            </div>
                            <div className="ml-auto text-sm bg-gray-700 px-3 py-1 rounded">nombre d'achats: </div>
                        </div>
                    ))
                }
            </div>

        </div>
    );
}