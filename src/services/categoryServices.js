import Axios from './Axios';

let categoryServices = {
  addCategory: async (obj) => {
    const response = await Axios.post(`addCategory`, obj)
    return response
  },

  uploadImageCategory: async (id, obj) => {
    const response = await Axios.post(`uploadImageCategory/${id}`, obj)
    return response
  },

  getCategoryById: async (id) => {
    const response = await Axios.get(`getCategoryById/${id}`)
    return response
  },

  getAllCategories: async (page = 1, size = 10) => {
    const response = await Axios.get(`getAllCategories?page=${page}&size=${size}`)
    return response
  },
}

export default categoryServices;