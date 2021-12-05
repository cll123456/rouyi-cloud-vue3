import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

const ExpiresInKey = 'Admin-Expires-In'
/**
 * 获取token
 * @returns 
 */
export function getToken() {
  return Cookies.get(TokenKey)
}
/**
 * 设置token
 * @param {*} token 
 * @returns 
 */
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

/**
 * 删除token
 * @returns 
 */
export function removeToken() {
  return Cookies.remove(TokenKey)
}
/**
 * 获取有效期
 * @returns 
 */
export function getExpiresIn() {
  return Cookies.get(ExpiresInKey) || -1
}
/**
 * 设置有效期
 * @param {*} time 
 * @returns 
 */
export function setExpiresIn(time) {
  return Cookies.set(ExpiresInKey, time)
}
/**
 * 移除有效期
 * @returns 
 */
export function removeExpiresIn() {
  return Cookies.remove(ExpiresInKey)
}
