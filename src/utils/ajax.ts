import axios from 'axios'

const service = axios.create({
  baseURL: 'http://kane1213.synology.me:7013',
  timeout: 5000
})

service.interceptors.request.use(
  config => {
    const token = window.localStorage.getItem('accessToken')
    if (token) {
      config.headers.common.Authorization = token;
    }
    return config
  },
  error => Promise.reject(error)
)

service.interceptors.response.use(
  response => {
    const res = response.data;

    if (response.status !== 200) {
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => Promise.reject(error)
)

export default service;
