import decode from 'jwt-decode'
import router from '@/router'
import axios from 'axios'
import request from '@/services/config'

const http = axios.create({
  baseURL: process.env.VUE_APP_API_URL
})

export const handleLogin = data => {
  return http.post('api/token/', data)
}

export const setToken = async (response) => {
  try {
    localStorage.setItem('semob@accessToken', response.data.access)
    localStorage.setItem('semob@refreshToken', response.data.refresh)
    const userInfoResponse = await request.get('/api/user-info/')
    const userInfo = userInfoResponse.data
    localStorage.setItem('semob@user', JSON.stringify(userInfo))
    router.push('/')
  } catch (error) {
    console.error('Error setting token:', error)
  }
}

export const renewUser = async () => {
  try {
    const userInfoResponse = await request.get('/api/user-info/')
    const userInfo = userInfoResponse.data
    localStorage.setItem('semob@user', JSON.stringify(userInfo))
    window.location.reload()
  } catch (error) {
    console.error('Error setting user:', error)
  }
}

export const isValidToken = token => {
  if (!token) {
    return false
  }

  const decoded = decode(token)
  const currentTime = Date.now() / 1000
  return decoded.exp > currentTime
}

export const refreshToken = async () => {
  http
    .post('api/token/refresh/', {refresh: localStorage.getItem('semob@refreshToken')})
    .then(res => {
      localStorage.setItem('semob@accessToken', res.data.access)
      localStorage.setItem('semob@user', JSON.stringify(decode(res.data.access)))
    })
    .catch(() => {
      clearToken()
    })
}

export const clearToken = () => {
  localStorage.removeItem('semob@accessToken')
  localStorage.removeItem('semob@refreshToken')
  localStorage.removeItem('semob@user')
}