# Partie hardhat - contrats blockchain

Ce dossier contient les contracts ainsi que ce qu'il faut pour les déployer
- contracts : contient les contrats solidity
- scripts : scripts de deploiement sur le testnet etherum solidity
- test : les tests unitaires des contrats

## Pour deployer sur la blockchain locale
```shell
npx hardhat node
npx hardhat run .\scripts\deploy.js --network localhost 
```

## Pour deployer sur la blockchain sepolia

## Lancer les tests unitaires :
```shell
npx hardhat test
```

## Pour deployer sur la blockchain locale
```shell
npx hardhat run .\scripts\deploy.js --network sepolia 
```
