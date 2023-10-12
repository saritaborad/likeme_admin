import {Formik} from 'formik'
import React, {useState} from 'react'
import * as Yup from 'yup'
import {errorContainer, formAttr} from '../commonFun'
import {uploadImg} from '../ApiService/_requests'
import Cloud from '../Images/clould.svg'
import {ImgUrl} from '../const'

interface IPROPS {
  update?: any
  giftInfo?: any
  submitFormData?: any
  updateGift?: any
  appModalClose?: any
}

const AddGift: React.FC<IPROPS> = ({update, giftInfo, submitFormData, updateGift, appModalClose}) => {
  const [giftImg, setGiftImg] = useState<File | null>(null)
  const [imgUrl, setImgUrl] = useState()

  const handleImageUpload = async (file: any) => {
    const formData = new FormData()
    formData.append('image', file)
    const {data} = await uploadImg(formData)
    setImgUrl(data.imgUrl)
  }

  return (
    <div>
      <div className='modal-content'>
        <div className='modal-header'>
          <h4 className='modal-title' id='gifts-one'>
            {update ? 'Edit Gift' : 'Add Gift'}
          </h4>
          <button type='button' className='btn-close' onClick={appModalClose}></button>
        </div>
        <div className='modal-body'>
          <Formik
            enableReinitialize
            initialValues={{
              _id: giftInfo && giftInfo?._id,
              diamond: giftInfo?.diamond || 0,
            }}
            validationSchema={Yup.object({
              diamond: Yup.number().required('required.'),
            })}
            onSubmit={(formData, {resetForm}) => {
              update ? updateGift({...formData, images: imgUrl ? imgUrl : giftInfo.images}) : submitFormData({...formData, images: imgUrl})
            }}
          >
            {(runform) => (
              <form onSubmit={runform.handleSubmit}>
                <input type='hidden' name='_token' defaultValue='XY5iNbVG05Yv9SSQSapfD88c5Nb1VkQoaZXPAIrZ' />
                <div className='d-flex flex-column'>
                  <label htmlFor='imagefile'>
                    <img className='mb-3 rounded' height={120} width={120} id='giftimage-file' src={update ? (giftImg ? URL.createObjectURL(giftImg) : giftInfo ? ImgUrl + giftInfo?.images : Cloud) : giftImg ? URL.createObjectURL(giftImg) : Cloud} />
                  </label>
                  <label htmlFor='imagefile' className='form-label'>
                    Gift Image
                  </label>
                  <input
                    type='file'
                    id='imagefile'
                    className='imagefile form-control mb-2'
                    accept='image/png'
                    name='images'
                    onChangeCapture={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleImageUpload(e.target.files?.[0] || null)
                      setGiftImg(e.target.files?.[0] || null)
                    }}
                  />
                  <label> (Only PNG images are recommended)</label>
                </div>
                <div className='form-group mt-4'>
                  <label htmlFor='diamond'> Diamond</label>
                  <input type='number' className='form-control' required name='diamond' {...formAttr(runform, 'diamond')} />
                  {errorContainer(runform, 'diamond')}
                </div>
                <button type='submit' className='btn-comn-submit mt-4'>
                  {update ? 'Edit Gift' : 'Add Gift'}
                </button>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default AddGift
