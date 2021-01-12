import Cookies from 'js-cookie'

const TokenKey = 'token'
const Name = 'user_n'
const LoginInfo = 'LoginInfo'
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function getName() {
  return Cookies.get(Name)
}

export function setName(name) {
  return Cookies.set(Name, name)
}

export function removeName() {
  return Cookies.remove(Name)
}
export function getLoginInfo() {
  return JSON.parse(Cookies.get(LoginInfo) || '{}')
}

export function setLoginInfo(info) {
  return Cookies.set(LoginInfo, JSON.stringify(info))
}

export function removeLoginInfo() {
  return Cookies.remove(LoginInfo)
}
