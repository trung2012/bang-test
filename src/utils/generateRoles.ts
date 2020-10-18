import { roleLookup } from '../game/constants';

export const generateRoles = (roleCount: number[]) => {
  const roles: string[] = [];

  roleCount.forEach((characterCount, index) => {
    const roleName = roleLookup[index];

    for (let c = 1; c <= characterCount; c++) {
      roles.push(roleName);
    }
  });

  return roles;
};
