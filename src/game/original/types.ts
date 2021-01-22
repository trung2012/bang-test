import { CardNameExpansion } from '../expansions';
import { ExpansionName } from './config';

export interface IGameState {
  deck: ICard[];
  discarded: ICard[];
  generalStore: ICard[];
  reactingOrder: string[];
  players: IGamePlayerMap;
  playOrder: string[];
  characters: ICharacter[];
  reactionRequired: {
    sourcePlayerId: string | null;
    quantity: number;
    moveToPlayAfterDiscard?: CardName | null;
    moveArgs?: any[];
  };
  expansions: ExpansionName[];
  savedState?: {
    savedPlayerId: string;
    savingPlayerId?: string;
    previousStages: { [key: string]: string } | null;
  };
}

export interface IGamePlayerMap {
  [id: string]: IGamePlayer;
}
export interface IGamePlayer {
  id: string;
  hp: number;
  maxHp: number;
  name?: string;
  hand: ICard[];
  equipments: ICard[];
  equipmentsGreen: ICard[];
  character: ICharacter;
  gunRange: number;
  actionRange: number;
  role: Role;
  numBangsLeft: number;
  cardsInPlay: ICard[];
  secretCards: ICard[];
  cardDiscardedThisTurn: number;
  cardDrawnAtStartLeft: number;
  targetedCard?: ICard;
  barrelUseLeft: number;
  jourdonnaisPowerUseLeft: number;
  mollyStarkCardsPlayed: number;
  originalCharacter?: ICharacter;
}

export interface ICard {
  id: string;
  name: CardName;
  value: number;
  suit: CardSuit;
  type: CardType;
  imageUrl: string;
  description?: string;
  needsDiscard?: boolean;
  isTargeted?: boolean;
  rotationValue?: number;
  playWithBang?: boolean;
  timer?: number;
}

export type CardSuit = 'hearts' | 'spades' | 'diamond' | 'clubs';
export type CardType = 'action' | 'equipment' | 'green';
export interface ICharacter {
  name: CharacterName;
  realName?: 'vera custer';
  hp: number;
  description: string;
  imageUrl: string;
  hasActivePower?: boolean;
  activePowerUsesLeft?: number;
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
  | 'willy the kid'
  | 'black flower'
  | 'colorado bill'
  | 'der spot - burst ringer'
  | 'evelyn shebang'
  | 'henry block'
  | 'lemonade jim'
  | 'mick defender'
  | 'tuco franziskaner'
  | 'belle star'
  | 'bill noface'
  | 'chuck wengam'
  | 'doc holyday'
  | 'elena fuente'
  | 'greg digger'
  | 'herb hunter'
  | 'jose delgado'
  | 'molly stark'
  | 'pat brennan'
  | 'pixie pete'
  | 'sean mallory'
  | 'tequila joe'
  | 'vera custer'
  | 'apache kid';

export type CardName = CardNameOriginal | CardNameExpansion;

export type CardNameOriginal =
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
  timer?: number;
  needsDiscard?: boolean;
  values: {
    [suit in CardSuit]?: number[];
  };
}

export interface ILookup {
  [key: number]: any;
}

export type RobbingType = 'hand' | 'equipment' | 'green';

export interface IGameResult {
  winners: IGamePlayer[];
  team: string;
}
