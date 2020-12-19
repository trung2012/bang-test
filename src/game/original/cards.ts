import { ICard } from './types';

const cardsOriginal: ICard[] = [
  {
    id: 'EqaUNzGKt94tgqvp677t5',
    value: 12,
    name: 'barrel',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/barile_z8ibbs.png',
    suit: 'spades',
    type: 'equipment',
    isTargeted: false,
  },
  {
    id: 'KFR1PZkI41vbuQdw3Faqf',
    value: 13,
    name: 'barrel',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/barile_z8ibbs.png',
    suit: 'spades',
    type: 'equipment',
    isTargeted: false,
  },
  {
    id: 'bJR-sWZk8e5Q2yjNRQVCI',
    value: 2,
    name: 'dynamite',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/dynamite_gq525m.png',
    suit: 'hearts',
    type: 'equipment',
    isTargeted: false,
    timer: 1,
  },
  {
    id: 'JlFzaQWufLZOUD6klUFHN',
    value: 4,
    name: 'jail',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/prigione_k3bbei.png',
    suit: 'hearts',
    type: 'equipment',
    isTargeted: true,
  },
  {
    id: '3LnBYa61arNVSfh0DVoCh',
    value: 10,
    name: 'jail',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/prigione_k3bbei.png',
    suit: 'spades',
    type: 'equipment',
    isTargeted: true,
  },
  {
    id: 'dKrqYIJtPuZkkflKWw6YX',
    value: 11,
    name: 'jail',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/prigione_k3bbei.png',
    suit: 'spades',
    type: 'equipment',
    isTargeted: true,
  },
  {
    id: 'BFxaccgPHhTzQEdLP_jXn',
    value: 8,
    name: 'mustang',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/mustang_pht7ms.png',
    suit: 'hearts',
    type: 'equipment',
    isTargeted: false,
  },
  {
    id: 'GZSSeic89rqKFyDc4MOm-',
    value: 9,
    name: 'mustang',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/mustang_pht7ms.png',
    suit: 'hearts',
    type: 'equipment',
    isTargeted: false,
  },
  {
    id: '9YmTb4rHAOXRMOPik2ZjN',
    value: 13,
    name: 'remington',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/remington_dtsgzi.png',
    suit: 'clubs',
    type: 'equipment',
    isTargeted: false,
  },
  {
    id: 'Mcp3OE1JQmcNdT83Oe-z6',
    value: 14,
    name: 'rev carabine',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/carabine_czyogt.png',
    suit: 'clubs',
    type: 'equipment',
    isTargeted: false,
  },
  {
    id: '8nkNqMM6RiAu0-RXu2qHt',
    value: 11,
    name: 'schofield',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888951/bang/original/schofield_clag8z.png',
    suit: 'clubs',
    type: 'equipment',
    isTargeted: false,
  },
  {
    id: '2umO6cq3Vxwrat8_kCgey',
    value: 12,
    name: 'schofield',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888951/bang/original/schofield_clag8z.png',
    suit: 'clubs',
    type: 'equipment',
    isTargeted: false,
  },
  {
    id: 'hKBl_uHM8tmlcSsIbzaGH',
    value: 13,
    name: 'schofield',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888951/bang/original/schofield_clag8z.png',
    suit: 'spades',
    type: 'equipment',
    isTargeted: false,
  },
  {
    id: 'hrI5X4wBTlbnZwnRc1RgX',
    value: 14,
    name: 'scope',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/mirino_gbne0b.png',
    suit: 'spades',
    type: 'equipment',
    isTargeted: false,
  },
  {
    id: 'iI9tfGKl9qBCqo4zM-0sh',
    value: 10,
    name: 'volcanic',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/volcanic_dwrloi.png',
    suit: 'spades',
    type: 'equipment',
    isTargeted: false,
  },
  {
    id: 'lNBNGR9l6oiLdybjqh8XB',
    value: 10,
    name: 'volcanic',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/volcanic_dwrloi.png',
    suit: 'clubs',
    type: 'equipment',
    isTargeted: false,
  },
  {
    id: 'dsAPFCRnlh73eEowOEVCL',
    value: 8,
    name: 'winchester',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/winchester_sy1r19.png',
    suit: 'spades',
    type: 'equipment',
    isTargeted: false,
  },
  {
    id: 'nNzYu_iEkmeN9jThB1kkM',
    value: 14,
    name: 'bang',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/bang_elk9mw.png',
    suit: 'spades',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'xz1ukJsHh-FcAOL1ooZJm',
    value: 2,
    name: 'bang',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/bang_elk9mw.png',
    suit: 'diamond',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'B590TKnX1PyUPv-wiEJwQ',
    value: 3,
    name: 'bang',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/bang_elk9mw.png',
    suit: 'diamond',
    type: 'action',
    isTargeted: true,
  },
  {
    id: '5H2CRFvsuRfGzTXAIRuZx',
    value: 4,
    name: 'bang',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/bang_elk9mw.png',
    suit: 'diamond',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'DLl2gAvpd3fJrsoy3rcUw',
    value: 5,
    name: 'bang',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/bang_elk9mw.png',
    suit: 'diamond',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'NmJhh9Avwr7yrc1NSA-5N',
    value: 6,
    name: 'bang',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/bang_elk9mw.png',
    suit: 'diamond',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'G4J0Lg735XHx77k9E3E2H',
    value: 7,
    name: 'bang',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/bang_elk9mw.png',
    suit: 'diamond',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'wZBgFytXURmesk4_Id_WK',
    value: 8,
    name: 'bang',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/bang_elk9mw.png',
    suit: 'diamond',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'EV_FxiE8M7Ry_i3au_SJa',
    value: 9,
    name: 'bang',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/bang_elk9mw.png',
    suit: 'diamond',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'OMq1NykA4J1N5ixPSnEIG',
    value: 10,
    name: 'bang',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/bang_elk9mw.png',
    suit: 'diamond',
    type: 'action',
    isTargeted: true,
  },
  {
    id: '-c9j1ilLAdhAehsphW_ft',
    value: 11,
    name: 'bang',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/bang_elk9mw.png',
    suit: 'diamond',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'Kld2D5BTdTM903Qg_GksI',
    value: 12,
    name: 'bang',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/bang_elk9mw.png',
    suit: 'diamond',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'MmKtvDU6eYZSrwIJQ1Qj6',
    value: 13,
    name: 'bang',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/bang_elk9mw.png',
    suit: 'diamond',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'MT0Vl5vycITao2OpzSwlM',
    value: 14,
    name: 'bang',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/bang_elk9mw.png',
    suit: 'diamond',
    type: 'action',
    isTargeted: true,
  },
  {
    id: '0AmbB24BmtoYYOjakXZxy',
    value: 12,
    name: 'bang',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/bang_elk9mw.png',
    suit: 'hearts',
    type: 'action',
    isTargeted: true,
  },
  {
    id: '3B0G-XNFvGRzn34MFnFhH',
    value: 13,
    name: 'bang',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/bang_elk9mw.png',
    suit: 'hearts',
    type: 'action',
    isTargeted: true,
  },
  {
    id: '9_Tecra35If-QNLexmq0n',
    value: 14,
    name: 'bang',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/bang_elk9mw.png',
    suit: 'hearts',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'U5BiuxSUtBGd5kRUj57JN',
    value: 2,
    name: 'bang',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/bang_elk9mw.png',
    suit: 'clubs',
    type: 'action',
    isTargeted: true,
  },
  {
    id: '5GALeKN_ehPMEAQ47Q_v7',
    value: 3,
    name: 'bang',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/bang_elk9mw.png',
    suit: 'clubs',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'cgpXTfeWnfZC44kGph4ep',
    value: 4,
    name: 'bang',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/bang_elk9mw.png',
    suit: 'clubs',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'oqwUQEh_lPJf-E2bXbU7I',
    value: 5,
    name: 'bang',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/bang_elk9mw.png',
    suit: 'clubs',
    type: 'action',
    isTargeted: true,
  },
  {
    id: '2cPwNTNt9TT_4NaOuSWyc',
    value: 6,
    name: 'bang',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/bang_elk9mw.png',
    suit: 'clubs',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'SiWAQz6NqOvFXm0PcRHhH',
    value: 7,
    name: 'bang',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/bang_elk9mw.png',
    suit: 'clubs',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'kB-5RpPMIyIOYg-i_7f2X',
    value: 8,
    name: 'bang',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/bang_elk9mw.png',
    suit: 'clubs',
    type: 'action',
    isTargeted: true,
  },
  {
    id: '3lkIXsMR3O2ZIFXML8P2B',
    value: 9,
    name: 'bang',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/bang_elk9mw.png',
    suit: 'clubs',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'bUyBSqsmrOs1XgcDviSPi',
    value: 6,
    name: 'beer',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/birra_hjgptv.png',
    suit: 'hearts',
    type: 'action',
    isTargeted: false,
  },
  {
    id: 'SalDNVweMt_HiIzC2b4Aj',
    value: 7,
    name: 'beer',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/birra_hjgptv.png',
    suit: 'hearts',
    type: 'action',
    isTargeted: false,
  },
  {
    id: '7-r-o8ANnHSRRJ1N-QOPa',
    value: 8,
    name: 'beer',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/birra_hjgptv.png',
    suit: 'hearts',
    type: 'action',
    isTargeted: false,
  },
  {
    id: 'CigzefuZcjJhsrwzg1RwR',
    value: 9,
    name: 'beer',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/birra_hjgptv.png',
    suit: 'hearts',
    type: 'action',
    isTargeted: false,
  },
  {
    id: 'nI45ae_i90XtkZEuhjng5',
    value: 10,
    name: 'beer',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/birra_hjgptv.png',
    suit: 'hearts',
    type: 'action',
    isTargeted: false,
  },
  {
    id: 'uzVFaxQdqzUClZ7GvPN1D',
    value: 11,
    name: 'beer',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/birra_hjgptv.png',
    suit: 'hearts',
    type: 'action',
    isTargeted: false,
  },
  {
    id: 'l7vJa7CaLjJcqW3_wRt86',
    value: 13,
    name: 'cat balou',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/catbalou_fihyoi.png',
    suit: 'hearts',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'fyV2_tdBF1cuO7VwfB4ux',
    value: 9,
    name: 'cat balou',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/catbalou_fihyoi.png',
    suit: 'diamond',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'JwbaQBinVKZ3WOUMOBP6v',
    value: 10,
    name: 'cat balou',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/catbalou_fihyoi.png',
    suit: 'diamond',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'QW3yUQxUfT82jUnKlim6F',
    value: 11,
    name: 'cat balou',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/catbalou_fihyoi.png',
    suit: 'diamond',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'UtSWYatgeUAhdoI2jTlQi',
    value: 8,
    name: 'duel',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/duello_ipnsk5.png',
    suit: 'clubs',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'A2AwQ81eZyQmqZX8e3ZTN',
    value: 12,
    name: 'duel',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/duello_ipnsk5.png',
    suit: 'diamond',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'rX4DNo-Fzic1iYuOdR3Uf',
    value: 11,
    name: 'duel',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/duello_ipnsk5.png',
    suit: 'spades',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'qfok1eauSLPDMy2NLh0X4',
    value: 10,
    name: 'gatling',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/gatling_vxac7t.png',
    suit: 'hearts',
    type: 'action',
    isTargeted: false,
  },
  {
    id: '7M0KVw0F3mCdHUB1Kz2lM',
    value: 9,
    name: 'general store',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/emporio_ldjfxn.png',
    suit: 'clubs',
    type: 'action',
    isTargeted: false,
  },
  {
    id: '68LQNreFJEaiDPbBNvaBv',
    value: 12,
    name: 'general store',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/emporio_ldjfxn.png',
    suit: 'spades',
    type: 'action',
    isTargeted: false,
  },
  {
    id: 'VjQZOhB_m54DX7Rpa0a3Q',
    value: 13,
    name: 'indians',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/indiani_mlfftz.png',
    suit: 'diamond',
    type: 'action',
    isTargeted: false,
  },
  {
    id: 'PUBzcntfmgvoVTTSxEdIs',
    value: 14,
    name: 'indians',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/indiani_mlfftz.png',
    suit: 'diamond',
    type: 'action',
    isTargeted: false,
  },
  {
    id: 'GvYBPRcOV9d_5aR_tInyb',
    value: 10,
    name: 'missed',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/mancato_r2oh5w.png',
    suit: 'clubs',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'FllXz3UIDpB6x1Dpq4RIX',
    value: 11,
    name: 'missed',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/mancato_r2oh5w.png',
    suit: 'clubs',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'Op-wvLezCXvwvCnQH8ZzS',
    value: 12,
    name: 'missed',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/mancato_r2oh5w.png',
    suit: 'clubs',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'IvBmd3k0JZb4OjaGPbYu4',
    value: 13,
    name: 'missed',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/mancato_r2oh5w.png',
    suit: 'clubs',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'Ls48OxIbyHhLq7BcS4y2Q',
    value: 14,
    name: 'missed',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/mancato_r2oh5w.png',
    suit: 'clubs',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'oNRx6CxUPrbEA8pjm6P6w',
    value: 2,
    name: 'missed',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/mancato_r2oh5w.png',
    suit: 'spades',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'bdVEWM-3ZTlV02nsT4fXo',
    value: 3,
    name: 'missed',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/mancato_r2oh5w.png',
    suit: 'spades',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'oHYPoyEOgAilWastabjRN',
    value: 4,
    name: 'missed',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/mancato_r2oh5w.png',
    suit: 'spades',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'R6GWpJz5UTgQJZNvyum9Z',
    value: 5,
    name: 'missed',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/mancato_r2oh5w.png',
    suit: 'spades',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'zmcuvvOmDi7GlrDpN_Ded',
    value: 6,
    name: 'missed',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/mancato_r2oh5w.png',
    suit: 'spades',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'ISAOf4jwGY-Xg1Ikmq9QA',
    value: 7,
    name: 'missed',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/mancato_r2oh5w.png',
    suit: 'spades',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'Amqvxm2_hH7NcJqUeTFK9',
    value: 8,
    name: 'missed',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/mancato_r2oh5w.png',
    suit: 'spades',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'GZYg7seTxjd8c0zZmAsXC',
    value: 11,
    name: 'panic',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/panico_fdczgp.png',
    suit: 'hearts',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'ma0ZBT4eqcV2lqzsRNwES',
    value: 12,
    name: 'panic',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/panico_fdczgp.png',
    suit: 'hearts',
    type: 'action',
    isTargeted: true,
  },
  {
    id: '9qB4vTZsFv2Zve7aEk9OO',
    value: 13,
    name: 'panic',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/panico_fdczgp.png',
    suit: 'hearts',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'HeZlDn7UaRu14Qov5bkeu',
    value: 8,
    name: 'panic',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/panico_fdczgp.png',
    suit: 'diamond',
    type: 'action',
    isTargeted: true,
  },
  {
    id: '1iQOMhaisn2P1HLdnwwTR',
    value: 5,
    name: 'saloon',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888951/bang/original/saloon_oubya5.png',
    suit: 'hearts',
    type: 'action',
    isTargeted: false,
  },
  {
    id: 'grP-QfREF73h6nabOpNNZ',
    value: 8,
    name: 'stagecoach',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/diligenza_wpu1kg.png',
    suit: 'spades',
    type: 'action',
    isTargeted: false,
  },
  {
    id: 'JnJMqkM1Od5844D18E0WL',
    value: 9,
    name: 'stagecoach',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/diligenza_wpu1kg.png',
    suit: 'spades',
    type: 'action',
    isTargeted: false,
  },
  {
    id: '17rfqgdpm9hKG7Fm5hLKr',
    value: 3,
    name: 'wells fargo',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/wellsfargo_zfpfjj.png',
    suit: 'hearts',
    type: 'action',
    isTargeted: false,
  },
];

