import { ExpansionName } from './config';
import { CardName, ICharacter, ILookup } from './types';

export const cardVal = {
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
  10: 'ten',
  11: 'jack',
  12: 'queen',
  13: 'king',
  14: 'ace',
};

export const characters: ICharacter[] = [
  {
    name: 'bart cassidy',
    hp: 4,
    description: 'Each time he loses a life point, he immediately draws a card from the deck.',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/bartcassidy_ouhp6h.png',
  },
  {
    name: 'black jack',
    hp: 4,
    description:
      'During phase 1 of his turn, he must show the second card he draws: if it’s Heart or Diamonds (just like a “draw!”), he draws one additional card (without revealing it).',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/blackjack_cgpncq.png',
  },
  {
    name: 'calamity janet',
    hp: 4,
    description:
      'She can use BANG! cards as Missed! cards and vice versa. If she plays a Missed! as a BANG! , she cannot play another BANG! card that turn (unless she has a Volcanic in play).',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/calamityjanet_tfl8jr.png',
  },
  {
    name: 'el gringo',
    hp: 3,
    description:
      'Each time he loses a life point due to a card played by another player, he draws a random card from the hands of that player (one card for each life point). If that player has no more cards, too bad!, he does not draw. Note that Dynamite damages are not caused by any player.',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/elgringo_qql1r7.png',
  },
  {
    name: 'jesse jones',
    hp: 4,
    description:
      'During phase 1 of his turn, he may choose to draw the first card from the deck, or randomly from the hand of any other player. Then he draws the second card from the deck.',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/jessejones_wb46wp.png',
  },
  {
    name: 'jourdonnais',
    hp: 4,
    description:
      'He is considered to have a Barrel in play at all times; he can “draw!” when he is the target of a BANG! , and on a Heart he is missed. If he has another real Barrel card in play, he can count both of them, giving him two chances to cancel the BANG! before playing a Missed! .',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/jourdonnais_znr8vy.png',
    hasActivePower: true,
  },
  {
    name: 'kit carlson',
    hp: 4,
    description:
      'During phase 1 of his turn, he looks at the top three cards of the deck: he chooses 2 to draw, and puts the other one back on the top of the deck, face down.',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/kitcarlson_a9jhr2.png',
  },
  {
    name: 'lucky duke',
    hp: 4,
    description:
      'Each time he is required to “draw!”, he flips the top two cards from the deck, and chooses the result he prefers. Discard both cards afterwards.',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/luckyduke_rq6oly.png',
  },
  {
    name: 'paul regret',
    hp: 3,
    description:
      'He is considered to have a Mustang in play at all times; all other players must add 1 to the distance to him. If he has another real Mustang in play, he can count both of them, increasing all distances to him by a total of 2.',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/paulregret_qxlr6x.png',
  },
  {
    name: 'pedro ramirez',
    hp: 4,
    description:
      'During phase 1 of his turn, he may choose to draw the first card from the top of the discard pile or from the deck. Then, he draws the second card from the deck.',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/pedroramirez_ygknav.png',
  },
  {
    name: 'rose doolan',
    hp: 4,
    description:
      'She is considered to have a Scope in play at all times; she sees the other players at a distance decreased by 1. If she has another real Scope in play, she can count both of them, reducing her distance to all other players by a total of 2.',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/rosedoolan_m26vr9.png',
  },
  {
    name: 'sid ketchum',
    hp: 4,
    description:
      'At any time, he may discard 2 cards from his hand to regain one life point. If he is willing and able, he can use this ability more than once at a time. But remember: you cannot have more life points than your starting amount!',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/sidketchum_o4uwhe.png',
  },
  {
    name: 'slab the killer',
    hp: 4,
    description:
      'Players trying to cancel his BANG! cards need to play 2 Missed!. The Barrel effect, if successfully used, only counts as one Missed! .',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/slab_fwl52n.png',
  },
  {
    name: 'suzy lafayette',
    hp: 4,
    description: 'As soon as she has no cards in her hand, she draws a card from the draw pile.',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/suzylafayette_nxju4w.png',
  },
  {
    name: 'vulture sam',
    hp: 4,
    description:
      'Whenever a character is eliminated from the game, Sam takes all the cards that player had in his hand and in play, and adds them to his hand.',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/vulturesam_yqdj2y.png',
  },
  {
    name: 'willy the kid',
    hp: 4,
    description: 'He can play any number of BANG! cards during his turn',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/willythekid_avzxon.png',
  },
];

