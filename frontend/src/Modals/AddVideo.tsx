import React, {useState} from 'react'

interface IPROPS {
  appModalClose?: any
  submitVideoData?: any
}

const AddVideo: React.FC<IPROPS> = ({submitVideoData, appModalClose}) => {
  const [video, setVideo] = useState<any>()
  const [formData, setFormData] = useState<any>({is_one_to_one: 0, video_link: ''})

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    setVideo(files)
  }

  const handleChange = (e: any) => {
    if (e.target.name == 'is_one_to_one') {
      setFormData({...formData, [e.target.name]: e.target.checked ? 1 : 0})
    } else {
      setFormData({...formData, [e.target.name]: e.target.value})
    }
  }

  return (
    <div>
      <div className='modal-content'>
        <div className='modal-header'>
          <h2>Add video</h2>
          <button type='button' className='btn-close' onClick={appModalClose}></button>
        </div>
        <div className='modal-body'>
          <form onSubmit={(e) => submitVideoData(e, formData, video)}>
            <div id='divThumb' className='form-group'>
              <div className='mb-3'>
                <label htmlFor='hostVideos' className='form-label'>
                  Select Videos
                </label>
                <input className='form-control' type='file' id='hostVideos' name='video' accept='video/mp4,video/x-m4v,video/*' multiple onChange={(e) => handleFileChange(e)} />
              </div>
              <div className='mb-3 mt-6'>
                <label htmlFor='hostVideosurl' className='form-label'>
                  Video Link
                </label>
                <input className='form-control' type='text' name='video_link' id='video_link' value={formData.video_link} onChange={handleChange} />
              </div>
              <div className='mb-3 mt-6'>
                <label htmlFor='hostOneToOne' className='form-label'>
                  Is One to One ?
                </label>

                <input className='ms-4' type='checkbox' name='is_one_to_one' id='is_one_to_one' value={formData.is_one_to_one} onChange={handleChange} />
              </div>
            </div>
            <div className='form-group'>
              <input className='btn-comn-submit' type='submit' defaultValue=' Submit' />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddVideo
