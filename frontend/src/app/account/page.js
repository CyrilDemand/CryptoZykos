"use client";

import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

export default function Account({ paralms }) {
    const { address } = useAccount();
    const router = useRouter();
    const [name, setName] = useState(""); // État pour le nom
    const [description, setDescription] = useState(""); // État pour la description

    useEffect(() => {
        if (!address) {
            router.push('/'); // Redirige vers l'accueil si pas de compte
        } else {
            // Appel API pour récupérer le nom et la description actuels
            // Remplacez par votre logique d'appel API
            setName("Nom actuel"); // Placeholder pour le nom
            setDescription("Description actuelle"); // Placeholder pour la description
        }
    }, [address, router]);

    const handleSubmit = (event) => {
        event.preventDefault();
        // Logique pour mettre à jour le nom et la description via un appel API
        // Remplacez par votre logique d'appel API
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
            <h1 className="text-3xl text-purple-600 font-bold mb-6">Mon Compte</h1>
            <form onSubmit={handleSubmit} className="shadow-md rounded-lg p-8 w-full max-w-md bg-gray-700">
                <label className="block font-semibold mb-1">
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
                <button type="submit" className="w-full bg-purple-600 text-white font-bold py-2 rounded-md hover:bg-purple-700 transition duration-200">Modifier</button>
            </form>
        </div>
    );
}