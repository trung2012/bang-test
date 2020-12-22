export interface ISetupData {
  expansions: ExpansionName[];
  previousGamePlayers?: IPreviousGamePlayers;
}

export interface IPreviousGamePlayers {
  [key: string]: string;
}

export type ExpansionName = 'valley of shadows' | 'dodge city';