export const cardsFor8: ICard[] = [
  {
    id: '2zPl0EmrLmpuzoFgnncB7',
    value: 14,
    name: 'barrel',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/barile_z8ibbs.png',
    suit: 'clubs',
    type: 'equipment',
    isTargeted: false,
  },
  {
    id: '3Vd1VBAUY6NpREgWYkNTY',
    value: 10,
    name: 'dynamite',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/dynamite_gq525m.png',
    suit: 'clubs',
    type: 'equipment',
    isTargeted: false,
    timer: 1,
  },
  {
    id: 'yVZWA2MmD1z8ckvyr3WhC',
    value: 10,
    name: 'hideout',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1606888457/bang/dodge%20city/03_riparo_pmkcax.png',
    suit: 'clubs',
    type: 'equipment',
    isTargeted: false,
  },
  {
    id: 'NzTar2yekJ8X5HNbuFyoo',
    value: 5,
    name: 'mustang',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/mustang_pht7ms.png',
    suit: 'hearts',
    type: 'equipment',
    isTargeted: false,
  },
  {
    id: 'WbE3dnGkCZEFbTyGsqknd',
    value: 6,
    name: 'remington',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/remington_dtsgzi.png',
    suit: 'diamond',
    type: 'equipment',
    isTargeted: false,
  },
  {
    id: 'FRyaQF-4lrOYAcskG53t8',
    value: 5,
    name: 'rev carabine',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/carabine_czyogt.png',
    suit: 'spades',
    type: 'equipment',
    isTargeted: false,
  },
  {
    id: 'C-OmVI1tiAq22_EKXUVZZ',
    value: 8,
    name: 'bang',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/bang_elk9mw.png',
    suit: 'spades',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'yaFUQiwhV1QACnLfE9wol',
    value: 5,
    name: 'bang',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/bang_elk9mw.png',
    suit: 'clubs',
    type: 'action',
    isTargeted: true,
  },
  {
    id: '80PdPe4Q4z1VA9_8FkSGA',
    value: 6,
    name: 'bang',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/bang_elk9mw.png',
    suit: 'clubs',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'zlhreAia_XnNmSBWGuzEU',
    value: 7,
    name: 'bang',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888948/bang/original/bang_elk9mw.png',
    suit: 'clubs',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'fHb0zrR7QrU5P65hfugSa',
    value: 6,
    name: 'beer',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/birra_hjgptv.png',
    suit: 'hearts',
    type: 'action',
    isTargeted: false,
  },
  {
    id: 'mIoMs4B9vahFx3gPwPkUg',
    value: 6,
    name: 'beer',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/birra_hjgptv.png',
    suit: 'spades',
    type: 'action',
    isTargeted: false,
  },
  {
    id: 't-i091BvjEo2kYp7TNChK',
    value: 8,
    name: 'cat balou',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/catbalou_fihyoi.png',
    suit: 'clubs',
    type: 'action',
    isTargeted: true,
  },
  {
    id: '3mAZ_VV-EQGwnOnkURaak',
    value: 14,
    name: 'general store',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/emporio_ldjfxn.png',
    suit: 'spades',
    type: 'action',
    isTargeted: false,
  },
  {
    id: '6Nq5yjNNqj-BnnUo65App',
    value: 5,
    name: 'indians',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888949/bang/original/indiani_mlfftz.png',
    suit: 'diamond',
    type: 'action',
    isTargeted: false,
  },
  {
    id: 'wrts3M5JN3mJaDYT8XkN-',
    value: 8,
    name: 'missed',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/mancato_r2oh5w.png',
    suit: 'diamond',
    type: 'action',
    isTargeted: true,
  },
  {
    id: 'W-y_w5azV8o3kcQO31b4m',
    value: 11,
    name: 'panic',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1602888950/bang/original/panico_fdczgp.png',
    suit: 'hearts',
    type: 'action',
    isTargeted: true,
  },
];

export const cards = [...cardsOriginal];
