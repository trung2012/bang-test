import { Ctx, Game } from 'boardgame.io';
import { TurnOrder } from 'boardgame.io/core';
import { EffectsPlugin } from 'bgio-effects/plugin';
import { gameNames } from './constants';
import moves from './moves';
import phases from './phases';
import setup from './setup';
import stages from './stages';
import { ICard, IGameState } from './types';
// import { drawCardToReact, dynamiteResult, jailResult } from './utils';
import { config } from './effects';

declare module 'boardgame.io' {
  interface Ctx {
    effects: {
      [key: string]: any;
    };
  }
}

const game: Game<IGameState> = {
  name: gameNames.bang,
  setup,
  plugins: [EffectsPlugin(config)],
  moves,
  phases,
  turn: {
    order: {
      ...TurnOrder.DEFAULT,
      first: (G: IGameState, ctx: Ctx) => {
        const allPlayerIds = Object.keys(G.players);
        const sheriffId = allPlayerIds.find(id => G.players[id].role === 'sheriff');
        return Number(sheriffId) ?? 0;
      },
      next: (G: IGameState, ctx: Ctx) => {
        let nextPlayerPos = ctx.playOrderPos % ctx.playOrder.length;
        do {
          nextPlayerPos = (nextPlayerPos + 1) % ctx.playOrder.length;
        } while (G.players[nextPlayerPos.toString()].hp <= 0);
        return nextPlayerPos;
      },
    },
    stages,
    onMove: (G: IGameState, ctx: Ctx) => {
      let isSuzyLafayetteInGame = false;
      let suzyPlayerId: string | undefined = undefined;
      for (const playerId in G.players) {
        if (G.players[playerId].character.name === 'suzy lafayette') {
          isSuzyLafayetteInGame = true;
          suzyPlayerId = playerId;
          break;
        }
      }

      if (isSuzyLafayetteInGame && suzyPlayerId !== undefined) {
        const suzyPlayer = G.players[suzyPlayerId];
        if (suzyPlayer.hand.length === 0) {
          const newCard = G.deck.pop();
          if (newCard) {
            suzyPlayer.hand.push(newCard);
          }
        }
      }
    },
    onBegin: (G: IGameState, ctx: Ctx) => {
      if (G.deck.length <= 10) {
        while (G.discarded.length > 2) {
          G.deck.push(G.discarded.pop() as ICard);
        }
        G.deck = ctx.random?.Shuffle ? ctx.random?.Shuffle(G.deck) : G.deck;
      }

      const currentPlayer = G.players[ctx.currentPlayer];
      if (currentPlayer.hp <= 0 && ctx.events?.endTurn) {
        ctx.events.endTurn();
      }

      const hasDynamite = currentPlayer.equipments.find(card => card.name === 'dynamite');
      const isJailed = currentPlayer.equipments.find(card => card.name === 'jail');

      if (hasDynamite) {
        let cards: ICard[] = [];
        let drawnCard = G.deck.pop();

        if (drawnCard) {
          cards.push(drawnCard);
        }

        if (currentPlayer.character.name === 'lucky duke') {
          const extraCard = G.deck.pop();

          if (extraCard) {
            cards.push(extraCard);
          }
        }

        currentPlayer.cardsInPlay.push(...cards);

        const isFailure = currentPlayer.cardsInPlay.every(
          card => card.suit === 'spades' && card.value >= 2 && card.value <= 9
        );
        const dynamiteCardIndex = currentPlayer.equipments.findIndex(
          card => card.name === 'dynamite'
        );

        if (isFailure) {
          currentPlayer.hp -= 3;
          const beerCardIndex = currentPlayer.hand.findIndex(card => card.name === 'beer');

          if (beerCardIndex && currentPlayer.hp === 0) {
            const cardToPlay = currentPlayer.hand.splice(beerCardIndex, 1)[0];
            currentPlayer.cardsInPlay.push(cardToPlay);
            currentPlayer.hp = 1;

            while (currentPlayer.cardsInPlay.length > 0) {
              const discardedCard = currentPlayer.cardsInPlay.shift();
              if (discardedCard) {
                G.discarded.push(discardedCard);
              }
            }
          }

          const dynamiteCard = currentPlayer.equipments.splice(dynamiteCardIndex, 1)[0];
          G.discarded.push(dynamiteCard);

          while (currentPlayer.cardsInPlay.length > 0) {
            const discardedCard = currentPlayer.cardsInPlay.shift();
            if (discardedCard) {
              G.discarded.push(discardedCard);
            }
          }

          if (currentPlayer.hp <= 0) {
            while (currentPlayer.hand.length > 0) {
              const discardedCard = currentPlayer.hand.pop();
              if (discardedCard) {
                G.discarded.push(discardedCard);
              }
            }
            G.playOrder = G.playOrder.filter(playerId => playerId !== currentPlayer.id);
          }

          console.log('dynamite fail');
        } else {
          const nextPlayerId = (Number(currentPlayer.id) + 1) % ctx.playOrder.length;
          const nextPlayer = G.players[nextPlayerId];
          const dynamiteCard = currentPlayer.equipments.splice(dynamiteCardIndex, 1)[0];
          nextPlayer.equipments.push(dynamiteCard);
          while (currentPlayer.cardsInPlay.length > 0) {
            const discardedCard = currentPlayer.cardsInPlay.shift();
            if (discardedCard) {
              G.discarded.push(discardedCard);
            }
          }
        }
      }

      if (currentPlayer.hp <= 0 && ctx.events?.endTurn) {
        ctx.events.endTurn();
      }

      if (isJailed) {
        let cards: ICard[] = [];
        let drawnCard = G.deck.pop();

        if (drawnCard) {
          cards.push(drawnCard);
        }

        if (currentPlayer.character.name === 'lucky duke') {
          const extraCard = G.deck.pop();

          if (extraCard) {
            cards.push(extraCard);
          }
        }

        currentPlayer.cardsInPlay.push(...cards);

        const isFailure = currentPlayer.cardsInPlay.every(card => card.suit !== 'hearts');
        const jailCardIndex = currentPlayer.equipments.findIndex(card => card.name === 'jail');

        while (currentPlayer.cardsInPlay.length > 0) {
          const discardedCard = currentPlayer.cardsInPlay.shift();
          if (discardedCard) {
            G.discarded.push(discardedCard);
          }
        }

        const jailCard = currentPlayer.equipments.splice(jailCardIndex, 1)[0];
        G.discarded.push(jailCard);

        if (isFailure && ctx.events?.endTurn) {
          console.log('jail fail');
          G.playOrder = G.playOrder.filter(playerId => playerId !== currentPlayer.id);
        }
      }
    },
    onEnd: (G: IGameState, ctx: Ctx) => {
      for (const playerId in G.players) {
        const player = G.players[playerId];
        const hasVolcanic = player.equipments.find(card => card.name === 'volcanic');
        if (player.character.name !== 'willy the kid' && !hasVolcanic) {
          player.numBangsLeft = 1;
          player.cardDiscardedThisTurn = 0;
          player.cardDrawnAtStartLeft =
            player.character.name === 'black jack' || player.character.name === 'kit carlson'
              ? 3
              : 2;
        }
      }
    },
  },
};

export default game;