export enum RoleOrder {
  sheriff,
  renegade,
  outlaws,
  deputy,
}

export const gameRolesByNumPlayers: ILookup = {
  // number of [sheriff, renegade, outlaws, deputy]
  2: [1, 1, 0, 0],
  4: [1, 1, 2, 0],
  5: [1, 1, 2, 1],
  6: [1, 1, 3, 1],
  7: [1, 1, 3, 2],
  8: [1, 2, 3, 2],
};

export const roleLookup: ILookup = {
  0: 'sheriff',
  1: 'renegade',
  2: 'outlaw',
  3: 'deputy',
};

export const gameNames = {
  bang: 'bang',
};

export enum stageNames {
  clearCardsInPlay = 'clearCardsInPlay',
  drawToReact = 'drawToReact',
  pickFromGeneralStore = 'pickFromGeneralStore',
  duel = 'duel',
  reactToGatling = 'reactToGatling',
  reactToIndians = 'reactToIndians',
  reactToBang = 'reactToBang',
  takeCardFromHand = 'takeCardFromHand',
  kitCarlsonDiscard = 'kitCarlsonDiscard',
  discard = 'discard',
  play = 'play',
  discardToPlayCard = 'discardToPlayCard',
  ragtime = 'ragtime',
  copyCharacter = 'copyCharacter',
  joseDelgadoDiscard = 'joseDelgadoDiscard',
  bandidos = 'bandidos',
  fanning = 'fanning',
  tornado = 'tornado',
  reactToBangWithoutBang = 'reactToBangWithoutBang',
  poker = 'poker',
  pickCardForPoker = 'pickCardForPoker',
  lemat = 'lemat',
  saved = 'saved',
}

export const stagesReactingToBullets = [
  stageNames.duel,
  stageNames.reactToBang,
  stageNames.reactToGatling,
  stageNames.reactToIndians,
  stageNames.bandidos,
  stageNames.reactToBangWithoutBang,
];

export const gunRange: { [gunName: string]: number } = {
  remington: 3,
  'rev carabine': 4,
  schofield: 2,
  volcanic: 1,
  winchester: 5,
  lemat: 1,
  shotgun: 1,
};

export const delayBetweenActions = 2000;
export const animationDelayMilliseconds = 900;
export const animationDelaySeconds = animationDelayMilliseconds / 1000;

export const cardsWhichTargetCards: CardName[] = ['cat balou', 'panic', 'can can', 'conestoga'];

export const cardsThatCanTargetsSelf: CardName[] = ['tequila'];

export const cardsWithNoRangeLimit: CardName[] = [
  'cat balou',
  'can can',
  'conestoga',
  'buffalo rifle',
];

export const cardsThatWorkAgainstBang: CardName[] = [
  'missed',
  'dodge',
  'bible',
  'iron plate',
  'sombrero',
  'ten gallon hat',
  'backfire',
];

export const stageNameToRequiredCardsMap: {
  [key in stageNames]?: CardName[];
} = {
  reactToGatling: [...cardsThatWorkAgainstBang, 'escape'],
  reactToIndians: ['bang', 'escape'],
  reactToBang: cardsThatWorkAgainstBang,
  duel: ['bang', 'escape'],
  reactToBangWithoutBang: [...cardsThatWorkAgainstBang, 'escape'],
};

export const teamLookUp = {
  sheriff: 'The Lawful',
  deputy: 'The Lawful',
  outlaw: 'The Outlaws',
  renegade: 'The Renegade',
};

export const roleImageSrcLookup = {
  sheriff:
    'https://res.cloudinary.com/trungpham/image/upload/v1602888951/bang/original/sceriffo_iy1c7f.png',
  deputy:
    'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/vice_kytkwh.png',
  outlaw:
    'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/fuorilegge_fvpfpp.png',
  renegade:
    'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/rinnegato_snqmce.png',
};

export const bangExpansions: ExpansionName[] = ['valley of shadows', 'dodge city'];

export const bangNumPlayers = [2, 4, 5, 6, 7, 8];
