// test/CopyrightNFT1155.test.js

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CopyrightNFT1155", function () {
    let CopyrightNFT1155;
    let copyrightNFT;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        const baseUri = "https://monserveur.com/api/token/{id}.json";
        CopyrightNFT1155 = await ethers.getContractFactory("CopyrightNFT1155");
        copyrightNFT = await CopyrightNFT1155.deploy(baseUri);
    });

    describe("Deployment", function () {
        it("should set the right owner", async function () {
            expect(await copyrightNFT.owner()).to.equal(owner.address);
        });

        it("should set the correct base URI", async function () {
            expect(await copyrightNFT.uri(1)).to.equal("https://monserveur.com/api/token/{id}.json");
        });
    });

    describe("Creating Music", function () {
        it("should create a new music token", async function () {
            await copyrightNFT.createMusic(1, 100, "Song Title", "0x");
            expect(await copyrightNFT.creator(1)).to.equal(owner.address);
            expect(await copyrightNFT.musicTitles(1)).to.equal("Song Title");
        });

        it("should revert if the token ID already exists", async function () {
            await copyrightNFT.createMusic(1, 100, "Song Title", "0x");
            await expect(copyrightNFT.createMusic(1, 100, "Another Title", "0x"))
                .to.be.revertedWith("Les droits sur cette oeuvre existent deja");
        });
    });

    describe("Minting Additional Copies", function () {
        beforeEach(async function () {
            await copyrightNFT.createMusic(1, 100, "Song Title", "0x");
        });

        it("should mint additional copies for the creator", async function () {
            await copyrightNFT.mintAdditionalCopies(addr1.address, 1, 50, "0x");
            expect(await copyrightNFT.balanceOf(addr1.address, 1)).to.equal(50);
        });

        it("should revert if a non-creator tries to mint additional copies", async function () {
            await expect(copyrightNFT.connect(addr1).mintAdditionalCopies(addr1.address, 1, 50, "0x"))
                .to.be.revertedWith("Vous n'etes pas le createur de cette oeuvre");
        });
    });
});