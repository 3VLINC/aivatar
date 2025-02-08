// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import 'forge-std/Script.sol';
import '@patchwork/PatchworkProtocol.sol';
import '@patchwork/interfaces/IPatchworkProtocol.sol';
import 'forge-std/Vm.sol';
import 'forge-std/console.sol';
import {ChangeMintFeeBase_1} from './utils/1_ChangeMintFeeBase.sol';

contract ChangeMintFee_1 is ChangeMintFeeBase_1 {
    function msgSender() internal view override returns (address) {
        return msg.sender;
    }

    function run() public {
        vm.startBroadcast();

        console.log('Deploying as:', msgSender());

        console.log('This address has', msgSender().balance);

        loadDeployed();
        deploy();

        vm.stopBroadcast();
    }
}
