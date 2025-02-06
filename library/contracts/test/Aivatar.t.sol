// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import {Test, console} from 'forge-std/Test.sol';
import {BaseHarness} from './utils/BaseHarness.sol';
import {LibCommon} from '../src/library/LibCommon.sol';
import {AIvatar} from '../src/patchwork/AIvatar.sol';
import {AIvatarGenerated} from '../src/patchwork/AIvatarGenerated.sol';
import {IPatchworkProtocol} from '@patchwork/interfaces/IPatchworkProtocol.sol';

contract AivatarTest is BaseHarness {
    function test_ERC721Attributes() public view {
        assertEq(aivatar.getScopeName(), 'aivatar');
        assertEq(aivatar.symbol(), 'AIVATAR');
        assertEq(aivatar.name(), 'AIvatar');
    }

    function test_CorrectSchemaURI() public view {
        string memory schemaURI = aivatar.schemaURI();

        assertEq(
            schemaURI,
            'https://aivatar.3vl.ca/erc721/AIVATAR/schema.json'
        );
    }

    function test_CorrectImageURI() public view {
        string memory imageURI = aivatar.imageURI(0);

        assertEq(imageURI, 'https://aivatar.3vl.ca/erc721/AIVATAR/image/0.svg');
    }

    function test_CorrectTokenURI() public {
        vm.deal(user1, 0.5 ether);
        vm.prank(user1);
        aivatar.mint{value: AIVATAR_MINT_FEE}(user1, hex'');

        string memory tokenURI = aivatar.tokenURI(0);

        assertEq(
            tokenURI,
            'https://aivatar.3vl.ca/erc721/AIVATAR/token/0.json'
        );
    }

    function test_CorrectPermissionsOnMintMethod() public {
        vm.prank(owner);
        aivatar.mint{value: AIVATAR_MINT_FEE}(owner, hex'');

        uint256 num = aivatar.balanceOf(owner);

        assertEq(num, 1);

        vm.prank(user1);

        aivatar.mint{value: AIVATAR_MINT_FEE}(user1, hex'');

        num = aivatar.balanceOf(user1);

        assertEq(num, 1);
    }

    function test_CorrectPermissionsOnMintBatchMethod() public {
        vm.prank(owner);

        aivatar.mintBatch{value: AIVATAR_MINT_FEE * 2}(owner, hex'', 2);

        uint256 num = aivatar.balanceOf(owner);

        vm.prank(user1);
        assertEq(num, 2);

        aivatar.mintBatch{value: AIVATAR_MINT_FEE * 2}(user1, hex'', 2);

        num = aivatar.balanceOf(user1);

        assertEq(num, 2);
    }

    function test_StoreMetadata() public {
        vm.deal(agent, 0.5 ether);
        vm.deal(user1, 0.5 ether);

        vm.startPrank(user1);

        uint256 targetTokenId = aivatar.mint{value: AIVATAR_MINT_FEE}(
            user1,
            hex''
        );

        vm.startPrank(owner);
        aivatar.storeExpression(
            targetTokenId,
            uint8(LibCommon.Expression.ANGER)
        );

        uint8 expression1 = aivatar.loadExpression(targetTokenId);

        assertEq(expression1, uint8(LibCommon.Expression.ANGER));

        aivatar.storeMetadata(
            targetTokenId,
            AIvatarGenerated.Metadata(uint8(LibCommon.Expression.SADNESS))
        );

        uint8 expression2 = aivatar.loadExpression(targetTokenId);

        assertEq(expression2, uint8(LibCommon.Expression.SADNESS));

        vm.stopPrank();

        vm.startPrank(user1);
        vm.expectRevert(
            abi.encodeWithSelector(
                IPatchworkProtocol.NotAuthorized.selector,
                user1
            )
        );
        aivatar.storeMetadata(
            targetTokenId,
            AIvatarGenerated.Metadata(uint8(LibCommon.Expression.JOY))
        );

        vm.startPrank(user1);
        vm.expectRevert(
            abi.encodeWithSelector(
                IPatchworkProtocol.NotAuthorized.selector,
                user1
            )
        );
        aivatar.storeExpression(
            targetTokenId,
            uint8(LibCommon.Expression.ANGER)
        );
    }

    function test_AgenticUpdate() public {
        vm.deal(agent, 0.5 ether);
        vm.deal(user1, 0.5 ether);

        vm.startPrank(user1);
        uint256 targetTokenId = aivatar.mint{value: AIVATAR_MINT_FEE}(
            user1,
            hex''
        );

        vm.startPrank(agent);
        aivatar.agenticUpdate(targetTokenId, uint8(LibCommon.Expression.JOY));

        uint8 expression = aivatar.loadExpression(targetTokenId);
        assertEq(expression, uint8(LibCommon.Expression.JOY));

        vm.stopPrank();

        vm.startPrank(user1);
        vm.expectRevert(
            abi.encodeWithSelector(
                IPatchworkProtocol.NotAuthorized.selector,
                user1
            )
        );
        aivatar.agenticUpdate(targetTokenId, uint8(LibCommon.Expression.ANGER));
    }

    function test_SetAgent() public {
        address newAgent = address(0x123);

        // Test setting agent by owner
        vm.prank(owner);
        aivatar.setAgent(newAgent);
        assertEq(aivatar.agent(), newAgent);

        // Test setting agent by non-owner
        vm.prank(user1);
        vm.expectRevert(
            abi.encodeWithSelector(
                IPatchworkProtocol.NotAuthorized.selector,
                user1
            )
        );
        aivatar.setAgent(newAgent);
    }
}
