import axios from 'axios'

export function GetApi(path) {
  let token = ''
  if (localStorage.getItem('startgeekuser')) {
    token = 'Bearer ' + localStorage.getItem('startgeekuser')
  }
  let headers = {Authorization: token, 'Content-Type': 'application/json'}
  const GetApiData = axios
    .get(path, {headers: headers})
    .then((response) => {
      return response
    })
    .catch((err) => {
      console.log(err)
      if (err.response.status === 401) {
        window.location.href = '/login'
      }
      return err.response
    })
  return GetApiData
}

export function PostApi(path, body, type) {
  let Ctype = type === 'image' ? 'multipart/form-data' : 'application/json'
  let token = ''
  if (localStorage.getItem('startgeekuser')) {
    token = 'Bearer ' + localStorage.getItem('startgeekuser')
  }
  let headers = {Authorization: token, 'Content-Type': Ctype, Accept: 'application/pdf'}
  const PostApiData = axios
    .post(path, body, {headers: headers})
    .then((response) => {
      return response
    })
    .catch((err) => {
      if (err.response.status === 401) {
        window.location.href = '/login'
      }
      return err.response
    })
  return PostApiData
}
