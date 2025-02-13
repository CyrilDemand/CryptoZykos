export const abi = [
    {
        "inputs": [
            { "internalType": "string", "name": "_name", "type": "string" },
            { "internalType": "string", "name": "_imageURL", "type": "string" },
            { "internalType": "string", "name": "_audioURL", "type": "string" },
            { "internalType": "uint256", "name": "_price", "type": "uint256" }
        ],
        "name": "addMusic",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "musicId", "type": "uint256" }],
        "name": "purchaseLicense",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getMusicCount",
        "outputs": [{ "internalType": "uint256", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "musicId", "type": "uint256" }],
        "name": "getMusic",
        "outputs": [
            { "internalType": "uint256", "name": "id", "type": "uint256" },
            { "internalType": "address", "name": "creator", "type": "address" },
            { "internalType": "string", "name": "name", "type": "string" },
            { "internalType": "string", "name": "imageURL", "type": "string" },
            { "internalType": "string", "name": "audioURL", "type": "string" },
            { "internalType": "uint256", "name": "price", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllMusic",
        "outputs": [
            { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" },
            { "internalType": "address[]", "name": "creators", "type": "address[]" },
            { "internalType": "string[]", "name": "names", "type": "string[]" },
            { "internalType": "string[]", "name": "imageURLs", "type": "string[]" },
            { "internalType": "string[]", "name": "audioURLs", "type": "string[]" },
            { "internalType": "uint256[]", "name": "prices", "type": "uint256[]" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "musicId", "type": "uint256" },
            { "internalType": "string", "name": "_name", "type": "string" },
            { "internalType": "string", "name": "_imageURL", "type": "string" },
            { "internalType": "string", "name": "_audioURL", "type": "string" },
            { "internalType": "uint256", "name": "_price", "type": "uint256" }
        ],
        "name": "updateMetadata",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "musicId", "type": "uint256" },
            { "internalType": "address", "name": "user", "type": "address" }
        ],
        "name": "hasLicense",
        "outputs": [{ "internalType": "bool", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
    }
];
