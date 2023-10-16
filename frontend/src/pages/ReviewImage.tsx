import React, {useEffect, useState} from 'react'
import {acceptImageReview, fetchAllImageReview, rejectImageReview} from '../ApiService/_requests'
import {ImgUrl} from '../const'
import {useAuth} from '../app/modules/auth'
import Loader from '../Images/loader.gif'
import {toast} from 'react-toastify'

const ReviewImage = () => {
  const [images, setImages] = useState([])
  const [loader, setLoader] = useState(true)
  const {currentUser} = useAuth()

  useEffect(() => {
    getAllImages()
  }, [])

  const getAllImages = async () => {
    const {data} = await fetchAllImageReview()
    setImages(data.images)
    setLoader(false)
  }

  const handleAccept = async (id: string) => {
    const {data} = await acceptImageReview(id)
    data.status === 200 ? toast.success(data.message) : toast.error(data.message)
    getAllImages()
  }

  const handleReject = async (id: string) => {
    const {data} = await rejectImageReview(id)
    data.status === 200 ? toast.success(data.message) : toast.error(data.message)
    getAllImages()
  }

  return (
    <div className='container-fluid'>
      <div className='card card-shadow ps-5'>
        <div className='card-header'>
          <h1 className='d-flex align-items-center'>Review Images</h1>
        </div>
        {loader ? (
          <div className='loader-info-main'>
            <img src={Loader} alt='loader' />
          </div>
        ) : (
          <div className='card-body'>
            <div className='row d-flex gap-10'>
              {images && images?.length > 0 ? (
                images.map((item: any, i: number) => (
                  <div className='col-2 card-shadow p-5' key={item._id}>
                    <div className='card col-12'>
                      <img alt='images' src={ImgUrl + item.image} />
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
                ))
              ) : (
                <div className='fs-4'>Sorry, No matching records found!</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewImage
