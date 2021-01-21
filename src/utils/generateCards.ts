import { CardName, CardSuit, CardType, ICard, ICardsToGenerate } from '../game';

const { nanoid } = require('nanoid');
const fs = require('fs');

const cardsToGenerateOriginal: ICardsToGenerate = {
  equipment: [
    {
      name: 'barrel',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/barile_z8ibbs.png',
      values: {
        spades: [12, 13],
      },
    },
    {
      name: 'dynamite',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/dynamite_gq525m.png',
      timer: 1,
      values: {
        hearts: [2],
      },
    },
    {
      name: 'jail',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/prigione_k3bbei.png',
      values: {
        hearts: [4],
        spades: [10, 11],
      },
    },
    {
      name: 'mustang',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/mustang_pht7ms.png',
      values: {
        hearts: [8, 9],
      },
    },
    {
      name: 'remington',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/remington_dtsgzi.png',
      values: {
        clubs: [13],
      },
    },
    {
      name: 'rev carabine',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/carabine_czyogt.png',
      values: {
        clubs: [14],
      },
    },
    {
      name: 'schofield',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1602888951/bang/original/schofield_clag8z.png',
      values: {
        clubs: [11, 12],
        spades: [13],
      },
    },
    {
      name: 'scope',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/mirino_gbne0b.png',
      values: {
        spades: [14],
      },
    },
    {
      name: 'volcanic',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/volcanic_dwrloi.png',
      values: {
        spades: [10],
        clubs: [10],
      },
    },
    {
      name: 'winchester',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/winchester_sy1r19.png',
      values: {
        spades: [8],
      },
    },
  ],
  action: [
    {
      name: 'bang',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/bang_elk9mw.png',
      values: {
        spades: [14],
        diamond: [2, 14],
        hearts: [12, 14],
        clubs: [2, 9],
      },
    },
    {
      name: 'beer',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/birra_hjgptv.png',
      values: {
        hearts: [6, 11],
      },
    },
    {
      name: 'cat balou',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/catbalou_fihyoi.png',
      values: {
        hearts: [13],
        diamond: [9, 11],
      },
    },
    {
      name: 'duel',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/duello_ipnsk5.png',
      values: {
        clubs: [8],
        diamond: [12],
        spades: [11],
      },
    },
    {
      name: 'gatling',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/gatling_vxac7t.png',
      values: {
        hearts: [10],
      },
    },
    {
      name: 'general store',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/emporio_ldjfxn.png',
      values: {
        clubs: [9],
        spades: [12],
      },
    },
    {
      name: 'indians',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/indiani_mlfftz.png',
      values: {
        diamond: [13, 14],
      },
    },
    {
      name: 'missed',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/mancato_r2oh5w.png',
      values: {
        clubs: [10, 14],
        spades: [2, 8],
      },
    },
    {
      name: 'panic',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/panico_fdczgp.png',
      values: {
        hearts: [11, 13],
        diamond: [8],
      },
    },
    {
      name: 'saloon',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1602888951/bang/original/saloon_oubya5.png',
      values: {
        hearts: [5],
      },
    },
    {
      name: 'stagecoach',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/diligenza_wpu1kg.png',
      values: {
        spades: [8, 9],
      },
    },
    {
      name: 'wells fargo',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/wellsfargo_zfpfjj.png',
      values: {
        hearts: [3],
      },
    },
  ],
};

const cardsToGenerate_VOS: ICardsToGenerate = {
  equipment: [
    {
      name: 'bounty',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1606888442/bang/valley%20of%20shadows/07_taglia_fqzwvn.png',
      values: {
        clubs: [9],
      },
    },
    {
      name: 'ghost',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1606888440/bang/valley%20of%20shadows/07_fantasma_vbgxxt.png',
      values: {
        spades: [9, 10],
      },
    },
    {
      name: 'lemat',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1606888441/bang/valley%20of%20shadows/07_lemat_fmlaxe.png',
      values: {
        diamond: [4],
      },
    },
    {
      name: 'rattlesnake',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1606888441/bang/valley%20of%20shadows/07_serpenteasonagli_hzqbw9.png',
      values: {
        hearts: [7],
      },
    },
    {
      name: 'shotgun',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1606888442/bang/valley%20of%20shadows/07_shotgun_egcipc.png',
      values: {
        spades: [13],
      },
    },
  ],
  action: [
    {
      name: 'aim',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1606888441/bang/valley%20of%20shadows/07_mira_mwmfi5.png',
      values: {
        clubs: [6],
      },
    },
    {
      name: 'backfire',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1606888441/bang/valley%20of%20shadows/07_ritornodifiamma_sjiyga.png',
      values: {
        clubs: [12],
      },
    },
    {
      name: 'bandidos',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1606888441/bang/valley%20of%20shadows/07_bandidos_tn7pge.png',
      values: {
        diamond: [12],
      },
    },
    {
      name: 'escape',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1606888441/bang/valley%20of%20shadows/07_fuga_jca9rd.png',
      values: {
        hearts: [3],
      },
    },
    {
      name: 'fanning',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1606888442/bang/valley%20of%20shadows/07_sventagliata_be5tbq.png',
      values: {
        spades: [2],
      },
    },
    {
      name: 'last call',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1606888442/bang/valley%20of%20shadows/07_ultimogiro_njn4jx.png',
      values: {
        diamond: [8],
      },
    },
    {
      name: 'poker',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1606888441/bang/valley%20of%20shadows/07_poker_crcfaq.png',
      values: {
        hearts: [11],
      },
    },
    {
      name: 'saved',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1606888441/bang/valley%20of%20shadows/07_salvo_ee8b1m.png',
      values: {
        hearts: [5],
      },
    },
    {
      name: 'tomahawk',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1606888442/bang/valley%20of%20shadows/07_tomahawk_vz2nzo.png',
      values: {
        diamond: [14],
      },
    },
    {
      name: 'tornado',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1606888442/bang/valley%20of%20shadows/07_tornado_g2xesa.png',
      values: {
        clubs: [14],
      },
    },
  ],
};

