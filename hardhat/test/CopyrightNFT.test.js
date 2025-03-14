const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CopyrightNFT", function () {
    let CopyrightNFT;
    let copyrightNFT;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        CopyrightNFT = await ethers.getContractFactory("CopyrightNFT");
        [owner, addr1, addr2] = await ethers.getSigners();
        copyrightNFT = await CopyrightNFT.deploy();
    });

    describe("addMusic", function () {
        it("should add music correctly", async function () {
            await copyrightNFT.addMusic("Song 1", "image1.png", "audio1.mp3", ethers.parseEther("1"));
            const music = await copyrightNFT.getMusic(1);
            expect(music.name).to.equal("Song 1");
            expect(music.price).to.equal(ethers.parseEther("1"));
        });
    });

    describe("purchaseLicense", function () {
        it("should allow a user to purchase a music license", async function () {
            await copyrightNFT.addMusic("Song 1", "image1.png", "audio1.mp3", ethers.parseEther("1"));
            await copyrightNFT.connect(addr1).purchaseLicense(1, { value: ethers.parseEther("1") });
            expect(await copyrightNFT.hasLicense(1, addr1.address)).to.be.true;
        });

        it("should revert if the wrong amount is sent", async function () {
            await copyrightNFT.addMusic("Song 1", "image1.png", "audio1.mp3", ethers.parseEther("1"));
            await expect(copyrightNFT.connect(addr1).purchaseLicense(1, { value: ethers.parseEther("0.5") }))
                .to.be.revertedWith("Montant incorrect.");
        });

        it("should revert if the music has already been purchased", async function () {
            await copyrightNFT.addMusic("Song 1", "image1.png", "audio1.mp3", ethers.parseEther("1"));
            await copyrightNFT.connect(addr1).purchaseLicense(1, { value: ethers.parseEther("1") });
            await expect(copyrightNFT.connect(addr1).purchaseLicense(1, { value: ethers.parseEther("1") }))
                .to.be.revertedWith("Deja achete.");
        });
    });

    describe("updateMetadata", function () {
        it("should allow the creator to update music metadata", async function () {
            await copyrightNFT.addMusic("Song 1", "image1.png", "audio1.mp3", ethers.parseEther("1"));
            await copyrightNFT.updateMetadata(1, "Updated Song", "updated_image.png", "updated_audio.mp3", ethers.parseEther("2"));
            const music = await copyrightNFT.getMusic(1);
            expect(music.name).to.equal("Updated Song");
            expect(music.price).to.equal(ethers.parseEther("2"));
        });

        it("should revert if a non-creator tries to update metadata", async function () {
            await copyrightNFT.addMusic("Song 1", "image1.png", "audio1.mp3", ethers.parseEther("1"));
            await expect(copyrightNFT.connect(addr1).updateMetadata(1, "Updated Song", "updated_image.png", "updated_audio.mp3", ethers.parseEther("2")))
                .to.be.revertedWith("Seul le createur peut modifier ceci.");
        });
    });
});