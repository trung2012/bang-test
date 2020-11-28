import { useEffectListener } from 'bgio-effects/react';
import gsap, { Expo, Power3 } from 'gsap';
import { Power2, RoughEase, Sine } from 'gsap/all';
import useSound from 'use-sound';
import { animationDelayMilliseconds, animationDelaySeconds } from '../game';
import { BangEffectsConfig } from '../game/effects';
const gunShot = require('../assets/sounds/gunshot.mp3');
const explosion = require('../assets/sounds/bomb.mp3');
const gunCock = require('../assets/sounds/guncock.mp3');
const grunt = require('../assets/sounds/hit.mp3');
const horse = require('../assets/sounds/horse.mp3');
const swoosh = require('../assets/sounds/swoosh.mp3');
const gatling = require('../assets/sounds/gatling.mp3');
const jail = require('../assets/sounds/jail.mp3');
const drinking = require('../assets/sounds/drinking.mp3');

export const useBgioEffects = () => {
  const [playGunShot] = useSound(gunShot, { volume: 0.5 });
  const [playExplosion] = useSound(explosion, { volume: 0.7 });
  const [playGunCock] = useSound(gunCock, { volume: 0.5 });
  const [playGrunt] = useSound(grunt, { volume: 0.5 });
  const [playHorse] = useSound(horse, { volume: 0.5 });
  const [playSwoosh] = useSound(swoosh, { volume: 0.2 });
  const [playGatling] = useSound(gatling, { volume: 0.5 });
  const [playJail] = useSound(jail, { volume: 0.5 });
  const [playDrinking] = useSound(drinking, { volume: 0.5 });

  useEffectListener<BangEffectsConfig>(
    'gunshot',
    (cardId: string) => {
      setTimeout(() => {
        playGunShot();
      }, animationDelayMilliseconds);

      gsap.to(`#${CSS.escape(cardId)}`, {
        rotate: -70,
        delay: animationDelaySeconds,
      });

      gsap.fromTo(
        `#${CSS.escape(cardId)}`,
        {
          x: -50,
          delay: animationDelaySeconds,
        },
        {
          x: 0,
          rotate: 0,
          delay: animationDelaySeconds,
          ease: 'elastic.out(1, 0.3)',
          duration: 1,
        }
      );
    },
    [playGunShot]
  );

  useEffectListener<BangEffectsConfig>(
    'explosion',
    () => {
      playExplosion();
      gsap.fromTo(
        document.body,
        {
          x: -100,
          opacity: 0.3,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.2,
          ease: RoughEase,
        }
      );
    },
    [playExplosion]
  );

  useEffectListener<BangEffectsConfig>(
    'gunCock',
    (cardId: string) => {
      setTimeout(() => {
        playGunCock();
      }, animationDelayMilliseconds);

      gsap.fromTo(
        `#${CSS.escape(cardId)}`,
        {
          y: 40,
          delay: animationDelaySeconds,
        },
        {
          y: 0,
          delay: animationDelaySeconds,
          ease: Power3.easeOut,
          duration: 0.9,
        }
      );
    },
    [playGunCock]
  );

  useEffectListener<BangEffectsConfig>(
    'takeDamage',
    () => {
      playGrunt();
    },
    [playGrunt]
  );

  useEffectListener<BangEffectsConfig>(
    'swoosh',
    () => {
      playSwoosh();
    },
    [playSwoosh]
  );

  useEffectListener<BangEffectsConfig>(
    'horse',
    (cardId: string) => {
      setTimeout(() => {
        playHorse();
      }, animationDelayMilliseconds);

      gsap.to(`#${CSS.escape(cardId)}`, {
        x: 15,
        y: -70,
        delay: animationDelaySeconds,
        ease: Expo.easeOut,
        duration: 1.5,
        onComplete: () => {
          gsap.to(`#${CSS.escape(cardId)}`, {
            x: 0,
            y: 0,
            duration: 0.3,
            ease: Sine.easeOut,
          });
        },
      });
    },
    [playHorse]
  );

  useEffectListener<BangEffectsConfig>(
    'gatling',
    (cardId: string) => {
      setTimeout(() => {
        playGatling();
      }, animationDelayMilliseconds);

      gsap.fromTo(
        `#${CSS.escape(cardId)}`,
        {
          x: -50,
          y: -30,
          delay: animationDelaySeconds,
        },
        {
          x: 50,
          y: -30,
          delay: animationDelaySeconds,
          ease: RoughEase,
          duration: 1,
          onComplete: () => {
            gsap.to(`#${CSS.escape(cardId)}`, {
              x: 0,
              y: 0,
              ease: RoughEase,
            });
          },
        }
      );
    },
    [playGatling]
  );

  useEffectListener<BangEffectsConfig>(
    'jail',
    () => {
      setTimeout(() => {
        playJail();
      }, animationDelayMilliseconds);
    },
    [playJail]
  );

  useEffectListener<BangEffectsConfig>(
    'beer',
    (cardId: string) => {
      playDrinking();

      gsap.to(`#${CSS.escape(cardId)}`, {
        rotate: 80,
        ease: Power2.easeOut,
        duration: 1.25,
        onComplete: () => {
          gsap.to(`#${CSS.escape(cardId)}`, {
            rotate: 0,
            duration: 0.7,
            ease: Sine.easeOut,
          });
        },
      });
    },
    [playDrinking]
  );
};
