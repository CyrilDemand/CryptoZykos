'use client';

import { useEffect, useState } from 'react';
import { useBlockNumber, useReadContract, useWriteContract } from "wagmi";
import { sepolia } from "viem/chains";
import { useAccount } from 'wagmi';


export default function Bibliotheque() {

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
                    <div className="bg-gray-800 p-4 rounded-lg flex items-center">
                        <div className="w-16 h-16 bg-gray-600 rounded-lg"></div>
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold">Titre</h3>
                            <p className="text-sm text-gray-400">Description à compléter.</p>
                        </div>
                        <div className="ml-auto text-sm bg-gray-700 px-3 py-1 rounded">0.001 ETH</div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex items-center">
                        <div className="w-16 h-16 bg-gray-600 rounded-lg"></div>
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold">Titre</h3>
                            <p className="text-sm text-gray-400">Description à compléter.</p>
                        </div>
                        <div className="ml-auto text-sm bg-gray-700 px-3 py-1 rounded">0.025 ETH</div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex items-center">
                        <div className="w-16 h-16 bg-gray-600 rounded-lg"></div>
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold">Titre</h3>
                            <p className="text-sm text-gray-400">Description à compléter.</p>
                        </div>
                        <div className="ml-auto text-sm bg-gray-700 px-3 py-1 rounded">2 ETH</div>
                    </div>
                    </div>
                </div>
            </div>    
        </>
    );
    
    
}
