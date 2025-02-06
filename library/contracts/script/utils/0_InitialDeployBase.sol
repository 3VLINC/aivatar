// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import 'forge-std/Script.sol';
import '@patchwork/PatchworkProtocol.sol';
import '@patchwork/interfaces/IPatchworkProtocol.sol';
import {Vm} from 'forge-std/Vm.sol';
import 'forge-std/console.sol';
import {AIvatar} from '../../src/patchwork/AIvatar.sol';
import {DeployBase} from './DeployBase.sol';
import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';

contract InitialDeployBase_0 is DeployBase {
    string constant SCOPE = 'aivatar';

    function deploy() public {
        aivatar = new AIvatar(
            patchworkAddress(),
            msgSender(),
            getAgentAddress()
        );

        address scopeOwner = patchwork.getScopeOwner(SCOPE);

        if (scopeOwner == address(0)) {
            patchwork.claimScope(SCOPE);
        } else {
            if (msgSender() != scopeOwner) {
                revert('Scope is claimed by someone else');
            }
        }

        // Setup scope
        patchwork.addBanker(SCOPE, getAdminAddress());
        patchwork.addOperator(SCOPE, getAdminAddress());
        patchwork.addOperator(SCOPE, getAgentAddress());
        patchwork.setScopeRules(SCOPE, true, true, true);

        // Setup aivatar
        patchwork.addWhitelist(SCOPE, address(aivatar));
        patchwork.setMintConfiguration(
            address(aivatar),
            IPatchworkProtocol.MintConfig(0.0002 ether, true)
        );

        Ownable(address(aivatar)).transferOwnership(getAdminAddress());

        patchwork.transferScopeOwnership(SCOPE, getAdminAddress());
    }
}
