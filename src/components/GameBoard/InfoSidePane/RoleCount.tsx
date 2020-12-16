import React from 'react';
import classnames from 'classnames';
import { InfoSidePaneClassnames } from './InfoSidePane';
import { useGameContext } from '../../../context';
import { gameRolesByNumPlayers, RoleOrder } from '../../../game';

interface IRoleCount {
  isSidePaneOpened: boolean;
}

export const RoleCount: React.FC<IRoleCount> = ({ isSidePaneOpened }) => {
  const { ctx } = useGameContext();
  const roleCount = gameRolesByNumPlayers[ctx.playOrder.length];
  const deputyCount = roleCount[RoleOrder.deputy];
  const outlawsCount = roleCount[RoleOrder.outlaws];
  const renegadeCount = roleCount[RoleOrder.renegade];

  return (
    <div
      className={classnames({
        [`${InfoSidePaneClassnames.root}-section`]: !isSidePaneOpened,
        [`${InfoSidePaneClassnames.active}-section`]: isSidePaneOpened,
      })}
    >
      <h3>Roles in this game </h3>
      {deputyCount > 0 && (
        <p>
          <span>{deputyCount}</span> {deputyCount > 1 ? 'deputies' : 'deputy'}
        </p>
      )}
      {outlawsCount > 0 && (
        <p>
          <span>{outlawsCount}</span> {outlawsCount > 1 ? 'outlaws' : 'outlaw'}
        </p>
      )}
      {renegadeCount > 0 && (
        <p>
          <span>{renegadeCount}</span> {renegadeCount > 1 ? 'renegades' : 'renegade'}
        </p>
      )}
    </div>
  );
};
