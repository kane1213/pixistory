import ajax from './ajax';

export const getCardList = (page = 1, per = 10, params = '') => ajax(`/card/items?page=${page}&per=${per}${params}`);

export const getCategoryOptions = () => ajax('/category/categoryOptions');

export const getCategories = () => ajax('/category/items');

export const updateItemImageById = (id, base64) => ajax(`/card/updateImage/${id}`, 'put', { base64 }, true)

export const updateItemColorById = (id, color) => ajax(`/card/updateColor/${id}`, 'put', { color }, true)

export const updateItemImageColorById = (id, color, base64) => ajax(`/card/updateImageColor/${id}`, 'put', { base64, color }, true)

export const addCardItem = data => ajax('/card/addNewItem', 'post', data, true)