const cardsToGenerate_DodgeCity: ICardsToGenerate = {
  equipment: [
    {
      name: 'barrel',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/barile_z8ibbs.png',
      values: {
        clubs: [14],
      },
    },
    {
      name: 'binocular',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1606888454/bang/dodge%20city/03_binocolo_laikrj.png',
      values: {
        diamond: [10],
      },
    },
    {
      name: 'dynamite',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/dynamite_gq525m.png',
      timer: 1,
      values: {
        clubs: [10],
      },
    },
    {
      name: 'hideout',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1606888457/bang/dodge%20city/03_riparo_pmkcax.png',
      values: {
        clubs: [10],
      },
    },
    {
      name: 'mustang',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/mustang_pht7ms.png',
      values: {
        hearts: [5],
      },
    },
    {
      name: 'remington',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/remington_dtsgzi.png',
      values: {
        diamond: [6],
      },
    },
    {
      name: 'rev carabine',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/carabine_czyogt.png',
      values: {
        spades: [5],
      },
    },
  ],
  action: [
    {
      name: 'bang',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/bang_elk9mw.png',
      values: {
        spades: [8],
        clubs: [5, 7],
      },
    },
    {
      name: 'beer',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/birra_hjgptv.png',
      values: {
        hearts: [6],
        spades: [6],
      },
    },
    {
      name: 'cat balou',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/catbalou_fihyoi.png',
      values: {
        clubs: [8],
      },
    },
    {
      name: 'general store',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/emporio_ldjfxn.png',
      values: {
        spades: [14],
      },
    },
    {
      name: 'indians',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/indiani_mlfftz.png',
      values: {
        diamond: [5],
      },
    },
    {
      name: 'missed',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/mancato_r2oh5w.png',
      values: {
        diamond: [8],
      },
    },
    {
      name: 'panic',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/panico_fdczgp.png',
      values: {
        hearts: [11],
      },
    },
    {
      name: 'punch',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1606888456/bang/dodge%20city/03_pugno_oapgw5.png',
      values: {
        spades: [10],
      },
    },
    {
      name: 'brawl',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1606888457/bang/dodge%20city/03_rissa_jwvmtm.png',
      values: {
        spades: [11],
      },
    },
    {
      name: 'dodge',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1606888457/bang/dodge%20city/03_schivata_gwbp7a.png',
      values: {
        hearts: [13],
        diamond: [7],
      },
    },
    {
      name: 'rag time',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1606888456/bang/dodge%20city/03_rag_time_i4vvik.png',
      values: {
        hearts: [9],
      },
    },
    {
      name: 'springfield',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1606888457/bang/dodge%20city/03_springfield_wqihck.png',
      values: {
        spades: [13],
      },
    },
    {
      name: 'tequila',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1606888457/bang/dodge%20city/03_tequila_oirtpx.png',
      values: {
        clubs: [9],
      },
    },
    {
      name: 'whisky',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1606888458/bang/dodge%20city/03_whisky_a7xeu5.png',
      values: {
        hearts: [12],
      },
    },
  ],
  green: [
    {
      name: 'bible',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1606888453/bang/dodge%20city/03_bibbia_wybqkm.png',
      values: {
        hearts: [10],
      },
      timer: 1,
    },
    {
      name: 'buffalo rifle',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1606888455/bang/dodge%20city/03_fucile_da_caccia_bvuddx.png',
      values: {
        clubs: [12],
      },
      timer: 1,
    },
    {
      name: 'can can',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1606888454/bang/dodge%20city/03_can_can_g9g1fs.png',
      values: {
        clubs: [11],
      },
      timer: 1,
    },
    {
      name: 'canteen',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1606888454/bang/dodge%20city/03_borraccia_goxxde.png',
      values: {
        hearts: [7],
      },
      timer: 1,
    },
    {
      name: 'conestoga',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1606888454/bang/dodge%20city/03_conestoga_w6xgyd.png',
      values: {
        diamond: [9],
      },
      timer: 1,
    },
    {
      name: 'derringer',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1606888454/bang/dodge%20city/03_derringer_l0piyc.png',
      values: {
        spades: [7],
      },
      timer: 1,
    },
    {
      name: 'howitzer',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1606888455/bang/dodge%20city/03_howitzer_ffzq2g.png',
      values: {
        spades: [9],
      },
      timer: 1,
    },
    {
      name: 'iron plate',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1606888456/bang/dodge%20city/03_placca_di_ferro_gyceky.png',
      values: {
        diamond: [14],
        spades: [12],
      },
      timer: 1,
    },
    {
      name: 'knife',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1606888456/bang/dodge%20city/03_pugnale_kidolt.png',
      values: {
        hearts: [8],
      },
      timer: 1,
    },
    {
      name: 'pepperbox',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1606888456/bang/dodge%20city/03_pepperbox_hder4s.png',
      values: {
        hearts: [14],
      },
      timer: 1,
    },
    {
      name: 'pony express',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1606888456/bang/dodge%20city/03_pony_express_ymswhj.png',
      values: {
        diamond: [12],
      },
      timer: 1,
    },
    {
      name: 'sombrero',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1606888457/bang/dodge%20city/03_sombrero_qeq9ow.png',
      values: {
        clubs: [7],
      },
      timer: 1,
    },
    {
      name: 'ten gallon hat',
      imageUrl:
        'https://res.cloudinary.com/trungpham/image/upload/v1606888454/bang/dodge%20city/03_cappello_uqibi7.png',
      values: {
        diamond: [11],
      },
      timer: 1,
    },
  ],
};

