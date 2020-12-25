import { CardName, ICharacter } from '../original';

export const characters_VOS: ICharacter[] = [
  {
    name: 'black flower',
    hp: 4,
    description:
      'You can use a Clubs card as a BANG! in addition to your normal one BANG! per turn.',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1606888440/bang/valley%20of%20shadows/07_blackflower_pedhfp.png',
  },
  {
    name: 'colorado bill',
    hp: 4,
    description: 'Each time you play a BANG! card, "draw!": on Spades, this shot cannot be avoided',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1606888441/bang/valley%20of%20shadows/07_coloradobill_xkpw3e.png',
  },
  {
    name: 'der spot - burst ringer',
    hp: 4,
    description: 'Once during your turn, you may use a BANG! card as a Gatling',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1606888441/bang/valley%20of%20shadows/07_derspot_v8thbo.png',
  },
  {
    name: 'evelyn shebang',
    hp: 4,
    description:
      'You may refuse to draw cards in your draw phase. For each cards skipped, shoot a BANG! at a different target in reachable distance',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1606888441/bang/valley%20of%20shadows/07_evelynshebang_cm4tsa.png',
  },
  {
    name: 'henry block',
    hp: 4,
    description:
      'Any player drawing or discarding one of your cards (in hand or in play) is the target of a BANG!',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1606888441/bang/valley%20of%20shadows/07_henryblock_xta8j6.png',
  },
  {
    name: 'lemonade jim',
    hp: 4,
    description:
      'Each time another player plays a Beer card, you may discard any card from hand to also regain 1 life point.',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1606888441/bang/valley%20of%20shadows/07_lemonadejim_hxv7fb.png',
  },
  {
    name: 'mick defender',
    hp: 4,
    description:
      'If you are the target of a brown card other than BANG!, you may use a Missed! card to avoid that card.',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1606888441/bang/valley%20of%20shadows/07_mickdefender_uyggdv.png',
  },
  {
    name: 'tuco franziskaner',
    hp: 5,
    description: 'During your draw phase, if you have no blue cards in play, draw 2 extra cards',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1606888442/bang/valley%20of%20shadows/07_tucofranziskaner_ysy1pj.png',
  },
];

