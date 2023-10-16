import {Formik} from 'formik'
import {Modal} from 'react-bootstrap'
import * as Yup from 'yup'
import React, {useRef, useState} from 'react'
import {errorContainer, formAttr, handleImageUpload} from '../commonFun'
import Cloud from '../Images/clould.svg'
import {ImgUrl} from '../const'
import {useAllCountry} from '../hooks/customHook'

interface IPROPS {
  update?: any
  submitFormData?: any
  updateAgent?: any
  appModalClose?: any
  agentInfo?: any
}

const AddAgentModal: React.FC<IPROPS> = ({update, submitFormData, updateAgent, appModalClose, agentInfo}) => {
  const agentRef = useRef(null)
  const [agentImg, setAgentImg] = useState<File | null>(null)
  const [imgUrl, setImgUrl] = useState([])
  const country = useAllCountry()

  return (
    <>
      <Modal.Body>
        <div className='modal-content'>
          <div className='modal-header'>
            <h3 className='modal-title' id='agents-one'>
              {update ? 'Edit Agent' : 'Add Agent'}
            </h3>
            <button type='button' className='btn-close' onClick={appModalClose}></button>
          </div>
          <div className='modal-body'>
            <Formik
              innerRef={agentRef}
              enableReinitialize
              initialValues={{
                _id: agentInfo && agentInfo?._id,
                name: agentInfo?.name || '',
                email_id: agentInfo?.email_id || '',
                password: agentInfo?.password || '',
                phone_no: agentInfo?.phone_no || '',
                country: agentInfo?.country?._id || '',
                status: agentInfo?.status == 0 ? 0 : 1 || '',
                coins: agentInfo?.coins || 0,
                coins_rate: agentInfo?.coins_rate || 0,
                stream_minute: agentInfo?.stream_minute || 0,
                stream_rate: agentInfo?.stream_rate || 0,
              }}
              validationSchema={Yup.object({
                name: Yup.string().required('required.'),
                email_id: Yup.string().required('required.'),
                password: Yup.string().required('required.'),
                phone_no: Yup.string().required('required.'),
                country: Yup.string().required('required.'),
                coins: Yup.number().required('required.'),
                coins_rate: Yup.number().required('required.'),
                stream_minute: Yup.number().required('required.'),
                stream_rate: Yup.number().required('required.'),
              })}
              onSubmit={(formData, {resetForm}) => {
                update ? updateAgent({...formData, status: formData.status == 1 ? 1 : 0, images: imgUrl ? imgUrl[0] : agentInfo?.image}) : submitFormData({...formData, status: formData.status == 1 ? 1 : 0, images: imgUrl[0]})
              }}
            >
              {(runform) => (
                <form onSubmit={runform.handleSubmit}>
                  <input type='hidden' name='_token' defaultValue='CYlHZ6YicNVJKJHPNa1bTjPYMcTZ39cOxchOc4Ck' />{' '}
                  <div className='d-flex flex-column pb-4'>
                    <label htmlFor='imagefile'>
                      <img className='mb-3 rounded' height={120} width={120} id='agentimage-file' src={update ? (agentImg ? URL.createObjectURL(agentImg) : agentInfo ? ImgUrl + agentInfo?.images : Cloud) : agentImg ? URL.createObjectURL(agentImg) : Cloud} alt='' />
                    </label>
                    {/* <label htmlFor='imagefile' className='form-label'>
                      Agents Image
                    </label> */}
                    <input
                      type='file'
                      id='imagefile'
                      className='imagefile form-control mt-3'
                      accept='image/png'
                      name='images'
                      onChangeCapture={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleImageUpload(e.target.files?.[0] || null, setImgUrl)
                        setAgentImg(e.target.files?.[0] || null)
                      }}
                      required
                    />
                    <label> (Only PNG images are recommended)</label>
                  </div>
                  <div className='form-group pb-4'>
                    <label htmlFor='name'> Name</label>
                    <input type='text' className='form-control' required name='name' {...formAttr(runform, 'name')} />
                    {errorContainer(runform, 'name')}
                  </div>
                  <div className='form-group pb-4'>
                    <label htmlFor='email_id'> Email</label>
                    <input type='email' className='form-control' required name='email_id' {...formAttr(runform, 'email_id')} />
                    {errorContainer(runform, 'email_id')}
                  </div>
                  <div className='form-group pb-4'>
                    <label htmlFor='password'> Password</label>
                    <input type='password' className='form-control' required name='password' {...formAttr(runform, 'password')} />
                    {errorContainer(runform, 'password')}
                  </div>
                  <div className='form-group pb-4'>
                    <label htmlFor='phone_no'> Phone No</label>
                    <input type='text' className='form-control' required name='phone_no' {...formAttr(runform, 'phone_no')} />
                    {errorContainer(runform, 'phone_no')}
                  </div>
                  <div className='form-group pb-4'>
                    <div className='row'>
                      <div className='form-group col-md-8'>
                        <label htmlFor='contry'> Country</label>
                        <select className='form-control' name='country' id='agent-contry_add' {...formAttr(runform, 'country')}>
                          <option value='' disabled>
                            select country
                          </option>
                          {country?.length > 0 &&
                            country?.map((item: any, i) => {
                              return (
                                <option key={i} value={item._id} id={item.country_name}>
                                  {item.country_name}
                                </option>
                              )
                            })}
                        </select>
                        {errorContainer(runform, 'country')}
                      </div>
                      <div className='form-group col-md-4'>
                        <label htmlFor='status'> Status</label>
                        <select className='form-control' name='status' {...formAttr(runform, 'status')}>
                          <option value='' disabled>
                            Choose Status
                          </option>
                          <option value={1}>On</option>
                          <option value={0}>Off</option>
                        </select>
                        {errorContainer(runform, 'status')}
                      </div>
                    </div>
                  </div>
                  <div className='form-group pb-4'>
                    <div className='row'>
                      <div className='form-group col-md-6'>
                        <label htmlFor='coins'> Coins</label>
                        <input type='number' className='form-control' required name='coins' {...formAttr(runform, 'coins')} />
                        {errorContainer(runform, 'coins')}
                      </div>
                      <div className='form-group col-md-6'>
                        <label htmlFor='coins_rate'> Rate in $</label>
                        <input type='number' className='form-control' required name='coins_rate' {...formAttr(runform, 'coins_rate')} />
                        {errorContainer(runform, 'coins_rate')}
                      </div>
                    </div>
                  </div>
                  <div className='form-group pb-4'>
                    <div className='row'>
                      <div className='form-group col-md-6'>
                        <label htmlFor='stream_minits'> Stream Minits</label>
                        <input type='number' className='form-control' required name='stream_minute' {...formAttr(runform, 'stream_minute')} />
                        {errorContainer(runform, 'stream_minute')}
                      </div>
                      <div className='form-group col-md-6'>
                        <label htmlFor='stream_rate'> Rate in $</label>
                        <input type='number' className='form-control' required name='stream_rate' {...formAttr(runform, 'stream_rate')} />
                        {errorContainer(runform, 'stream_rate')}
                      </div>
                    </div>
                  </div>
                  <button type='submit' className='btn-comn-submit mt-3'>
                    {update ? 'Edit Agent' : 'Add Agent'}
                  </button>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </Modal.Body>
    </>
  )
}

export default AddAgentModal
