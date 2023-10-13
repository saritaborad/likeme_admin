import React, {useEffect, useState} from 'react'
import {acceptVideoReview, fetchAllVideoReview, rejectVideoReview} from '../ApiService/_requests'
import {ImgUrl} from '../const'
import {toast} from 'react-toastify'
import {useAuth} from '../app/modules/auth'

const ReviewVideo = () => {
  const [videos, setVideo] = useState([])
  const {currentUser} = useAuth()

  useEffect(() => {
    getAllVideo()
  }, [])

  const getAllVideo = async () => {
    const {data} = await fetchAllVideoReview()
    setVideo(data.videos)
  }

  const handleAccept = async (id: string) => {
    const {data} = await acceptVideoReview(id)
    data.status === 200 ? toast.success(data.message) : toast.error(data.message)
    getAllVideo()
  }

  const handleReject = async (id: string) => {
    const {data} = await rejectVideoReview(id)
    data.status === 200 ? toast.success(data.message) : toast.error(data.message)
    getAllVideo()
  }

  return (
    <div className='container-fluid'>
      <div className='card card-shadow ps-5'>
        <div className='card-header'>
          <h1 className='d-flex align-items-center'>Review Video</h1>
        </div>
        <div className='card-body'>
          <div className='row d-flex gap-10'>
            {videos &&
              videos?.length > 0 &&
              videos.map((item: any) => (
                <div className='col-2 card-shadow p-5' key={item._id}>
                  <div className='card col-12'>
                    <video controls>
                      <source src={ImgUrl + item.video} />
                    </video>
                    <div className='row d-flex px-3 mt-5  justify-content-between'>
                      {!currentUser?.is_tester && (
                        <>
                          <button className='col-5 btn-comn-success text-white px-3' onClick={() => handleAccept(item._id)}>
                            Accept
                          </button>
                          <button className='col-6 btn-comn-danger text-white px-3' onClick={() => handleReject(item._id)}>
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewVideo
