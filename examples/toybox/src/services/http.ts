import Cookies from 'universal-cookie'
import Axios from 'axios'

const cookies = new Cookies()

export const getToken = () => {
  const token = cookies.get('_hrm_airclass_key')
  const lower = token?.toLowerCase()
  if (token) {
    const bool = lower.startsWith('bearer ')
    if (bool) return token
    return 'bearer ' + token
  }
  return token
}

export const appId = 'default'

export const baseURL = '/web'

export const http = Axios.create({
  baseURL,
  headers: {
    Authorization: getToken(),
  },
})
