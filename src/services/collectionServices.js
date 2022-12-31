import Axios from './Axios';

let collectionServices = {
  addCollection: async (obj) => {
    const response = await Axios.post(`addCollection`, obj)
    return response
  },

  uploadImageCollection: async (id, obj) => {
    const response = await Axios.post(`uploadImageCollection/${id}`, obj)
    return response
  },

  getCollectionById: async (id) => {
    const response = await Axios.get(`getCollectionById/${id}`)
    return response
  },

  getAllBrandCollections: async (page = 1, size = 10) => {
    const response = await Axios.get(`getAllBrandCollections?page=${page}&size=${size}`)
    return response
  },

  updateCollection: async (id, obj) => {
    const response = await Axios.put(`updateCollection/${id}`, obj)
    return response
  },


  deleteCollection: async (id) => {
    const response = await Axios.delete(`deleteCollection/${id}`)
    return response
  },

}

export default collectionServices;