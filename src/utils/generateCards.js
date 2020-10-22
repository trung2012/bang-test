const shortid = require('shortid');
const fs = require('fs');

const cardVal = {
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
  10: 'ten',
  11: 'jack',
  12: 'queen',
  13: 'king',
  14: 'ace',
};

const cardsToGenerateOriginal = {
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

const generateCards = cardsToGenerate => {
  const cards = [];
  for (const type in cardsToGenerate) {
    const cardsInType = cardsToGenerate[type];

    cardsInType.forEach(card => {
      const { values } = card;
      for (const suit in values) {
        const range = values[suit];
        if (range.length <= 1) {
          const cardsToPush = range.map(value => ({
            id: shortid.generate(),
            value,
            name: card.name,
            imageUrl: card.imageUrl,
            suit,
            type,
          }));
          cards.push(...cardsToPush);
        } else {
          const min = range[0];
          const max = range[1];
          for (let v = min; v <= max; v++) {
            const newCard = {
              id: shortid.generate(),
              value: v,
              name: card.name,
              imageUrl: card.imageUrl,
              suit,
              type,
            };
            cards.push(newCard);
          }
        }
      }
    });
  }

  fs.appendFile(`./cards.ts`, JSON.stringify(cards, null, 4), err => {
    if (err) {
      console.log(err);
    }
  });
};

generateCards(cardsToGenerateOriginal);