export const characters_DodgeCity: ICharacter[] = [
  {
    name: 'bill noface',
    hp: 4,
    description:
      'During phase 1 of his turn, he draws 1 card, plus 1 card for each injury (lost life point) he currently suffers. So, if he is at full life, he draws 1 card; with one life point less, he draws 2 cards; with two life points less, he draws 3 cards, and so forth.',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1606888453/bang/dodge%20city/03_bill_noface_x0ppgw.png',
  },
  // {
  //   name: 'belle star',
  //   hp: 4,
  //   description:
  //     'During her turn, no card in front of any other player has any effect. This applies both to the blue- as well as to the green- bordered cards.',
  //   imageUrl:
  //     'https://res.cloudinary.com/trungpham/image/upload/v1606888453/bang/dodge%20city/03_bill_noface_x0ppgw.png',
  // },
  // {
  //   name: 'apache kid',
  //   hp: 4,
  //   description:
  //     'He is unaffected by cards from the suit of Diamonds played by the other players. During a Duel , his ability does not work.',
  //   imageUrl:
  //     'https://res.cloudinary.com/trungpham/image/upload/v1606888453/bang/dodge%20city/03_bill_noface_x0ppgw.png',
  // },
  {
    name: 'chuck wengam',
    hp: 4,
    description:
      'During his turn, he can choose to lose 1 life point to draw 2 cards from the deck. He may also use this ability more than once in the same turn; however, he cannot choose to lose his last life point this way.',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1606888454/bang/dodge%20city/03_chuck_wengam_jgncdc.png',
    hasActivePower: true,
  },
  // {
  //   name: 'doc holyday',
  //   hp: 4,
  //   description:
  //     'Once during his turn, he can discard any two cards from his hand for the effect of a BANG! against a player within range of his weapon. This ability does not count towards his limit of one BANG! card per turn. To hit Apache Kid in this way, at least one of the two discarded cards must not be a Diamond.',
  //   imageUrl:
  //     'https://res.cloudinary.com/trungpham/image/upload/v1606888454/bang/dodge%20city/03_doc_holyday_a5fxxz.png',
  //   hasActivePower: true,
  //   activePowerUsesLeft: 1
  // },
  {
    name: 'elena fuente',
    hp: 3,
    description: 'She can use any card in her hand as a Missed!',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1606888454/bang/dodge%20city/03_elena_fuente_nvo8ea.png',
  },
  {
    name: 'greg digger',
    hp: 4,
    description:
      'Each time another character is eliminated, he regains 2 life points. As usual, he cannot exceed his initial number of life points in this way.',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1606888455/bang/dodge%20city/03_greg_digger_k4vfoh.png',
  },
  {
    name: 'herb hunter',
    hp: 4,
    description:
      'Each time another character is eliminated, he draws 2 extra cards from the deck. So, if he kills an Outlaw himself, he draws 5 cards.',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1606888455/bang/dodge%20city/03_herb_hunter_tnrza7.png',
  },
  {
    name: 'jose delgado',
    hp: 4,
    description:
      'During his turn he can discard a blue-bordered card from his hand to draw 2 cards from the deck. He may use this ability twice per turn.',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1606888455/bang/dodge%20city/03_jose_delgado_az0duq.png',
    hasActivePower: true,
    activePowerUsesLeft: 2,
  },
  {
    name: 'molly stark',
    hp: 4,
    description:
      'Each time she plays or voluntarily discards a Missed!, Beer, or BANG! card when it is not her turn, she draws one card from the deck. If she discards a BANG! during a Duel , she does not draw her replacement cards until the end of the Duel , when she would draw one card for each BANG! she used during the Duel . Cards that she is forced to discard due to cards like Cat Balou, Brawl, or Can-Can are not considered voluntarily discarded!',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1606888456/bang/dodge%20city/03_molly_stark_cskox2.png',
  },
  {
    name: 'pat brennan',
    hp: 4,
    description:
      'During phase 1 of his turn, he may choose to draw the usual two cards from the deck, or, instead draw one card (and this one card only) from in play and add it to his hand. The card can be in front of any player, and can be either a blue-bordered card or a green-bordered card',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1606888456/bang/dodge%20city/03_pat_brennan_ql0hvn.png',
  },
  {
    name: 'pixie pete',
    hp: 3,
    description: 'During phase 1 of his turn, he draws 3 cards instead of 2.',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1606888456/bang/dodge%20city/03_pixie_pete_ybw05j.png',
  },
  {
    name: 'sean mallory',
    hp: 3,
    description:
      'In phase 3 of his turn, he can hold up to 10 cards in his hand. He does not have to discard any cards if he has more cards than the number of life points he has left, but less than 11.',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1606888457/bang/dodge%20city/03_sean_mallory_ntbsrl.png',
  },
  {
    name: 'tequila joe',
    hp: 4,
    description:
      'Each time he plays a Beer , he regains 2 life points instead of 1. He only regains 1 life point from similar cards like Saloon, Tequila, or Canteen .',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1606888457/bang/dodge%20city/03_tequila_joe_dvqjtv.png',
  },
  {
    name: 'vera custer',
    realName: 'vera custer',
    hp: 3,
    description:
      'At the beginning of her turn, before drawing any cards (in phase 1), she chooses any other character still in play. Until her next turn, she has the same ability as that character.',
    imageUrl:
      'https://res.cloudinary.com/trungpham/image/upload/v1606888457/bang/dodge%20city/03_vera_custer_emwagk.png',
    hasActivePower: true,
    activePowerUsesLeft: 1,
  },
];

export const cardsThatDrawsOneWhenPlayed: CardName[] = ['dodge', 'bible', 'derringer'];

export const cardsActivatingMollyStarkPower: CardName[] = ['bang', 'missed', 'beer'];
