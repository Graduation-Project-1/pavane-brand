import Axios from './Axios';

let authServices = {
  login: async (obj) => {
    const response = await Axios.post(`loginBrand`, obj)
    return response
  },
}

export default authServices;