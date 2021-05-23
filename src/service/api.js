import ajax from './ajax';

export const getCardList = (page = 1, per = 10) => ajax(`/card/items?page=${page}&per=${per}`);
