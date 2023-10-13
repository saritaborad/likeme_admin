import React, {useEffect, useState} from 'react'
import {fetchAllImageReview} from '../ApiService/_requests'
import {ImgUrl} from '../const'
import {useAuth} from '../app/modules/auth'

const ReviewImage = () => {
  const [images, setImages] = useState([])
  const {currentUser} = useAuth()

  useEffect(() => {
    getAllImages()
  }, [])

  const getAllImages = async () => {
    const {data} = await fetchAllImageReview()
    setImages(data.images)
  }
  return (
    <div className='container-fluid'>
      <div className='card card-shadow ps-5'>
        <div className='card-header'>
          <h1 className='d-flex align-items-center'>Review Images</h1>
        </div>
        <div className='card-body'>
          <div className='row d-flex gap-10'>
            {images &&
              images?.length > 0 &&
              images.map((item: any, i: number) => (
                <div className='col-2 card-shadow p-5' key={item._id}>
                  <div className='card col-12'>
                    <img alt='images' src={ImgUrl + item.image} />
                    <div className='row d-flex px-3 mt-5  justify-content-between'>
                      {!currentUser?.is_tester && (
                        <>
                          <button className='col-5 btn-comn-success text-white px-3'>Accept</button>
                          <button className='col-6 btn-comn-danger text-white px-3'>Reject</button>
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

export default ReviewImage
