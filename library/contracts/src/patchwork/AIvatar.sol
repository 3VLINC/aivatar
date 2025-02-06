// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import './AIvatarGenerated.sol';

contract AIvatar is AIvatarGenerated {
    address public agent;

    error NotAuthorized(address sender);

    constructor(
        address _manager,
        address _owner,
        address _agent
    ) AIvatarGenerated(_manager, _owner) {
        agent = _agent;
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        return
            string.concat(
                _baseURI(),
                'token/',
                Strings.toString(tokenId),
                '.json'
            );
    }

    function agenticUpdate(uint256 tokenId, uint8 expression) public {
        if (msg.sender != agent) {
            revert NotAuthorized(msg.sender);
        }
        uint256 mask = (1 << 8) - 1;
        uint256 cleared = uint256(_metadataStorage[tokenId][0]) & ~(mask);
        _metadataStorage[tokenId][0] = cleared | (uint256(expression) & mask);
        emit MetadataUpdate(tokenId);
    }

    function setAgent(address newAgent) public {
        if (msg.sender != owner()) {
            revert NotAuthorized(msg.sender);
        }
        agent = newAgent;
    }
}
