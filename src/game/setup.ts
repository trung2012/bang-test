import { Ctx } from 'boardgame.io/dist/types/src/types';
import { generateRoles } from '../utils/generateRoles';
import { cards } from './cards';
import { characters, gameRolesByNumPlayers } from './constants';
import { ICard, ICharacter, IGamePlayer, IGamePlayerMap, IGameState, Role } from './types';

const setup = (ctx: Ctx) => {
  const roles = generateRoles(gameRolesByNumPlayers[ctx.numPlayers]);
  const deck = ctx.random!.Shuffle(cards);
  const rolesShuffled = ctx.random!.Shuffle(roles);
  const charactersShuffled = ctx.random!.Shuffle(characters);
  const discarded: ICard[] = [];
  const cardsInPlay: ICard[][] = Array(ctx.numPlayers).fill([]);
  const generalStore: ICard[] = [];
  const players: IGamePlayerMap = {};
  const playersOrder: string[] = [];
  const currentReactionCardNeeded = null;

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
      isDead: false,
      numBangsLeft: 1,
    };

    for (let hp = 1; hp <= player.hp; hp++) {
      player.hand.push(deck.pop() as ICard);
    }

    players[playerId] = player;
    playersOrder.push(playerId);
  }

  return {
    deck,
    discarded,
    players,
    generalStore,
    cardsInPlay,
    isSuddenDeathOn: false,
    currentReactionCardNeeded,
  } as IGameState;
};

export default setup;
