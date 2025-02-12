// uploadToIPFS.js
export async function uploadToIPFS(file) {
    const formData = new FormData();
    formData.append("file", file);

    // URL de l'API Pinata
    const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

    try {
        const response = await fetch(url, {
            method: "POST",
            body: formData,
            headers: {
                // Ne pas définir manuellement "Content-Type" car le navigateur le fera automatiquement avec le bon boundary.
                "pinata_api_key": process.env.NEXT_PUBLIC_PINATA_API_KEY,
                "pinata_secret_api_key": process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Erreur lors de l'upload");
        }

        console.log("✅ Fichier stocké sur IPFS :", data);

        // Retourne l’URL de ton gateway personnalisé
        return `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${data.IpfsHash}?pinataGatewayToken=${process.env.NEXT_PUBLIC_GATEWAY_KEY}`;
    } catch (error) {
        console.error("❌ Erreur lors de l'upload IPFS :", error);
        return null;
    }
}