// const cardsWithReaction: CardName[] = [
//   'bang',
//   'duel',
//   'gatling',
//   'general store',
//   'indians',
//   'tornado',
//   'fanning',
// ];

const targetedCards: CardName[] = [
  'bang',
  'duel',
  'panic',
  'cat balou',
  'jail',
  'missed',
  'fanning',
  'tomahawk',
  'backfire',
  'saved',
  'bounty',
  'ghost',
  'rattlesnake',
  'punch',
  'springfield',
  'buffalo rifle',
  'tequila',
  'can can',
  'conestoga',
  'derringer',
  'knife',
  'pepperbox',
];

const cardsThatNeedDiscard: CardName[] = ['rag time', 'springfield', 'tequila', 'whisky', 'brawl'];

const cardsToPlayWithBang: CardName[] = ['aim'];
interface ISupplementaryCard {
  name: CardName;
  cardsToPlayWith: CardName[];
}

// const supplementaryCards: ISupplementaryCard[] = [];

const generateCards = (cardsToGenerate: ICardsToGenerate, type: string) => {
  fs.appendFileSync(
    `./cards${type ? `_${type}` : ''}.ts`,
    `import { ICard } from '../original';\n
    export const cards${type ? `_${type}` : ''}: ICard[] = `
  );

  const cards: ICard[] = [];
  for (const type in cardsToGenerate) {
    const cardsInType = cardsToGenerate[type];

    cardsInType.forEach((card: any) => {
      const { values } = card;

      for (const suit in values) {
        const range = values[suit];

        if (range.length <= 1) {
          const cardsToPush: ICard[] = range.map((value: number) => ({
            id: nanoid(),
            value,
            name: card.name,
            imageUrl: card.imageUrl,
            suit,
            type,
            isTargeted: targetedCards.includes(card.name),
          }));

          if (cardsToPlayWithBang.includes(card.name)) {
            cardsToPush[0].playWithBang = true;
          }

          if (cardsThatNeedDiscard.includes(card.name)) {
            cardsToPush[0].needsDiscard = true;
          }

          if (card.timer !== undefined) {
            cardsToPush[0].timer = 1;
          }
          cards.push(...cardsToPush);
        } else {
          const min = range[0];
          const max = range[1];
          for (let v = min; v <= max; v++) {
            const newCard: ICard = {
              id: nanoid(),
              value: v,
              name: card.name,
              imageUrl: card.imageUrl,
              suit: suit as CardSuit,
              type: type as CardType,
              isTargeted: targetedCards.includes(card.name),
            };

            if (cardsToPlayWithBang.includes(card.name)) {
              newCard.playWithBang = true;
            }

            if (cardsThatNeedDiscard.includes(card.name)) {
              newCard.needsDiscard = true;
            }

            if (card.timer !== undefined) {
              newCard.timer = 1;
            }

            cards.push(newCard);
          }
        }
      }
    });
  }

  fs.appendFileSync(`./cards${type ? `_${type}` : ''}.ts`, JSON.stringify(cards, null, 4));
};

generateCards(cardsToGenerateOriginal, '');
generateCards(cardsToGenerate_VOS, 'VOS');
generateCards(cardsToGenerate_DodgeCity, 'DodgeCity');
