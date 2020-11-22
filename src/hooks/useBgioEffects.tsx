import { useEffectListener } from 'bgio-effects/dist/react';

export const useBgioEffects = () => {
  useEffectListener('delayUpdate', () => {}, []);
};
