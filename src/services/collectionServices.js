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

  getAllBrandCollections: async (page = 1, size = 10) => {
    const response = await Axios.get(`getAllBrandCollections?page=${page}&size=${size}`)
    return response
  },
}

export default collectionServices;