pragma solidity ^0.4.11;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";

contract TestAdoption {
    Adoption adoption = Adoption(DeployedAddresses.Adoption());
    uint petId = 8;

    function testUserCanAdoptPet() {
        uint returnedId = adoption.adopt(petId);
        Assert.equal(returnedId, petId, "Adoption of pet ID 8 should be recorded.");
    }

    function testGetAdopterAddressByPetId() {
        // this = this contract (TestAdoption) address
        // turns out contract also has an address
        address expected = this;
        address adopter = adoption.adopters(petId);
        Assert.equal(adopter, expected, "Owner of pet ID 8 should be recorded.");
    }

    function testGetAdopterAddressByPetIdInArray() {
        address expected = this;
        address[16] memory addresses = adoption.getAdopters();
        Assert.equal(addresses[petId], expected, "Owner of pet ID 8 should be recorded.");
    }
}
