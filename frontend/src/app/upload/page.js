// frontend/src/app/upload.js
'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation'

export default function Upload() {
    const { address } = useAccount(); 
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [music, setMusic] = useState(null);
    const [coverArt, setCoverArt] = useState(null);
    const [price, setPrice] = useState('');
    const [coverArtPreview, setCoverArtPreview] = useState(null);

    if (!address) {
        router.push('/');
        return null; 
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log({
            title,
            music,
            price,
            coverArt,
            walletId: address, // Include the wallet ID
        });
    };

    const handleCoverArtChange = (e) => {
        const file = e.target.files[0];
        setCoverArt(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverArtPreview(reader.result); // Mettre à jour l'aperçu de l'image
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-100 to-gray-200 px-12">
            <h1 className="text-4xl font-extrabold text-indigo-700 mb-6">Upload Music</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
                <div>
                    <label className="block text-gray-700">Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-400 rounded-md text-black"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Audio file (MP3):</label>
                    <input
                        type="file"
                        onChange={(e) => setMusic(e.target.files[0])}
                        className="w-full border border-gray-400 rounded-md text-black"
                        accept="audio/mpeg" // Accept only MP3 files
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Cover Art:</label>
                    <input
                        type="file"
                        onChange={handleCoverArtChange}
                        className="w-full border border-gray-400 rounded-md text-black"
                        accept="image/*"
                        required
                    />
                    {coverArtPreview && ( // Afficher l'aperçu si disponible
                        <img
                            src={coverArtPreview}
                            alt="Cover Art Preview"
                            className="mt-2 max-w-xs max-h-40" // Taille maximale en CSS
                        />
                    )}
                </div>
                <div>
                    <label className="block text-gray-700">Price:</label>
                    <input
                        type="text" // Changer le type en text
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-400 rounded-md text-black"
                        placeholder="Enter price in USD" // Placeholder pour indiquer le format
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}