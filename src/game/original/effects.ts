export const config = {
  effects: {
    gunshot: {
      create: (cardId: string) => cardId,
    },
    explosion: {
      create: (playerId: string) => playerId,
    },
    gunCock: {
      create: (cardId: string) => cardId,
    },
    takeDamage: {},
    gatling: {
      create: (cardId: string) => cardId,
    },
    horse: {
      create: (cardId: string) => cardId,
    },
    swoosh: {},
    jail: {
      create: (playerId: string) => playerId,
    },
    clearJail: {
      create: (payload: { playerId: string; isFailure: boolean }) => ({
        playerId: payload.playerId,
        isFailure: payload.isFailure,
      }),
    },
    beer: {
      create: (cardId: string) => cardId,
    },
    barrel: {},
    indians: {},
    panic: {},
    missed: {},
  },
};

export type BangEffectsConfig = typeof config;
