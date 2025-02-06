// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import {Test, console} from 'forge-std/Test.sol';
import {BaseHarness} from './utils/BaseHarness.sol';
import {LibCommon} from '../src/library/LibCommon.sol';

contract PatchworkOperationsTest is BaseHarness {
    function test_CanWithdrawFundsFromProtocol() public {
        vm.prank(user1);

        aivatar.mint{value: AIVATAR_MINT_FEE}(user1, hex'');

        uint256 balance = patchwork.balanceOf(LibCommon.SCOPE);

        assertEq(balance, AIVATAR_MINT_FEE);

        uint256 ownerBalance = owner.balance;

        vm.prank(owner);

        patchwork.withdraw(LibCommon.SCOPE, AIVATAR_MINT_FEE);

        assertEq(owner.balance, AIVATAR_MINT_FEE + ownerBalance);
    }

    function test_CanAcceptOwnershipTransfer() public {
        address adminAddress = getAdminAddress();

        vm.prank(adminAddress);
        patchwork.acceptScopeTransfer(LibCommon.SCOPE);
        address newOwner = patchwork.getScopeOwner(LibCommon.SCOPE);
        assertEq(adminAddress, newOwner);
    }
}
