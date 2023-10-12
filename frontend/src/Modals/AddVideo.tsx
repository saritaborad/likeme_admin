import React, {useState} from 'react'

import {toast} from 'react-toastify'
import {addHostVideo} from '../ApiService/_requests'

interface IPROPS {
  appModalClose?: any
  HostId?: any
  getAllVideo?: any
}

const AddVideo: React.FC<IPROPS> = ({HostId, appModalClose, getAllVideo}) => {
  const [video, setVideo] = useState<any>()
  const [formData, setFormData] = useState<any>({is_one_to_one: 0, video_link: ''})

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    setVideo(files)
    // const videoWithThumb: any = []

    // if (files) {
    //   for (let i = 0; i < files.length; i++) {
    //     generateThumbnail(files[i], (thumbnailUrl: any, blob: any) => {
    //       const thumbnailFile: any = new File([blob], files[i]?.name, {type: 'image/jpeg', lastModified: Date.now()})

    //       videoWithThumb.push({video: files[i], thumbnail: thumbnailFile})
    //     })
    //   }
    //   setVideo(videoWithThumb)
    // }
  }

  // const generateThumbnail = (file: any, callback: any) => {
  //   const reader = new FileReader()

  //   reader.onload = (event: any) => {
  //     const thumbnailUrl = event.target.result
  //     const blob = new Blob([thumbnailUrl], {type: 'image/jpeg'})
  //     callback(thumbnailUrl, blob)
  //   }

  //   reader.readAsDataURL(file)
  // }

  const handleChange = (e: any) => {
    if (e.target.name == 'is_one_to_one') {
      setFormData({...formData, [e.target.name]: e.target.checked ? 1 : 0})
    } else {
      setFormData({...formData, [e.target.name]: e.target.value})
    }
  }

  const submitVideoData = async (e: any) => {
    e.preventDefault()

    if (!video || video.length === 0) {
      toast.error('No video selected')
      return
    }

    const form = new FormData()

    for (let i = 0; i < video.length; i++) {
      form.append(`video`, video[i])
    }
    // form.append(`thumbnail_image`, video[i]?.thumbnail)
    form.append('is_one_to_one', formData.is_one_to_one)
    form.append('video_link', formData.video_link)
    form.append('_id', HostId)

    const {data} = await addHostVideo(form)
    data.status === 200 ? toast.success(data.message) : toast.error(data.message)
    getAllVideo(HostId)
    appModalClose()
  }

  return (
    <div>
      <div className='modal-content'>
        <div className='modal-header'>
          <h2>Add video</h2>
          <button type='button' className='btn-close' onClick={appModalClose}></button>
        </div>
        <div className='modal-body'>
          <form onSubmit={submitVideoData}>
            <input type='hidden' name='_token' defaultValue='h4EUazoGfaQ51uVJB3ElWaew8FIoFX1G63DY3p0y' />
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
