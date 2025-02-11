require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL, // URL du RPC Sepolia
      accounts: [process.env.PRIVATE_KEY_SEPOLIA], // Clé privée
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY, // Pour vérifier le contrat sur Etherscan
  },
};
