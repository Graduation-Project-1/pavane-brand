import Axios from './Axios';

let advertisementServices = {
  addAdvertisement: async (obj) => {
    const response = await Axios.post(`addAdvertisement`, obj)
    return response
  },

  uploadImageAdvertisement: async (id, obj) => {
    const response = await Axios.post(`uploadImageAdvertisement/${id}`, obj)
    return response
  },

  getAdvertisementById: async (id) => {
    const response = await Axios.get(`getAdvertisementById/${id}`)
    return response
  },

  deleteAdvertisement: async (id) => {
    const response = await Axios.delete(`deleteAdvertisement/${id}`)
    return response
  },

  editAdvertisement: async (id, obj) => {
    const response = await Axios.put(`updateAdvertisement/${id}`, obj)
    return response
  },

  getAllAdvertisement: async () => {
    const response = await Axios.get(`getAllAdvertisement`)
    return response
  },

  addToArchive: async (id) => {
    const response = await Axios.put(`archiveAdvertisement/${id}`)
    return response
  },

  removeFromArchive: async (id) => {
    const response = await Axios.put(`disArchiveAdvertisement/${id}`)
    return response
  },
}

export default advertisementServices;