import axios from 'axios'
import {API_PATH} from '../const'

function uploadAdapter(loader) {
  return {
    upload: () => {
      return new Promise((resolve, reject) => {
        const body = new FormData()
        loader.file.then((file) => {
          body.append('images', file)

          axios
            .post(API_PATH.uploadImg, body)

            .then((res) => {
              resolve({default: res.data?.data?.img[0]})
            })
            .catch((err) => {
              reject(err)
            })
        })
      })
    },
  }
}

export function uploadPlugin(editor) {
  editor.plugins._plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return uploadAdapter(loader)
  }
}
