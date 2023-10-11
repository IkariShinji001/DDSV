import axios from 'axios'

const commonConfig = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
}
export default (endpoint) => {
  return axios.create({
    baseURL: 'http://localhost:3000/api/v1' + endpoint,
    ...commonConfig
  })
}
