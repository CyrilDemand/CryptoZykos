// frontend/src/app/Nav.js
'use client';

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from 'wagmi';
import Link from 'next/link'

const Nav = () => {
    const { address, isConnected } = useAccount();

    return (
        <nav className="fixed top-0 left-0 w-full bg-black text-white px-6 py-3 flex justify-between items-center border-b-2 border-purple-500 shadow-md z-50">
            <div className="text-xl font-bold"><Link href={`/`} className="px-4 py-2 rounded-lg hover:bg-gray-600 transition">🎵</Link></div>
            <ul className="flex items-center space-x-4">
                {address && <li><Link href={`/bibliotheque/`} className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-600 transition">Bibliothèque</Link></li>}
                {address && <li><Link href={`/upload/`} className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-600 transition">Upload</Link></li>}
                <li>
                    <ConnectButton.Custom>
                        {({
                            account,
                            chain,
                            openAccountModal,
                            openChainModal,
                            openConnectModal,
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
                                    className="flex space-x-2"
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
                                    ) : (
                                        <button
                                            onClick={openConnectModal}
                                            className="px-4 py-2 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-600 transition-all duration-300"
                                        >
                                            Connexion
                                        </button>
                                    )}
                                </div>
                            );
                        }}
                    </ConnectButton.Custom>
                </li>
                {address && <li><Link href={`/account/`} className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-600 transition">Profile</Link></li>}
            </ul>
        </nav>
    );
};

export default Nav;