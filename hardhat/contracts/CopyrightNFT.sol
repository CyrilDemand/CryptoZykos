// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CopyrightNFT {
    struct Music {
        address creator;
        string imageURL;
        string audioURL;
        uint256 price;
        mapping(address => bool) hasPurchased;
    }

    Music[] public musicList;

    event MusicAdded(uint256 indexed musicId, address creator, string imageURL, string audioURL, uint256 price);
    event Purchased(address indexed buyer, uint256 musicId, uint256 amount);
    event MetadataUpdated(uint256 indexed musicId, string imageURL, string audioURL, uint256 price);

    function addMusic(
        string memory _imageURL,
        string memory _audioURL,
        uint256 _price
    ) external {
        Music storage newMusic = musicList.push();
        newMusic.creator = msg.sender;
        newMusic.imageURL = _imageURL;
        newMusic.audioURL = _audioURL;
        newMusic.price = _price;

        emit MusicAdded(musicList.length - 1, msg.sender, _imageURL, _audioURL, _price);
    }

    function purchaseLicense(uint256 musicId) external payable {
        require(musicId < musicList.length, "Musique inexistante.");
        Music storage music = musicList[musicId];

        require(msg.value == music.price, "Montant incorrect.");
        require(!music.hasPurchased[msg.sender], "Deja achete.");

        music.hasPurchased[msg.sender] = true;
        payable(music.creator).transfer(msg.value);

        emit Purchased(msg.sender, musicId, msg.value);
    }

    function updateMetadata(
        uint256 musicId,
        string memory _imageURL,
        string memory _audioURL,
        uint256 _price
    ) external {
        require(musicId < musicList.length, "Musique inexistante.");
        Music storage music = musicList[musicId];

        require(msg.sender == music.creator, "Seul le createur peut modifier ceci.");

        music.imageURL = _imageURL;
        music.audioURL = _audioURL;
        music.price = _price;

        emit MetadataUpdated(musicId, _imageURL, _audioURL, _price);
    }

    function hasLicense(uint256 musicId, address user) external view returns (bool) {
        require(musicId < musicList.length, "Musique inexistante.");
        return musicList[musicId].hasPurchased[user];
    }

    function getMusicCount() external view returns (uint256) {
        return musicList.length;
    }

    function getMusic(uint256 musicId) external view returns (
        address creator,
        string memory imageURL,
        string memory audioURL,
        uint256 price
    ) {
        require(musicId < musicList.length, "Musique inexistante.");
        Music storage music = musicList[musicId];
        return (music.creator, music.imageURL, music.audioURL, music.price);
    }
}
