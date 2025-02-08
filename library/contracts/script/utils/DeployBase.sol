// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import 'forge-std/Script.sol';
import '@patchwork/PatchworkProtocol.sol';
import '@patchwork/interfaces/IPatchworkProtocol.sol';
import 'forge-std/Vm.sol';
import 'forge-std/console.sol';
import {AIvatar} from '../../src/patchwork/AIvatar.sol';

contract DeployBase is Script {
    string constant SCOPE = 'aivatar';

    string constant ENV_ADMIN_ADDRESS = 'ADMIN_ADDRESS';
    string constant ENV_PATCHWORK_ADDRESS = 'PATCHWORK_ADDRESS';
    string constant ENV_AIVATAR_ADDRESS = 'AIVATAR_ADDRESS';
    string constant ENV_AGENT_ADDRESS = 'AGENT_ADDRESS';

    IPatchworkProtocol patchwork;
    AIvatar aivatar;

    constructor() {
        patchwork = IPatchworkProtocol(vm.envAddress(ENV_PATCHWORK_ADDRESS));
    }

    function loadDeployed() public {
        aivatar = AIvatar(vm.envAddress(ENV_AIVATAR_ADDRESS));
    }

    function msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function patchworkAddress() internal view returns (address) {
        return vm.envAddress(ENV_PATCHWORK_ADDRESS);
    }

    function getAdminAddress() internal virtual returns (address) {
        return vm.envAddress(ENV_ADMIN_ADDRESS);
    }

    function getAgentAddress() internal virtual returns (address) {
        return vm.envAddress(ENV_AGENT_ADDRESS);
    }
}
