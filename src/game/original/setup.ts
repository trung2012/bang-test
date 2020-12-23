import { Ctx } from 'boardgame.io/dist/types/src/types';
import { randomRotationValue } from '../../utils';
import { generateRoles } from '../../utils/generateRoles';
import { cards, cardsFor8 } from './cards';
import { ISetupData } from './config';
import { characters, gameRolesByNumPlayers } from './constants';
import {
  CardName,
  ICard,
  ICharacter,
  IGamePlayer,
  IGamePlayerMap,
  IGameState,
  Role,
} from './types';
import { addExpansionCards, addExpansionCharacters } from './utils';

const setup = (ctx: Ctx, setupData: ISetupData) => {
  const expansions = setupData?.expansions ?? [];
  const roles = generateRoles(gameRolesByNumPlayers[ctx.numPlayers]);

  let gameCards = [...cards];
  if (expansions.length === 0 && ctx.playOrder.length === 8) {
    gameCards.push(...cardsFor8);
  }

  gameCards = addExpansionCards(gameCards, expansions);

  let gameCharacters = addExpansionCharacters(characters, expansions);

  const cardsShuffled = ctx.random?.Shuffle ? ctx.random.Shuffle(gameCards) : gameCards;
  const deck: ICard[] = cardsShuffled.map(card => ({
    ...card,
    rotationValue: randomRotationValue(),
  }));

  const rolesShuffled = ctx.random?.Shuffle ? ctx.random.Shuffle(roles) : roles;
  const charactersShuffled = ctx.random?.Shuffle
    ? ctx.random.Shuffle(gameCharacters)
    : gameCharacters;
  const discarded: ICard[] = [];
  const generalStore: ICard[] = [];
  const generalStoreOrder: string[] = [];
  const players: IGamePlayerMap = {};
  const playOrder: string[] = [];
  const reactionRequired = {
    cardNeeded: [] as CardName[],
    quantity: 1,
    cardToPlayAfterDiscard: null,
  };
  const activeStage = null;
  let sidKetchumId: string | null = null;

  console.log(charactersShuffled.length);
  // Create players
  for (const playerId of ctx.playOrder) {
    const playerRole = rolesShuffled.pop() as Role;
    const playerCharacter = charactersShuffled.pop() as ICharacter;
    const hand: ICard[] = [];
    const equipments: ICard[] = [];

    const player: IGamePlayer = {
      id: playerId,
      name: setupData?.previousGamePlayers ? setupData.previousGamePlayers[playerId] : undefined,
      hp: playerRole === 'sheriff' ? playerCharacter.hp + 1 : playerCharacter.hp,
      maxHp: playerRole === 'sheriff' ? playerCharacter.hp + 1 : playerCharacter.hp,
      hand,
      equipments,
      equipmentsGreen: [],
      character: playerCharacter,
      role: playerRole,
      gunRange: playerCharacter.name === 'rose doolan' ? 2 : 1,
      actionRange: playerCharacter.name === 'rose doolan' ? 2 : 1,
      cardsInPlay: [],
      secretCards: [],
      numBangsLeft: playerCharacter.name === 'willy the kid' ? 9999 : 1,
      barrelUseLeft: 1,
      cardDiscardedThisTurn: 0,
      cardDrawnAtStartLeft: 2,
      jourdonnaisPowerUseLeft: playerCharacter.name === 'jourdonnais' ? 1 : 0,
    };

    if (playerCharacter.name === 'sid ketchum') {
      sidKetchumId = playerId;
    }

    players[playerId] = player;
    playOrder.push(playerId);
  }
  console.log(charactersShuffled.length);

  return {
    deck,
    discarded,
    players,
    generalStore,
    generalStoreOrder,
    activeStage,
    reactionRequired,
    playOrder,
    sidKetchumId,
    expansions,
    characters: charactersShuffled,
  } as IGameState;
};

export default setup;
