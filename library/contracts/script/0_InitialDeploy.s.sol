// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import 'forge-std/Script.sol';
import '@patchwork/PatchworkProtocol.sol';
import '@patchwork/interfaces/IPatchworkProtocol.sol';
import 'forge-std/Vm.sol';
import 'forge-std/console.sol';
import {InitialDeployBase_0} from './utils/0_InitialDeployBase.sol';

contract InitialDeploy_0 is InitialDeployBase_0 {

    function msgSender() internal view override returns (address) {
        return msg.sender;
    }

    function run() public {
        vm.startBroadcast();

        console.log('Deploying as:', msgSender());

        console.log('This address has', msgSender().balance);

        deploy();

        console.log('Deployed aivatar at:', address(aivatar));

        vm.stopBroadcast();
    }
}
