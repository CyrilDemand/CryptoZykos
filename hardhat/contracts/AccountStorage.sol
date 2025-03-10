// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

/**
 * @title AccountStorage
 * @dev Contrat pour stocker et gérer les profils d'utilisateurs
 */
contract AccountStorage {
    // Structure pour représenter un profil utilisateur
    struct UserProfile {
        address account;
        string pseudo;
        string description;
        string imageUrl;
        uint256 createdAt;
        uint256 updatedAt;
        bool exists;
    }

    // Mapping d'adresses vers profils d'utilisateurs
    mapping(address => UserProfile) private profiles;

    // Array des adresses de tous les utilisateurs enregistrés
    address[] private registeredUsers;

    // Owner du contrat
    address public owner;

    // Événements
    event ProfileCreated(address indexed userAddress, string pseudo);
    event ProfileUpdated(address indexed userAddress, string pseudo);
    event ProfileDeleted(address indexed userAddress);

    // Modificateur pour restreindre certaines fonctions au propriétaire
    modifier onlyOwner() {
        require(msg.sender == owner, "Seul le proprietaire peut appeler cette fonction");
        _;
    }

    // Modificateur pour vérifier que l'utilisateur appelle des fonctions sur son propre profil
    modifier onlyAccountOwner(address _account) {
        require(msg.sender == _account, "Vous pouvez seulement modifier votre propre profil");
        _;
    }

    // Modificateur pour vérifier si un profil existe
    modifier profileExists(address _account) {
        require(profiles[_account].exists, "Ce profil n'existe pas");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Crée un nouveau profil utilisateur
     * @param _pseudo Pseudonyme de l'utilisateur
     * @param _description Description du profil
     * @param _imageUrl URL de l'image de profil
     */
    function createProfile(
        string memory _pseudo,
        string memory _description,
        string memory _imageUrl
    ) public {
        require(!profiles[msg.sender].exists, "Profil deja existant");
        require(bytes(_pseudo).length > 0, "Le pseudo ne peut pas etre vide");

        profiles[msg.sender] = UserProfile({
            account: msg.sender,
            pseudo: _pseudo,
            description: _description,
            imageUrl: _imageUrl,
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            exists: true
        });

        registeredUsers.push(msg.sender);

        emit ProfileCreated(msg.sender, _pseudo);
    }

    /**
     * @dev Met à jour un profil existant
     * @param _pseudo Nouveau pseudonyme (optionnel, envoyez chaîne vide pour ne pas modifier)
     * @param _description Nouvelle description (optionnel, envoyez chaîne vide pour ne pas modifier)
     * @param _imageUrl Nouvelle URL d'image (optionnel, envoyez chaîne vide pour ne pas modifier)
     */
    function updateProfile(
        string memory _pseudo,
        string memory _description,
        string memory _imageUrl
    ) public profileExists(msg.sender) {
        UserProfile storage profile = profiles[msg.sender];

        if (bytes(_pseudo).length > 0) {
            profile.pseudo = _pseudo;
        }

        if (bytes(_description).length > 0) {
            profile.description = _description;
        }

        if (bytes(_imageUrl).length > 0) {
            profile.imageUrl = _imageUrl;
        }

        profile.updatedAt = block.timestamp;

        emit ProfileUpdated(msg.sender, profile.pseudo);
    }

    /**
     * @dev Supprime un profil
     */
    function deleteProfile() public profileExists(msg.sender) {
        // Suppression du profil
        delete profiles[msg.sender];

        // Suppression de l'utilisateur de la liste des utilisateurs enregistrés
        for (uint i = 0; i < registeredUsers.length; i++) {
            if (registeredUsers[i] == msg.sender) {
                // Remplacer l'élément à supprimer par le dernier élément
                registeredUsers[i] = registeredUsers[registeredUsers.length - 1];
                // Réduire la taille du tableau
                registeredUsers.pop();
                break;
            }
        }

        emit ProfileDeleted(msg.sender);
    }

    /**
 * @dev Récupère les informations d'un profil
 * @param _account L'adresse du profil à récupérer
 * @return account L'adresse du compte
 * @return pseudo Le pseudonyme de l'utilisateur
 * @return description La description du profil
 * @return imageUrl L'URL de l'image du profil
 * @return createdAt Date de création du profil (timestamp)
 * @return updatedAt Date de dernière mise à jour du profil (timestamp)
 */
    function getProfile(address _account) public view profileExists(_account) returns (
        address account,
        string memory pseudo,
        string memory description,
        string memory imageUrl,
        uint256 createdAt,
        uint256 updatedAt
    ) {
        UserProfile memory profile = profiles[_account];
        return (
            profile.account,
            profile.pseudo,
            profile.description,
            profile.imageUrl,
            profile.createdAt,
            profile.updatedAt
        );
    }


    /**
     * @dev Vérifie si un profil existe
     * @param _account L'adresse à vérifier
     * @return bool True si le profil existe
     */
    function profileExistsCheck(address _account) public view returns (bool) {
        return profiles[_account].exists;
    }

    /**
     * @dev Récupère le nombre total d'utilisateurs enregistrés
     * @return uint256 Nombre d'utilisateurs
     */
    function getTotalUsers() public view returns (uint256) {
        return registeredUsers.length;
    }

    /**
     * @dev Récupère tous les utilisateurs enregistrés avec pagination
     * @param _offset Index de départ
     * @param _limit Nombre maximum d'utilisateurs à retourner
     * @return address[] Liste des adresses d'utilisateurs
     */
    function getUsers(uint256 _offset, uint256 _limit) public view returns (address[] memory) {
        uint256 length = registeredUsers.length;

        if (_offset >= length) {
            return new address[](0);
        }

        uint256 end = _offset + _limit;
        if (end > length) {
            end = length;
        }

        uint256 resultLength = end - _offset;
        address[] memory result = new address[](resultLength);

        for (uint256 i = 0; i < resultLength; i++) {
            result[i] = registeredUsers[_offset + i];
        }

        return result;
    }

    /**
     * @dev Permet au propriétaire de transférer la propriété du contrat
     * @param _newOwner Nouvelle adresse du propriétaire
     */
    function transferOwnership(address _newOwner) public onlyOwner {
        require(_newOwner != address(0), "Nouvelle adresse invalide");
        owner = _newOwner;
    }

    /**
     * @dev Permet au propriétaire de supprimer un profil inapproprié
     * @param _account Adresse du profil à supprimer
     */
    function removeProfileByAdmin(address _account) public onlyOwner profileExists(_account) {
        // Suppression du profil
        delete profiles[_account];

        // Suppression de l'utilisateur de la liste des utilisateurs enregistrés
        for (uint i = 0; i < registeredUsers.length; i++) {
            if (registeredUsers[i] == _account) {
                registeredUsers[i] = registeredUsers[registeredUsers.length - 1];
                registeredUsers.pop();
                break;
            }
        }

        emit ProfileDeleted(_account);
    }
}
