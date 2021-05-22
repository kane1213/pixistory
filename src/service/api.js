import ajax from './ajax';

export const getCardList = () => ajax('/card/items');