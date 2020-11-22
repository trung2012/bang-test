import { Ctx } from 'boardgame.io/dist/types/src/types';
import { randomRotationValue } from '../utils';
import { generateRoles } from '../utils/generateRoles';
import { cards } from './cards';
import { characters, gameRolesByNumPlayers } from './constants';
import { ICard, ICharacter, IGamePlayer, IGamePlayerMap, IGameState, Role } from './types';

const setup = (ctx: Ctx) => {
  const roles = generateRoles(gameRolesByNumPlayers[ctx.numPlayers]);
  const cardsShuffled = ctx.random!.Shuffle(cards);
  const deck: ICard[] = cardsShuffled.map(card => ({
    ...card,
    rotationValue: randomRotationValue(),
  }));

  const rolesShuffled = ctx.random!.Shuffle(roles);
  const charactersShuffled = ctx.random!.Shuffle(characters);
  const discarded: ICard[] = [];
  const generalStore: ICard[] = [];
  const players: IGamePlayerMap = {};
  const playOrder: string[] = [];
  const reactionRequired = {
    cardNeeded: null,
    quantity: 1,
  };
  const activeStage = null;

  // Create players
  for (const playerId of ctx.playOrder) {
    const playerRole = rolesShuffled.pop() as Role;
    const playerCharacter = charactersShuffled.pop() as ICharacter;
    const hand: ICard[] = [];
    const equipments: ICard[] = [];

    const player: IGamePlayer = {
      id: playerId,
      hp: playerRole === 'sheriff' ? playerCharacter.hp + 1 : playerCharacter.hp,
      maxHp: playerRole === 'sheriff' ? playerCharacter.hp + 1 : playerCharacter.hp,
      hand,
      equipments,
      character: playerCharacter,
      role: playerRole,
      gunRange: playerCharacter.name === 'rose doolan' ? 2 : 1,
      actionRange: playerCharacter.name === 'rose doolan' ? 2 : 1,
      cardsInPlay: [],
      secretCards: [],
      numBangsLeft: playerCharacter.name === 'willy the kid' ? 9999 : 1,
      barrelUseLeft: 1,
      cardDiscardedThisTurn: 0,
      cardDrawnAtStartLeft:
        playerCharacter.name === 'black jack' || playerCharacter.name === 'kit carlson' ? 3 : 2,
    };

    for (let hp = 1; hp <= player.hp; hp++) {
      player.hand.push(deck.pop() as ICard);
    }

    players[playerId] = player;
    playOrder.push(playerId);
  }

  return {
    deck,
    discarded,
    players,
    generalStore,
    isSuddenDeathOn: false,
    activeStage,
    reactionRequired,
    playOrder,
  } as IGameState;
};

export default setup;
