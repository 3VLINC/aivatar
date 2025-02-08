// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import 'forge-std/Script.sol';
import '@patchwork/PatchworkProtocol.sol';
import '@patchwork/interfaces/IPatchworkProtocol.sol';
import {Vm} from 'forge-std/Vm.sol';
import 'forge-std/console.sol';
import {DeployBase} from './DeployBase.sol';

contract ChangeMintFeeBase_1 is DeployBase {
    function deploy() public {
        patchwork.setMintConfiguration(
            address(aivatar),
            IPatchworkProtocol.MintConfig(0 ether, true)
        );
    }
}
