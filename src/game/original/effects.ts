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
    jail: {},
    clearJail: {
      create: (isFailure: boolean) => isFailure,
    },
    beer: {
      create: (cardId: string) => cardId,
    },
    barrel: {},
    indians: {},
    panic: {},
    missed: {},
    gameOver: {},
    punch: {
      create: (cardId: string) => cardId,
    },
    power: {},
    knifeFlying: {},
  },
};

export type BangEffectsConfig = typeof config;
