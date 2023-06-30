import Axios from './Axios';

let saleServices = {
  addSale: async (obj) => {
    const response = await Axios.post(`addSale`, obj)
    return response
  },

  uploadImageSale: async (id, obj) => {
    const response = await Axios.post(`uploadImageSale/${id}`, obj)
    return response
  },

  getAllSales: async (page = 1, size = 10) => {
    const response = await Axios.get(`getAllBrandSales?page=${page}&size=${size}`)
    return response
  },

  saleSearch: async (search) => {
    const response = await Axios.get(`saleSearch?${search.length > 0 ? `&search=${search}` : ""}`)
    return response
  },

  getMostLikedSales: async () => {
    const response = await Axios.get(`getMostLikedSales`)
    return response
  },

  getSaleById: async (id) => {
    const response = await Axios.get(`getSaleById/${id}`)
    return response
  },

  editSale: async (id, obj) => {
    const response = await Axios.put(`updateSale/${id}`, obj)
    return response
  },

  deleteSale: async (id) => {
    const response = await Axios.delete(`deleteSale/${id}`)
    return response
  },

  addToArchive: async (id) => {
    const response = await Axios.put(`archiveSale/${id}`)
    return response
  },

  removeFromArchive: async (id) => {
    const response = await Axios.put(`disArchiveSale/${id}`)
    return response
  },
}

export default saleServices;