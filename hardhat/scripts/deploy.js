const fs = require("fs");
const hre = require("hardhat");

async function main() {
    const Storage = await hre.ethers.getContractFactory("Storage");
    const storage = await Storage.deploy();

    await storage.waitForDeployment();

    const contractAddress = await storage.getAddress();
    console.log(`✅ Contrat déployé à l'adresse: ${contractAddress}`);

    // 🔹 Sauvegarde l’adresse dans un fichier JSON
    fs.writeFileSync(
        "./contractInfo.json",
        JSON.stringify({ contractAddress }, null, 2) // Écrit dans le JSON
    );

    console.log("✅ Adresse du contrat mise à jour dans contractInfo.json");
    console.log("CHANGEZ AUSSI DANS L AUTRE JSON DU FRONT END")
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
