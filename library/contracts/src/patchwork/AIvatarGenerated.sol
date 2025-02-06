// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@patchwork/Patchwork721.sol";
import "@patchwork/interfaces/IPatchworkMintable.sol";

abstract contract AIvatarGenerated is Patchwork721, IPatchworkMintable {

    struct Metadata {
        uint8 expression;
    }

    uint256 internal _nextTokenId;

    constructor(address _manager, address _owner)
        Patchwork721("aivatar", "AIvatar", "AIVATAR", _manager, _owner)
    {}

    function schemaURI() pure external override returns (string memory) {
        return "https://aivatar.3vl.ca/erc721/AIVATAR/schema.json";
    }

    function imageURI(uint256 tokenId) pure external override returns (string memory) {
        return string.concat("https://aivatar.3vl.ca/erc721/AIVATAR/image/", Strings.toString(tokenId), ".svg");
    }

    function _baseURI() internal pure virtual override returns (string memory) {
        return "https://aivatar.3vl.ca/erc721/AIVATAR/";
    }

    function supportsInterface(bytes4 interfaceID) public view virtual override returns (bool) {
        return type(IPatchworkMintable).interfaceId == interfaceID ||
            super.supportsInterface(interfaceID);
    }

    function storeMetadata(uint256 tokenId, Metadata memory data) public {
        if (!_checkTokenWriteAuth(tokenId)) {
            revert IPatchworkProtocol.NotAuthorized(msg.sender);
        }
        _metadataStorage[tokenId] = packMetadata(data);
        emit MetadataUpdate(tokenId);
    }

    function loadMetadata(uint256 tokenId) public view returns (Metadata memory data) {
        return unpackMetadata(_metadataStorage[tokenId]);
    }

    function schema() pure external override returns (MetadataSchema memory) {
        MetadataSchemaEntry[] memory entries = new MetadataSchemaEntry[](1);
        entries[0] = MetadataSchemaEntry(0, 0, FieldType.UINT8, 1, FieldVisibility.PUBLIC, 0, 0, "expression");
        return MetadataSchema(1, entries);
    }

    function packMetadata(Metadata memory data) public pure returns (uint256[] memory slots) {
        slots = new uint256[](1);
        slots[0] = uint256(data.expression);
        return slots;
    }

    function unpackMetadata(uint256[] memory slots) public pure returns (Metadata memory data) {
        uint256 slot = slots[0];
        data.expression = uint8(slot);
        return data;
    }

    function mint(address to, bytes calldata data) public virtual payable returns (uint256 tokenId) {
        if (msg.sender != _manager) {
            return IPatchworkProtocol(_manager).mint{value: msg.value}(to, address(this), data);
        }
        return _mintSingle(to, data);
    }

    function mintBatch(address to, bytes calldata data, uint256 quantity) public virtual payable returns (uint256[] memory tokenIds) {
        if (msg.sender != _manager) {
            return IPatchworkProtocol(_manager).mintBatch{value: msg.value}(to, address(this), data, quantity);
        }
        tokenIds = new uint256[](quantity);
        for (uint256 i = 0; i < quantity; i++) {
            tokenIds[i] = _mintSingle(to, data);
        }
    }

    function _mintSingle(address to, bytes calldata /* data */) internal virtual returns (uint256) {
        uint256 tokenId = _nextTokenId;
        _metadataStorage[tokenId] = new uint256[](1);
        _nextTokenId++;
        _safeMint(to, tokenId);
        return tokenId;
    }

    // Load Only expression
    function loadExpression(uint256 tokenId) public view returns (uint8) {
        uint256 value = uint256(_metadataStorage[tokenId][0]);
        return uint8(value);
    }

    // Store Only expression
    function storeExpression(uint256 tokenId, uint8 expression) public {
        if (!_checkTokenWriteAuth(tokenId)) {
            revert IPatchworkProtocol.NotAuthorized(msg.sender);
        }
        uint256 mask = (1 << 8) - 1;
        uint256 cleared = uint256(_metadataStorage[tokenId][0]) & ~(mask);
        _metadataStorage[tokenId][0] = cleared | (uint256(expression) & mask);
        emit MetadataUpdate(tokenId);
    }
}