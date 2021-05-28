import ajax from './ajax';

export const getCardList = (page = 1, per = 10) => ajax(`/card/items?page=${page}&per=${per}`);

export const updateItemImageById = (id, base64) => ajax(`/card/updateImage/${id}`, 'put', { base64 }, true)

export const updateItemColorById = (id, color) => ajax(`/card/updateColor/${id}`, 'put', { color }, true)

export const updateItemImageColorById = (id, color, base64) => ajax(`/card/updateImageColor/${id}`, 'put', { base64, color }, true)
