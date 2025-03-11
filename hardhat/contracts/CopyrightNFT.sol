// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Importation de l'implémentation standard ERC-1155 et Ownable d'OpenZeppelin
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MusicCopyright
 * @dev Contrat pour gérer des droits d'auteur de musique utilisant la norme ERC-1155.
 * Chaque token (par identifiant) représente une oeuvre musicale.
 */
contract CopyrightNFT is ERC1155, Ownable {

    // Mapping pour associer un token ID à l'adresse du créateur (détenteur des droits)
    mapping(uint256 => address) public creator;

    // Mapping optionnel pour stocker des métadonnées spécifiques à l'oeuvre, par exemple son nom
    mapping(uint256 => string) public musicTitles;

    /**
     * @dev Le constructeur initialise l'URI de base pour les métadonnées JSON
     * et définie le propriétaire via Ownable.
     * Exemple d'URI : "https://monserveur.com/api/token/{id}.json"
     */
    constructor(string memory baseUri) ERC1155(baseUri) Ownable(msg.sender) {}

    /**
     * @notice Crée une nouvelle oeuvre musicale (token ERC-1155) avec une quantité initiale.
     * @param tokenId L'identifiant unique représentant l'oeuvre
     * @param supply La quantité initiale de tokens émis (par exemple pour gérer différents droits ou licences)
     * @param _title Le nom ou titre de l'oeuvre
     * @param data Informations additionnelles (optionnelles) pour le mint
     *
     * Seul le propriétaire du contrat (par héritage de Ownable) peut créer une nouvelle oeuvre.
     */
    function createMusic(
        uint256 tokenId,
        uint256 supply,
        string memory _title,
        bytes memory data
    ) external onlyOwner {
        // Vérifie que cet identifiant n'a pas encore été utilisé
        require(creator[tokenId] == address(0), "Les droits sur cette oeuvre existent deja");

        // Enregistre le créateur de l'oeuvre (ici l'admin, mais on peut adapter pour un mécanisme plus complexe)
        creator[tokenId] = msg.sender;
        musicTitles[tokenId] = _title;

        // Mint initial des tokens représentant les droits d'auteur pour cette oeuvre
        _mint(msg.sender, tokenId, supply, data);
    }

    /**
     * @notice Permet au créateur d'une oeuvre (désigné lors de la création) d'émettre des copies additionnelles.
     * @param account Adresse qui recevra les nouveaux tokens
     * @param tokenId L'identifiant de l'oeuvre pour lequel émettre des copies
     * @param additionalSupply Quantité additionnelle à ajouter
     * @param data Informations additionnelles (optionnelles)
     */
    function mintAdditionalCopies(
        address account,
        uint256 tokenId,
        uint256 additionalSupply,
        bytes memory data
    ) external {
        // Seul le créateur de l'oeuvre peut mint des copies additionnelles
        require(creator[tokenId] == msg.sender, "Vous n'etes pas le createur de cette oeuvre");

        _mint(account, tokenId, additionalSupply, data);
    }

    /**
     * @notice (Optionnel) Fonction pour mettre à jour l'URI de base si nécessaire.
     * Seul le propriétaire peut mettre à jour l'URI.
     */
    function setBaseURI(string memory newuri) external onlyOwner {
        _setURI(newuri);
    }
}
