import React, {useState} from 'react'

interface IPROPS {
  appModalClose?: any
  submitImageData?: any
}

const AddImage: React.FC<IPROPS> = ({appModalClose, submitImageData}) => {
  const [images, setImages] = useState<FileList | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    setImages(files)
  }

  return (
    <div>
      <div className='modal-content'>
        <div className='modal-header'>
          <h2>Add Images</h2>
          <button type='button' className='btn-close' onClick={appModalClose}></button>
        </div>
        <div className='modal-body'>
          <form onSubmit={(e) => submitImageData(e, images)}>
            <div id='divThumb' className='form-group'>
              <div className='mb-3'>
                <label htmlFor='image' className='form-label'>
                  Select Images
                </label>
                <input className='form-control' type='file' id='hostImages' name='images' accept='image/x-png,image/gif,image/jpeg' multiple onChange={handleFileChange} required />
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
