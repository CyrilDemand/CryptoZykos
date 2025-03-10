const fs = require("fs");
const hre = require("hardhat");

async function main() {
    const CopyrightNFT = await hre.ethers.getContractFactory("CopyrightNFT");
    const contract = await CopyrightNFT.deploy();

    await contract.waitForDeployment();

    const contractAddress = await contract.getAddress();
    console.log(`✅ Contrat déployé à l'adresse: ${contractAddress}`);



    // 🔹 Sauvegarde l’adresse dans un fichier JSON
    fs.writeFileSync(
        "./contractInfo.json",
        JSON.stringify({ contractAddress }, null, 2) // Écrit dans le JSON
    );

    fs.writeFileSync(
        "../frontend/src/app/contractInfo.json",
        JSON.stringify({ contractAddress }, null, 2) // Écrit dans le JSON
    );

    console.log(contractAddress);

    console.log("✅ Adresse du contrat mise à jour dans contractInfo.json");
    console.log("CHANGEZ AUSSI DANS L AUTRE JSON DU FRONT END")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });