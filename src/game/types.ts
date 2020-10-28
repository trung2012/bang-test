export interface IGameState {
  deck: ICard[];
  cardsInPlay: ICard[][];
  discarded: ICard[];
  generalStore: ICard[];
  players: IGamePlayerMap;
  characters: ICharacter[];
  isSuddenDeathOn: boolean;
  currentReactionCardNeeded: CardName | null;
}

export interface IGamePlayerMap {
  [id: string]: IGamePlayer;
}
export interface IGamePlayer {
  id: string;
  hp: number;
  maxHp: number;
  playerName?: string;
  hand: ICard[];
  equipments: ICard[];
  character: ICharacter;
  role: Role;
  isDead: boolean;
  numBangsLeft: number;
  activeCard?: ICard;
  targetedCard?: ICard;
}

export interface ICard {
  id: string;
  name: CardName;
  value: number;
  suit: CardSuit;
  type: CardType;
  imageUrl: string;
  description?: string;
  needsReaction?: boolean;
  isTargeted?: boolean;
}

export type CardSuit = 'hearts' | 'spades' | 'diamond' | 'clubs';
export type CardType = 'action' | 'equipment' | 'targeted_equipment';
export interface ICharacter {
  name: CharacterName;
  hp: number;
  description: string;
  imageUrl: string;
}

export type Role = 'sheriff' | 'deputy' | 'outlaw' | 'renegade';

export type CharacterName =
  | 'bart cassidy'
  | 'black jack'
  | 'calamity janet'
  | 'el gringo'
  | 'jesse jones'
  | 'jourdonnais'
  | 'kit carlson'
  | 'lucky duke'
  | 'paul regret'
  | 'pedro ramirez'
  | 'rose doolan'
  | 'sid ketchum'
  | 'slab the killer'
  | 'suzy lafayette'
  | 'vulture sam'
  | 'willy the kid';

export type CardName =
  | 'barrel'
  | 'dynamite'
  | 'jail'
  | 'mustang'
  | 'remington'
  | 'rev carabine'
  | 'schofield'
  | 'scope'
  | 'volcanic'
  | 'winchester'
  | 'bang'
  | 'beer'
  | 'cat balou'
  | 'duel'
  | 'gatling'
  | 'general store'
  | 'indians'
  | 'missed'
  | 'panic'
  | 'saloon'
  | 'stagecoach'
  | 'wells fargo';

export interface ICardsToGenerate {
  [cardType: string]: ICardGenerationInfo[];
}

export interface ICardGenerationInfo {
  name: CardName;
  imageUrl: string;
  values: {
    [suit: string]: number[];
  };
}

export interface ILookup {
  [key: number]: any;
}
