import axios from 'axios'
import {AuthModel} from './_models'
import {ApiBaseUrl} from '../../../../const'

export const GET_USER_BY_ACCESSTOKEN_URL = `${ApiBaseUrl}/verify_token`
export const LOGIN_URL = `${ApiBaseUrl}/login`
export const REGISTER_URL = `${ApiBaseUrl}/register`
export const REQUEST_PASSWORD_URL = `${ApiBaseUrl}/forgot_password`

// Server should return AuthModel
export function login(username: string, password: string, user_type: string, rememberme: boolean) {
  return axios.post<AuthModel>(LOGIN_URL, {username, password, user_type, rememberme}, {withCredentials: true})
}

// Server should return AuthModel
export function register(email: string, firstname: string, lastname: string, password: string) {
  return axios.post(REGISTER_URL, {email, firstname: firstname, lastname: lastname, password})
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  return axios.post<{result: boolean}>(REQUEST_PASSWORD_URL, {
    email,
  })
}

export function getUserByToken(token: string) {
  return axios
    .post(GET_USER_BY_ACCESSTOKEN_URL, {
      authtoken: token,
    })
    .then((res) => res.data)
}
