// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.6.9;

contract Lottery {
    address public manager;
    address payable[] public players;

    constructor() public {
        manager = msg.sender;
    }

    function enter() public payable {
        require(
            msg.value >= .01 ether,
            "At least 0.01 ether is required to enter the lottery!"
        );

        players.push(msg.sender);
    }

    function random() private view returns (uint256) {
        return
            uint256(
                keccak256(abi.encodePacked(block.difficulty, now, players))
            );
    }

    function pickWiner() public restricted {
        uint256 i = random() % players.length;
        players[i].transfer(address(this).balance);
        players = new address payable[](0);
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    modifier restricted() {
        require(
            msg.sender == manager,
            "You are not authorized to perform this action!"
        );
        _;
    }
}
