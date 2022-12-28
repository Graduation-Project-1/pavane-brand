import Axios from './Axios';

let brandServices = {
  uploadImageBrand: async (id, obj) => {
    const response = await Axios.post(`uploadImageBrand/${id}`, obj)
    return response
  },

  getBrandById: async () => {
    const response = await Axios.get(`getBrand`)
    return response
  },

  updateProfileBrand: async (obj) => {
    const response = await Axios.put(`updateProfileBrand`, obj)
    return response
  },
}

export default brandServices;