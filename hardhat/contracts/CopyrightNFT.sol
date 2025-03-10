// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CopyrightNFT {
    struct Music {
        uint256 id;
        address creator;
        string name;
        string imageURL;
        string audioURL;
        uint256 price; // Stocké en wei
        mapping(address => bool) hasPurchased;
    }

    Music[] public musicList;
    uint256 public nextMusicId = 1;

    event MusicAdded(uint256 indexed musicId, address creator, string name, string imageURL, string audioURL, uint256 price);
    event Purchased(address indexed buyer, uint256 musicId, uint256 amount);
    event MetadataUpdated(uint256 indexed musicId, string name, string imageURL, string audioURL, uint256 price);

    function addMusic(
        string memory _name,
        string memory _imageURL,
        string memory _audioURL,
        uint256 _price
    ) external {
        Music storage newMusic = musicList.push();
        newMusic.id = nextMusicId++;
        newMusic.creator = msg.sender;
        newMusic.name = _name;
        newMusic.imageURL = _imageURL;
        newMusic.audioURL = _audioURL;
        newMusic.price = _price;

        emit MusicAdded(newMusic.id, msg.sender, _name, _imageURL, _audioURL, _price);
    }

    function purchaseLicense(uint256 musicId) external payable {
        require(musicId > 0 && musicId <= musicList.length, "Musique inexistante.");
        Music storage music = musicList[musicId - 1];

        require(msg.value == music.price, "Montant incorrect.");
        require(!music.hasPurchased[msg.sender], "Deja achete."); //TODO : ne fonctionne pas

        music.hasPurchased[msg.sender] = true;
        payable(music.creator).transfer(msg.value);

        emit Purchased(msg.sender, musicId, msg.value);
    }

    function updateMetadata(
        uint256 musicId,
        string memory _name,
        string memory _imageURL,
        string memory _audioURL,
        uint256 _price
    ) external {
        require(musicId > 0 && musicId <= musicList.length, "Musique inexistante.");
        Music storage music = musicList[musicId - 1];

        require(msg.sender == music.creator, "Seul le createur peut modifier ceci.");

        music.name = _name;
        music.imageURL = _imageURL;
        music.audioURL = _audioURL;
        music.price = _price;

        emit MetadataUpdated(musicId, _name, _imageURL, _audioURL, _price);
    }

    function hasLicense(uint256 musicId, address user) external view returns (bool) {
        require(musicId > 0 && musicId <= musicList.length, "Musique inexistante.");
        return musicList[musicId - 1].hasPurchased[user];
    }

    function getMusicCount() external view returns (uint256) {
        return musicList.length;
    }

    function getMusic(uint256 musicId) external view returns (
        uint256 id,
        address creator,
        string memory name,
        string memory imageURL,
        string memory audioURL,
        uint256 price
    ) {
        require(musicId > 0 && musicId <= musicList.length, "Musique inexistante.");
        Music storage music = musicList[musicId - 1];
        return (music.id, music.creator, music.name, music.imageURL, music.audioURL, music.price);
    }

    function getAllMusic() external view returns (
        uint256[] memory ids,
        address[] memory creators,
        string[] memory names,
        string[] memory imageURLs,
        string[] memory audioURLs,
        uint256[] memory prices
    ) {
        uint256 length = musicList.length;
        ids = new uint256[](length);
        creators = new address[](length);
        names = new string[](length);
        imageURLs = new string[](length);
        audioURLs = new string[](length);
        prices = new uint256[](length);

        for (uint256 i = 0; i < length; i++) {
            Music storage music = musicList[i];
            ids[i] = music.id;
            creators[i] = music.creator;
            names[i] = music.name;
            imageURLs[i] = music.imageURL;
            audioURLs[i] = music.audioURL;
            prices[i] = music.price;
        }
    }
}
