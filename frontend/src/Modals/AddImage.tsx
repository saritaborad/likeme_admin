import React, {useState} from 'react'
import {handleImageUpload} from '../commonFun'
import {addHostImages} from '../ApiService/_requests'
import {toast} from 'react-toastify'

interface IPROPS {
  appModalClose?: any
  HostId?: any
  getAllImage?: any
}

const AddImage: React.FC<IPROPS> = ({HostId, appModalClose, getAllImage}) => {
  const [images, setImages] = useState<FileList | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    setImages(files)
  }

  const submitImageData = async (e: any) => {
    e.preventDefault()
    if (!images || images.length === 0) {
      toast.error('No image selected')
      return
    }

    const formData = new FormData()

    for (let i = 0; i < images.length; i++) {
      formData.append(`images`, images[i])
    }
    formData.append('_id', HostId)

    const {data} = await addHostImages(formData)
    data.status === 200 ? toast.success(data.message) : toast.error(data.message)
    getAllImage(HostId)
    appModalClose()
  }

  return (
    <div>
      <div className='modal-content'>
        <div className='modal-header'>
          <h2>Add Images</h2>
          <button type='button' className='btn-close' onClick={appModalClose}></button>
        </div>
        <div className='modal-body'>
          <form onSubmit={submitImageData}>
            <input type='hidden' name='_token' defaultValue='EjAY5yPivM7ZAH2SisFwbB3rRK2Fj1AFLwH6sPuE' />
            <div id='divThumb' className='form-group'>
              <div className='mb-3'>
                <label htmlFor='image' className='form-label'>
                  Select Images
                </label>
                <input className='form-control' type='file' id='hostImages' name='images' accept='image/x-png,image/gif,image/jpeg' multiple onChange={handleFileChange} />
              </div>
            </div>
            <div className='form-group mt-5'>
              <input className='btn-comn-submit mr-1' type='submit' />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddImage
