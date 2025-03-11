// scripts/deploy.js
const hre = require("hardhat");

async function main() {
    // Récupérer le ContractFactory
    const CopyrightNFT = await hre.ethers.getContractFactory("CopyrightNFT");

    // Déployer le contrat avec l'URI de base
    console.log("Déploiement du CopyrightNFT...");
    const baseURI = "https://example.com/api/item/{id}.json";
    const copyrightNFT = await CopyrightNFT.deploy(baseURI);

    // Attendre que le déploiement soit terminé
    await copyrightNFT.waitForDeployment();

    console.log(`CopyrightNFT déployé à l'adresse: ${await copyrightNFT.getAddress()}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
