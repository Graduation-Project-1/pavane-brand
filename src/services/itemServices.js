import Axios from './Axios';

let itemServices = {
  addItem: async (obj) => {
    const response = await Axios.post(`addItem`, obj)
    return response
  },

  uploadItemCover: async (id, obj) => {
    const response = await Axios.post(`uploadItemCover/${id}`, obj)
    return response
  },

  uploadItemImages: async (id, obj) => {
    const response = await Axios.post(`uploadImagesItem/${id}`, obj)
    return response
  },

  getItemById: async (id) => {
    const response = await Axios.get(`getItemById/${id}`)
    return response
  },

  updateItem: async (id, obj) => {
    const response = await Axios.put(`updateItem/${id}`, obj)
    return response
  },

  getAllBrandItems: async (page = 1, size = 10) => {
    const response = await Axios.get(`getAllBrandItems?page=${page}&size=${size}`)
    return response
  },

  getAllItemReviews: async (id, page = 1, size = 100) => {
    const response = await Axios.get(`getAllItemReviews/${id}?page=${page}&size=${size}`)
    return response
  },

  itemSearch: async (search) => {
    const response = await Axios.get(`itemSearch?${search.length > 0 ? `&search=${search}` : ""}`)
    return response
  },

  deleteItem: async (id) => {
    const response = await Axios.delete(`deleteItem/${id}`)
    return response
  },

  addToArchive: async (id) => {
    const response = await Axios.put(`archiveItem/${id}`)
    return response
  },

  removeFromArchive: async (id) => {
    const response = await Axios.put(`disArchiveItem/${id}`)
    return response
  },

  deleteImagesFromItem: async (id, obj) => {
    const response = await Axios.post(`deleteImagesFromItem/${id}`, obj)
    return response
  },
}

export default itemServices;