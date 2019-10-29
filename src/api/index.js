// 先导入axios
import axios from 'axios'
import local from '../utils/local'
import router from '../router/index'

axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// if (local.getUser()) {
//   axios.defaults.headers.Authorization = `bearer ${local.getUser().token}`
// }
axios.interceptors.request.use(config => {
  const user = local.getUser() || {}
  config.headers.Authorization = `Bearer ${user.token}`
  return config
}, error => Promise.reject(error))
axios.interceptors.response.use(res => res, error => {
  if (error.response.status === 401) {
    return router.push('/login')
  }
  return Promise.reject(error)
})
export default axios
