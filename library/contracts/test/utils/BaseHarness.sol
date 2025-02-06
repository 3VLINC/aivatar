// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import {Test, console} from 'forge-std/Test.sol';
import {AIvatar} from '../../src/patchwork/AIvatar.sol';
import {LibCommon} from '../../src/library/LibCommon.sol';
import {InitialDeployBase_0} from '../../script/utils/0_InitialDeployBase.sol';
import 'forge-std/console.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';
import '@patchwork/interfaces/IPatchworkProtocol.sol';

contract BaseHarness is IERC721Receiver, Test, InitialDeployBase_0 {
    uint256 AIVATAR_MINT_FEE = 0.0002 ether;

    address owner = makeAddr('owner');
    address user1 = makeAddr('user1');
    address user2 = makeAddr('user2');
    address agent = makeAddr('agent');

    function setUp() public virtual {
        setupUsers();

        patchwork = IPatchworkProtocol(vm.envAddress(ENV_PATCHWORK_ADDRESS));

        deploy();
    }

    function msgSender() internal view override returns (address) {
        return address(this);
    }

    function setupUsers() internal {
        console.log('owner address:', owner);
        console.log('user1 address:', user1);
        console.log('user2 address:', user2);
        vm.deal(owner, 1 ether);
        vm.deal(user1, 1 ether);
        vm.deal(user2, 1 ether);
    }

    function expectPatchworkNotAuthorized(address _user) internal {
        vm.expectRevert(
            abi.encodeWithSelector(
                IPatchworkProtocol.NotAuthorized.selector,
                _user
            )
        );
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    function getAdminAddress() internal override returns (address) {
        return makeAddr('owner');
    }

    function getAgentAddress() internal override returns (address) {
        return makeAddr('agent');
    }
}
