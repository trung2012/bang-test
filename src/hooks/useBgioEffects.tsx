import { useEffectListener } from 'bgio-effects/react';
import gsap, { Expo, Power3, Power4 } from 'gsap';
import { Bounce, Power2, RoughEase, Sine } from 'gsap/all';
import useSound from 'use-sound';
import { animationDelayMilliseconds, animationDelaySeconds } from '../game';
import { BangEffectsConfig } from '../game';
const gunShot = require('../assets/sounds/gunshot.mp3');
const explosion = require('../assets/sounds/bomb.mp3');
const gunCock = require('../assets/sounds/guncock.mp3');
const grunt = require('../assets/sounds/hit.mp3');
const horse = require('../assets/sounds/horse.mp3');
const swoosh = require('../assets/sounds/swoosh.mp3');
const gatling = require('../assets/sounds/gatling.mp3');
const jail = require('../assets/sounds/jail.mp3');
const drinking = require('../assets/sounds/drinking.mp3');
const barrel = require('../assets/sounds/barrel.mp3');
const indians = require('../assets/sounds/indians.mp3');
const panic = require('../assets/sounds/panic.mp3');
const missed = require('../assets/sounds/miss.mp3');
const fanfare = require('../assets/sounds/tada.mp3');

export const useBgioEffects = () => {
  const [playGunShot] = useSound(gunShot, { volume: 0.3 });
  const [playExplosion] = useSound(explosion, { volume: 0.7 });
  const [playGunCock] = useSound(gunCock, { volume: 0.3 });
  const [playGrunt] = useSound(grunt, { volume: 0.6 });
  const [playHorse] = useSound(horse, { volume: 0.3 });
  const [playSwoosh] = useSound(swoosh, { volume: 0.25 });
  const [playGatling] = useSound(gatling, { volume: 0.3 });
  const [playJail] = useSound(jail, { volume: 0.5 });
  const [playDrinking] = useSound(drinking, { volume: 0.4 });
  const [playBarrel] = useSound(barrel, { volume: 0.3 });
  const [playIndians] = useSound(indians, { volume: 0.25 });
  const [playPanic] = useSound(panic, { volume: 0.15 });
  const [playMissed] = useSound(missed, { volume: 0.55 });
  const [playFanfare] = useSound(fanfare, { volume: 0.5 });

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
    (playerId: string) => {
      playExplosion();

      const playerExplosionElement = document.getElementsByClassName(
        `dynamite-explosion-${playerId}`
      )[0];

      gsap.to(playerExplosionElement, {
        scale: 1,
        opacity: 1,
        zIndex: 1,
        duration: 0.25,
        ease: Power4.easeOut,
        onComplete: () => {
          gsap.to(playerExplosionElement, {
            duration: 1.25,
            opacity: 0,
            zIndex: -100,
            ease: Expo.easeIn,
          });
          gsap.to(playerExplosionElement, {
            scale: 0,
            delay: 1.4,
          });
        },
      });
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
              ease: Power3.easeOut,
            });
          },
        }
      );
    },
    [playGatling]
  );

  useEffectListener<BangEffectsConfig>(
    'jail',
    (playerId: string) => {
      setTimeout(() => {
        const playerJailElement = document.getElementsByClassName(`jail-bars-${playerId}`)[0];

        gsap.fromTo(
          playerJailElement,
          {
            zIndex: 2,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.25,
            ease: Bounce.easeOut,
          }
        );

        playJail();
      }, animationDelayMilliseconds);
    },
    [playJail]
  );

  useEffectListener<BangEffectsConfig>(
    'clearJail',
    (payload: { playerId: string; isFailure: boolean }) => {
      const { playerId, isFailure } = payload;
      if (!isFailure) {
        playFanfare();
      }

      const playerJailElement = document.getElementsByClassName(`jail-bars-${playerId}`)[0];

      gsap.to(playerJailElement, {
        opacity: 0,
        zIndex: -100,
        y: -100,
        duration: 0.5,
        ease: Power3.easeIn,
      });
    },
    [playFanfare]
  );

  useEffectListener<BangEffectsConfig>(
    'barrel',
    () => {
      setTimeout(() => {
        playBarrel();
      }, animationDelayMilliseconds);
    },
    [playBarrel]
  );

  useEffectListener<BangEffectsConfig>(
    'indians',
    () => {
      setTimeout(() => {
        playIndians();
      }, animationDelayMilliseconds);
    },
    [playIndians]
  );

  useEffectListener<BangEffectsConfig>(
    'panic',
    () => {
      setTimeout(() => {
        playPanic();
      }, animationDelayMilliseconds);
    },
    [playPanic]
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

  useEffectListener<BangEffectsConfig>(
    'missed',
    () => {
      playMissed();
    },
    [playMissed]
  );
};
